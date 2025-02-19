import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Network from "expo-network";
import * as SplashScreen from "expo-splash-screen";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import bundle from "../../assets/bundle.json";
import { auth } from "../../firebaseConfig";
import { coversList } from "../utils/covers";
import { ConstantsContext } from "./constants";
import { HistoryContext } from "./history";
import { LoadingContext } from "./loading";
import { RefreshContext } from "./refresh";
import { ServerContext } from "./server";
import { TutorialContext } from "./tutorial";
import { UserContext } from "./user";

export const DataContext = createContext<any>(null);

export interface AlbumType {
    id: string;
    type: "album" | "personal" | "favorite" | "extra";
    title: string;
    songs: string[];
    creatorName: string | null;
    creator: string | null;
    favorite: boolean;
    date: string;
    cover: string | null | string[];
}

export interface SongType {
    id: string;
    type: "song" | "extra";
    title: string;
    artist: string | null;
    cover: string | null;
    lyrics: string;
    favorite: boolean;
    date: string;
    order: string | null;
    initialChord: string | null;
    extraData: {
        link: string | null;
        year: string | null;
        originalTitle: string | null;
        verses: string[] | null;
    } | null;
}

export interface UpdateType {
    id: string;
    title: string;
    cover: string | null;
    artist: string | null;
    type: "song" | "album";
    updateType: "new" | "update" | "delete";
}

export const DataProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const { user, setUser } = useContext(UserContext);
    const { updateRefresh } = useContext(RefreshContext);
    const { history, removeFromHistory, deleteHistory } =
        useContext(HistoryContext);
    const {
        getUserData,
        addFavorite,
        removeFavorite,
        createPersonalAlbum: createPersonalAlbumServer,
        updatePersonalAlbumsList,
        updatePersonalAlbum: updatePersonalAlbumServer,
        deletePersonalAlbum: deletePersonalAlbumServer,
        getPersonalAlbum: getPersonalAlbumServer,
        checkUpdates,
        getVersion,
        saveCover,
        deleteCover,
        getUserDisplayName,
        removePersonalAlbum,
        checkIfUserExists,
    } = useContext(ServerContext);
    const { resetConstants } = useContext(ConstantsContext);
    const { resetTutorial } = useContext(TutorialContext);
    const { setSyncLoading } = useContext(LoadingContext);

    const [version, setVersion] = useState<string | null>(null);
    const [songIds, setSongIds] = useState<string[] | null>(null);
    const [albumIds, setAlbumIds] = useState<string[] | null>(null);
    const [personalAlbumsIds, setPersonalAlbumsIds] = useState<string[] | null>(
        null
    );
    const [favoriteIds, setFavoriteIds] = useState<string[] | null>(null);
    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [updates, setUpdates] = useState<string[] | null>(null);

    const loadData = async () => {
        const clear = async () => {
            setSongIds([]);
            setAlbumIds([]);
            setPersonalAlbumsIds([]);
            setFavoriteIds([]);

            await AsyncStorage.clear();
            await AsyncStorage.multiRemove([
                "version",
                "loaded",
                "songIds",
                "albumIds",
                "recent",
                "history",
                "onboard",
                "user",
                "language",
                "personalAlbumsIds",
                "favoriteIds",
            ]);

            setUser(null);

            updateRefresh();
        };

        const firstLoad = async () => {
            await clear();

            await addData();

            await AsyncStorage.setItem("loaded", "true");
        };

        const readLists = async () => {
            const storedSongs = await AsyncStorage.getItem("songIds");
            const storedAlbums = await AsyncStorage.getItem("albumIds");
            const storedPersonalAlbums =
                await AsyncStorage.getItem("personalAlbumsIds");
            const storedFavorites = await AsyncStorage.getItem("favoriteIds");

            let sortedSongs: string[] | null = [];
            let sortedAlbums: string[] | null = [];
            let personalAlbums: string[] | null = [];
            let favorites: string[] | null = [];

            if (storedSongs !== null) {
                sortedSongs = JSON.parse(storedSongs).sort(
                    (a: string, b: string) => {
                        const aNum = parseInt(a.slice(1));
                        const bNum = parseInt(b.slice(1));

                        return aNum - bNum;
                    }
                );

                setSongIds(sortedSongs);
            }

            if (storedAlbums !== null) {
                sortedAlbums = JSON.parse(storedAlbums).sort(
                    (a: string, b: string) => {
                        const aNum = parseInt(a.slice(1));
                        const bNum = parseInt(b.slice(1));

                        return aNum - bNum;
                    }
                );

                setAlbumIds(sortedAlbums);
            }

            if (storedPersonalAlbums !== null) {
                personalAlbums = JSON.parse(storedPersonalAlbums);

                if (personalAlbums)
                    setPersonalAlbumsIds(
                        personalAlbums.sort((a: string, b: string) => {
                            const aNum = parseInt(a.slice(1));
                            const bNum = parseInt(b.slice(1));

                            return aNum - bNum;
                        })
                    );
            }

            if (storedFavorites !== null) {
                favorites = JSON.parse(storedFavorites);
                setFavoriteIds(favoriteIds);
            }

            return {
                songs: sortedSongs,
                albums: sortedAlbums,
                personalAlbums,
                favorites,
            };
        };

        const filterHistory = async () => {
            if (!songIds || !albumIds || !history) return;

            if (history !== null) {
                for (const item of history) {
                    if (item.type === "song") {
                        if (!songIds.includes(item.id))
                            removeFromHistory(item.id);
                    } else if (item.type === "album") {
                        if (!albumIds.includes(item.id))
                            removeFromHistory(item.id);
                    }
                }
            }
        };

        const checkForUpdates = async (
            songs: string[] | null = songIds,
            albums: string[] | null = albumIds
        ) => {
            const version = await AsyncStorage.getItem("version");

            if (version === null) await updateData(songs, albums);
            else await updateData(songs, albums, version);
        };

        const initialize = async () => {
            // await clear();

            if (user === null) {
                SplashScreen.hideAsync();
                setLoadingData(false);
                return;
            }
            setLoadingData(true);
            const networkState = await Network.getNetworkStateAsync();
            const hasInternet = networkState.isConnected;
            const lists = await readLists();
            const loaded = await AsyncStorage.getItem("loaded");
            if (hasInternet) {
                if (!(await checkIfUserExists())) {
                    await auth.signOut();
                    await clearData();
                    setUser(null);
                    SplashScreen.hideAsync();
                    return;
                }
                if (loaded === null) await firstLoad();
                else await checkForUpdates(lists.songs, lists.albums);
            } else console.warn("No internet connection");
            if (user) {
                filterHistory();
                (async () => {
                    try {
                        if (hasInternet) {
                            await syncFavorites(lists.favorites);
                            await syncPersonalAlbums(lists.personalAlbums);
                        }
                        updateRefresh();
                    } catch (error) {
                        console.error("Error syncing data:", error);
                    } finally {
                        setLoadingData(false);
                    }
                })();
            } else {
                setLoadingData(false);
            }

            SplashScreen.hideAsync();
        };

        initialize();
    };

    useEffect(() => {
        if (songIds === null) return;
        AsyncStorage.setItem("songIds", JSON.stringify(songIds));
    }, [songIds]);

    useEffect(() => {
        if (albumIds === null) return;
        AsyncStorage.setItem("albumIds", JSON.stringify(albumIds));
    }, [albumIds]);

    useEffect(() => {
        if (personalAlbumsIds === null) return;
        AsyncStorage.setItem(
            "personalAlbumsIds",
            JSON.stringify(personalAlbumsIds)
        );
    }, [personalAlbumsIds]);

    useEffect(() => {
        if (favoriteIds === null) return;
        AsyncStorage.setItem("favoriteIds", JSON.stringify(favoriteIds));
    }, [favoriteIds]);

    useEffect(() => {
        if (version === null) return;
        AsyncStorage.setItem("version", version);
    }, [version]);

    const addData = async () => {
        const data = await checkUpdates();

        if (data) {
            let songIds = [];

            for (let i = 0; i < data.songs.length; i++) {
                const cover = data.songs[i].cover;

                if (cover && !coversList.includes(cover)) {
                    const uri = await saveCover(cover);

                    const song = {
                        ...data.songs[i],
                        cover: uri,
                        favorite: false,
                        date: new Date().toISOString(),
                        type: data.songs[i].type as "song" | "extra",
                    };

                    writeSong(song, false);

                    songIds.push(song.id);
                } else {
                    const song = {
                        ...data.songs[i],
                        favorite: false,
                        date: new Date().toISOString(),
                        type: data.songs[i].type as "song" | "extra",
                    };

                    writeSong(song, false);

                    songIds.push(song.id);
                }
            }

            setSongIds(songIds);

            let albumIds = [];

            for (let i = 0; i < data.albums.length; i++) {
                const cover = data.albums[i].cover;

                if (cover && !coversList.includes(cover)) {
                    const uri = await saveCover(cover);

                    const album = {
                        ...data.albums[i],
                        cover: uri,
                        favorite: false,
                        date: new Date().toISOString(),
                        type: data.albums[i].type as
                            | "album"
                            | "extra"
                            | "favorite"
                            | "personal",
                    };

                    writeAlbum(album, false);

                    albumIds.push(album.id);
                } else {
                    const album = {
                        ...data.albums[i],
                        favorite: false,
                        date: new Date().toISOString(),
                        type: data.albums[i].type as
                            | "album"
                            | "extra"
                            | "favorite"
                            | "personal",
                    };

                    writeAlbum(album, false);

                    albumIds.push(album.id);
                }
            }

            setAlbumIds(albumIds);
        } else {
            let songIds = [];

            for (let i = 0; i < bundle.songs.length; i++) {
                const song = {
                    ...bundle.songs[i],
                    favorite: false,
                    date: new Date().toISOString(),
                    type: bundle.songs[i].type as "song" | "extra",
                };

                writeSong(song, false);

                songIds.push(song.id);
            }

            setSongIds(songIds);

            let albumIds = [];

            for (let i = 0; i < bundle.albums.length; i++) {
                const album = {
                    ...bundle.albums[i],
                    favorite: false,
                    date: new Date().toISOString(),
                    creatorName: null,
                    type: bundle.albums[i].type as
                        | "album"
                        | "extra"
                        | "favorite"
                        | "personal",
                };

                writeAlbum(album);

                albumIds.push(album.id);
            }

            setAlbumIds(albumIds);

            setVersion(bundle.version);
        }
    };

    const resetData = () => {
        if (!songIds || !albumIds) return Promise.resolve();

        const songPromises = songIds.map((id) => setFavorite(id, false, false));
        const albumPromises = albumIds.map((id) =>
            setFavorite(id, false, false)
        );

        return Promise.all([...songPromises, ...albumPromises]);
    };

    const updateData = async (
        songs: string[] | null = songIds,
        albums: string[] | null = albumIds,
        vers: string | null = version
    ) => {
        const newVersion = await getVersion();

        if (vers && newVersion.split(".")[1] !== vers.split(".")[1]) {
            console.log("Major updates available: " + newVersion);
            await reloadAllData();
            return;
        } else if (newVersion === vers) {
            console.log("No updates available: " + newVersion);
            return;
        } else console.log("Updates available: " + newVersion);

        const data = await checkUpdates();

        if (!songs || !albums) return;

        let extraSongs = [];
        let extraAlbums = [];
        const newUpdates: UpdateType[] = [];

        if (data) {
            for (let i = 0; i < data.songs.length; i++) {
                if (!songs.find((id) => id === data.songs[i].id)) {
                    const cover = data.songs[i].cover;

                    if (cover && !coversList.includes(cover)) {
                        const uri = await saveCover(cover);
                        await writeSong(
                            {
                                ...data.songs[i],
                                cover: uri,
                                favorite: false,
                                date: new Date().toISOString(),
                                type: data.songs[i].type as "song" | "extra",
                            },
                            false
                        );
                    } else {
                        await writeSong(
                            {
                                ...data.songs[i],
                                favorite: false,
                                date: new Date().toISOString(),
                                type: data.songs[i].type as "song" | "extra",
                            },
                            false
                        );
                    }
                    extraSongs.push(data.songs[i].id);

                    newUpdates.push({
                        id: data.songs[i].id,
                        title: data.songs[i].title,
                        cover: data.songs[i].cover || null,
                        type: "song",
                        artist: data.songs[i].artist || null,
                        updateType: "new",
                    });
                }
            }

            for (let i = 0; i < data.albums.length; i++) {
                if (!albums.find((id) => id === data.albums[i].id)) {
                    const cover = data.albums[i].cover;

                    if (cover && !coversList.includes(cover)) {
                        const uri = await saveCover(cover);
                        await writeAlbum(
                            {
                                ...data.albums[i],
                                cover: uri,
                                favorite: false,
                                date: new Date().toISOString(),
                                creatorName: null,
                                type: data.albums[i].type as
                                    | "album"
                                    | "extra"
                                    | "favorite"
                                    | "personal",
                            },
                            false
                        );
                    } else {
                        await writeAlbum(
                            {
                                ...data.albums[i],
                                favorite: false,
                                date: new Date().toISOString(),
                                creatorName: null,
                                type: data.albums[i].type as
                                    | "album"
                                    | "extra"
                                    | "favorite"
                                    | "personal",
                            },
                            false
                        );
                    }
                    extraAlbums.push(data.albums[i].id);

                    newUpdates.push({
                        id: data.albums[i].id,
                        title: data.albums[i].title,
                        cover: data.albums[i].cover || null,
                        type: "album",
                        artist: null,
                        updateType: "new",
                    });
                }
            }

            for (let i = 0; i < data.updated.length; i++) {
                if (data.updated[i].startsWith("S")) {
                    const song = await getSongById(data.updated[i]);
                    const newSong = data.songs.find(
                        (s: SongType) => s.id === data.updated[i]
                    );

                    if (
                        newSong &&
                        JSON.stringify(song) !== JSON.stringify(newSong)
                    ) {
                        if (
                            newSong.cover &&
                            !coversList.includes(newSong.cover)
                        ) {
                            const uri = await saveCover(newSong.cover);
                            await writeSong(
                                {
                                    ...song,
                                    ...newSong,
                                    date: new Date().toISOString(),
                                    cover: uri,
                                },
                                false
                            );
                        } else {
                            await writeSong(
                                {
                                    ...song,
                                    ...newSong,
                                    date: new Date().toISOString(),
                                },
                                false
                            );
                        }

                        newUpdates.push({
                            id: data.updated[i],
                            title: newSong.title,
                            cover: newSong.cover || null,
                            type: "song",
                            artist: newSong.artist || null,
                            updateType: "update",
                        });
                    }
                } else if (data.updated[i].startsWith("A")) {
                    const album = await getAlbumById(data.updated[i]);
                    const newAlbum = data.albums.find(
                        (a: AlbumType) => a.id === data.updated[i]
                    );

                    if (
                        newAlbum &&
                        JSON.stringify(album) !== JSON.stringify(newAlbum)
                    ) {
                        if (
                            newAlbum.cover &&
                            !coversList.includes(newAlbum.cover)
                        ) {
                            const uri = await saveCover(newAlbum.cover);
                            await writeAlbum(
                                {
                                    ...album,
                                    ...newAlbum,
                                    date: new Date().toISOString(),
                                    cover: uri,
                                },
                                false
                            );
                        } else {
                            await writeAlbum(
                                {
                                    ...album,
                                    ...newAlbum,
                                    date: new Date().toISOString(),
                                },
                                false
                            );
                        }

                        newUpdates.push({
                            id: data.updated[i],
                            title: newAlbum.title,
                            cover: newAlbum.cover || null,
                            type: "album",
                            artist: null,
                            updateType: "update",
                        });
                    }
                }
            }

            for (let i = 0; i < data.deleted.length; i++) {
                let object;
                if (data.deleted[i].startsWith("S"))
                    object = await getSongById(data.deleted[i]);
                else if (data.deleted[i].startsWith("A"))
                    object = await getAlbumById(data.deleted[i]);

                if (data.deleted[i].startsWith("S")) {
                    await removeId(data.deleted[i]);
                } else if (data.deleted[i].startsWith("A")) {
                    await removeId(data.deleted[i]);
                }
                await removeFromHistory(data.deleted[i].id);

                newUpdates.push({
                    id: data.deleted[i],
                    title: object.title,
                    cover: object.cover || null,
                    type: object.type,
                    artist: object.artist || null,
                    updateType: "delete",
                });
            }

            updateRefresh();
        }

        setSongIds((prevArray: any) => {
            if (extraSongs.length > 0) {
                const updatedArray = [...prevArray, ...extraSongs];
                return Array.from(new Set(updatedArray));
            }
            return prevArray;
        });

        setAlbumIds((prevArray: any) => {
            if (extraAlbums.length > 0) {
                const updatedArray = [...prevArray, ...extraAlbums];
                return Array.from(new Set(updatedArray));
            }
            return prevArray;
        });

        setUpdates((prevUpdates: any) => {
            if (prevUpdates) {
                return [...prevUpdates, ...newUpdates];
            }
            return newUpdates;
        });

        setVersion(newVersion);
    };

    const writeSong = async (song: SongType, update = true) => {
        if (!songIds && update) return;

        try {
            await AsyncStorage.setItem(song.id, JSON.stringify(song));

            if (update) {
                setSongIds((prevArray: any) => {
                    if (!prevArray.includes(song.id)) {
                        return [...prevArray, song.id];
                    }
                    return prevArray;
                });
            }

            console.log("Wrote song file", song.id);
        } catch (error) {
            console.error("Error writing song file:", error);
        }
    };

    const writeAlbum = async (album: AlbumType, update = true) => {
        if (!albumIds && update) return;

        try {
            if (album.songs.length >= 3) {
                const songs = album.songs.slice(0, 4);

                const songPromises = await Promise.all(
                    songs.map(async (id) => {
                        const song = await readSong(id);
                        return song || null;
                    })
                );

                const covers = songPromises.map((song) => {
                    if (song?.cover === null)
                        return song.title[0] + song.id.slice(1);
                    else return song?.cover;
                });

                album.cover = covers;
            } else if (album.songs.length > 0) {
                const song = await readSong(
                    album.songs[album.songs.length - 1]
                );
                if (song) {
                    if (song.cover === null)
                        album.cover = song.title[0] + song.id.slice(1);
                    else album.cover = song?.cover;
                } else album.cover = null;
            } else if (album.songs.length === 0) {
                album.cover = null;
            }

            await AsyncStorage.setItem(album.id, JSON.stringify(album));

            if (update) {
                setAlbumIds((prevArray: any) => {
                    if (!prevArray.includes(album.id)) {
                        return [...prevArray, album.id];
                    }
                    return prevArray;
                });
            }

            console.log("Wrote album file", album.id);
        } catch (error) {
            console.error("Error writing album file:", error);
        }
    };

    const writePersonalAlbum = async (
        album: AlbumType,
        personalAlbumIds: string[] | null = personalAlbumsIds
    ) => {
        if (!personalAlbumIds) return;

        try {
            if (album.songs.length > 3) {
                const songs = album.songs.slice(-4).reverse();

                const songPromises = await Promise.all(
                    songs.map(async (id) => {
                        const song = await readSong(id);
                        return song || null;
                    })
                );

                const covers = songPromises.map((song) => {
                    if (song?.cover === null)
                        return song.title[0] + song.id.slice(1);
                    else return song?.cover;
                });

                album.cover = covers;
            } else if (album.songs.length > 0) {
                const song = await readSong(
                    album.songs[album.songs.length - 1]
                );
                if (song) {
                    if (song?.cover === null)
                        album.cover = song.title[0] + song.id.slice(1);
                    else album.cover = song?.cover;
                } else album.cover = null;
            } else if (album.songs.length === 0) {
                album.cover = null;
            }

            await AsyncStorage.setItem(album.id, JSON.stringify(album));

            setPersonalAlbumsIds((prevArray: any) => {
                if (!prevArray.includes(album.id)) {
                    const updatedArray = [...prevArray, album.id];
                    updatePersonalAlbumsList(updatedArray);
                    return updatedArray;
                }
                return prevArray;
            });

            console.log("Wrote personal album file", album.id);
        } catch (error) {
            console.error("Error writing personal album file:", error);
        }
    };

    const updateDate = async (id: string) => {
        if (id.startsWith("S")) {
            const song = await readSong(id);
            song.date = new Date().toISOString();

            await writeSong(song);
        } else if (id.startsWith("A")) {
            const album = await readAlbum(id);
            album.date = new Date().toISOString();

            await writeAlbum(album);
        } else if (id.startsWith("P")) {
            const album = await readAlbum(id);
            album.date = new Date().toISOString();

            await writePersonalAlbum(album);
        }

        updateRefresh();
    };

    const readSong = async (id: string) => {
        const song = await AsyncStorage.getItem(id);

        if (!song) return null;

        return JSON.parse(song);
    };

    const readAlbum = async (id: string) => {
        const album = await AsyncStorage.getItem(id);

        if (!album) return null;
        return JSON.parse(album);
    };

    const getById = async (id: string) => {
        if (id.startsWith("S")) return getSongById(id);
        if (id.startsWith("A")) return getAlbumById(id);
        if (id.startsWith("P")) return getPersonalAlbumById(id);

        return null;
    };

    const getSongById = async (id: string) => {
        const song = await readSong(id);

        return song;
    };

    const getAlbumById = async (id: string) => {
        const album = await readAlbum(id);

        return album;
    };

    const getPersonalAlbumById = async (id: string) => {
        const album = await readAlbum(id);

        return album;
    };

    const removeId = async (id: string) => {
        try {
            try {
                if (id.startsWith("S")) {
                    const song = await readSong(id);
                    if (song?.cover) deleteCover(song.cover);
                }

                await AsyncStorage.removeItem(id);
            } catch (error) {
                console.error("Error deleting song file:", error);
            }

            console.log("Deleted file:", id);

            if (id.startsWith("S")) {
                setSongIds((prevArray: any) =>
                    prevArray.filter((songId: string) => songId !== id)
                );
            } else if (id.startsWith("A")) {
                setAlbumIds((prevArray: any) =>
                    prevArray.filter((albumId: string) => albumId !== id)
                );
            } else if (id.startsWith("P")) {
                setPersonalAlbumsIds((prevArray: any) =>
                    prevArray.filter((albumId: string) => albumId !== id)
                );
            }
        } catch (error) {
            console.error("Error deleting song file:", error);
        }
    };

    const filter = async (searchQuery: string) => {
        if (!songIds || !albumIds || !personalAlbumsIds) return [];

        const normalizeString = (str: string) => {
            return str
                .toLowerCase()
                .replace(/ă/g, "a")
                .replace(/î/g, "i")
                .replace(/â/g, "a")
                .replace(/ș/g, "s")
                .replace(/ț/g, "t")
                .replace(/\s+/g, " ");
        };

        const query = normalizeString(searchQuery);

        const stripChords = (lyrics: string) => {
            return normalizeString(lyrics.replace(/\[[^\]]+\]/g, "")).replace(
                /[^\w\s]|_/g,
                ""
            );
        };

        const titleMatches: any[] = [];
        const artistMatches: any[] = [];
        const lyricsMatches: any[] = [];

        const songPromises = songIds.map(async (id) => {
            const song = await readSong(id);
            if (!song) return null;

            const songNameMatches = normalizeString(song.title).includes(query);
            const artistMatchesQuery = song.artist
                ? normalizeString(song.artist).includes(query)
                : false;
            const lyricsMatchesQuery = song.lyrics
                ? stripChords(song.lyrics).includes(query)
                : false;

            if (songNameMatches) {
                titleMatches.push(song);
            } else if (artistMatchesQuery) {
                artistMatches.push(song);
            } else if (lyricsMatchesQuery) {
                lyricsMatches.push(song);
            }
        });

        const albumPromises = albumIds.map(async (id) => {
            const album = await readAlbum(id);
            if (!album) return null;

            const albumNameMatches = normalizeString(album.title).includes(
                query
            );
            if (albumNameMatches) {
                titleMatches.push(album);
            }
        });

        const personalAlbumPromises = personalAlbumsIds.map(async (id) => {
            const album = await readAlbum(id);
            if (!album) return null;

            const albumNameMatches = normalizeString(album.title).includes(
                query
            );
            if (albumNameMatches) {
                titleMatches.push(album);
            }
        });

        await Promise.all([
            ...songPromises,
            ...albumPromises,
            ...personalAlbumPromises,
        ]);

        const filtered = [...titleMatches, ...artistMatches, ...lyricsMatches];

        return filtered;
    };

    const getRandom = async (number: number) => {
        if (!songIds || !albumIds) return [];

        const randomSongs: any[] = [];
        const randomAlbums: AlbumType[] = [];

        if (number > songIds.length + albumIds.length) number = songIds.length;

        while (randomSongs.length + randomAlbums.length < number) {
            const id = Math.floor(
                Math.random() * (songIds.length + albumIds.length)
            );

            if (id < songIds.length) {
                const song = await getSongById(songIds[id]);

                if (!randomSongs.find((s) => s.id === song.id))
                    randomSongs.push(song);
            } else {
                const album = await getAlbumById(albumIds[id - songIds.length]);

                if (!randomAlbums.find((a) => a.id === album.id))
                    randomAlbums.push(album);
            }
        }

        return randomSongs.concat(randomAlbums);
    };

    const getRandomSongs = async (number: number) => {
        if (!songIds) return [];

        const randomSongs: SongType[] = [];

        if (number > songIds.length) number = songIds.length;

        while (randomSongs.length < number) {
            const id = songIds[Math.floor(Math.random() * songIds.length)];

            if (!randomSongs.find((song) => song.id === id)) {
                const song = await getSongById(id);
                randomSongs.push(song);
            }
        }

        return randomSongs;
    };

    const getRandomAlbums = async (number: number) => {
        if (!albumIds) return [];

        const randomAlbums: AlbumType[] = [];

        if (number > albumIds.length) number = albumIds.length;

        while (randomAlbums.length < number) {
            const id = albumIds[Math.floor(Math.random() * albumIds.length)];

            if (!randomAlbums.find((album) => album.id === id)) {
                const album = await getAlbumById(id);
                randomAlbums.push(album);
            }
        }

        return randomAlbums;
    };

    const getFavoriteSongs = async () => {
        if (!songIds) return [];

        const favoriteSongs: SongType[] = [];

        for (let i = 0; i < songIds.length; i++) {
            const song = await getSongById(songIds[i]);

            if (song?.favorite) favoriteSongs.push(song);
        }

        return favoriteSongs;
    };

    const getFavoriteAlbums = async () => {
        if (!albumIds) return [];

        const favoriteAlbums: AlbumType[] = [];

        for (let i = 0; i < albumIds.length; i++) {
            const album = await getAlbumById(albumIds[i]);

            if (album?.favorite) favoriteAlbums.push(album);
        }

        return favoriteAlbums;
    };

    const setFavorite = async (
        id: string,
        isFavorite: boolean,
        update: boolean = true
    ) => {
        if (id.startsWith("S")) {
            const song = await getSongById(id);

            if (!song) return;

            song.favorite = isFavorite;
            song.date = new Date().toISOString();

            await writeSong(song);
        } else if (id.startsWith("A")) {
            const album = await getAlbumById(id);

            if (!album) return;

            album.favorite = isFavorite;
            album.date = new Date().toISOString();

            await writeAlbum(album);
        }

        if (isFavorite && update) {
            addFavorite(id);

            if (favoriteIds) {
                let newArray;

                if (!favoriteIds.includes(id)) newArray = [...favoriteIds, id];
                else newArray = favoriteIds;

                setFavoriteIds(newArray);

                updateRefresh();

                return newArray;
            } else
                setFavoriteIds((prevArray: any) => {
                    if (!prevArray.includes(id)) {
                        return [...prevArray, id];
                    }
                    return prevArray;
                });
        } else if (update) {
            removeFavorite(id);

            if (favoriteIds) {
                const newArray = favoriteIds.filter(
                    (favoriteId: string) => favoriteId !== id
                );

                setFavoriteIds(newArray);

                updateRefresh();

                return newArray;
            } else
                setFavoriteIds((prevArray: any) =>
                    prevArray.filter((favoriteId: string) => favoriteId !== id)
                );
        }

        updateRefresh();
    };

    const getFavoriteSongsAlbum = async () => {
        if (!favoriteIds || !favoriteIds.length || !songIds || !songIds.length)
            return null;

        let favoriteSongs = [];

        for (let i = 0; i < favoriteIds.length; i++) {
            if (!favoriteIds[i].startsWith("S")) continue;

            const song = await getSongById(favoriteIds[i]);
            if (song) favoriteSongs.push(favoriteIds[i]);
        }

        if (!favoriteSongs.length) return null;

        const album: AlbumType = {
            id: "F",
            type: "favorite",
            title: "Favorite Songs",
            creatorName: null,
            creator: null,
            songs: favoriteSongs,
            favorite: true,
            date: new Date().toISOString(),
            cover: "favorites",
        };

        return album;
    };

    const createPersonalAlbum = async (title: string) => {
        return new Promise<AlbumType>(async (resolve) => {
            try {
                const uniqueId = uuidv4();

                const playlist: AlbumType = {
                    id: `P${uniqueId}`,
                    type: "personal",
                    title: title,
                    creatorName: user.displayName,
                    creator: user.uid,
                    songs: [],
                    favorite: false,
                    date: new Date().toISOString(),
                    cover: null,
                };

                await writePersonalAlbum(playlist);

                createPersonalAlbumServer(playlist.id, title, user.uid);

                resolve(playlist);
            } catch (error) {
                console.error("Error creating personal playlist:", error);
            }
        });
    };

    const getPersonalAlbums = async () => {
        if (!personalAlbumsIds) return [];

        const personalAlbumsArray: AlbumType[] = [];

        for (let i = 0; i < personalAlbumsIds.length; i++) {
            const album = await getPersonalAlbumById(personalAlbumsIds[i]);

            personalAlbumsArray.push(album);
        }

        return personalAlbumsArray;
    };

    const deletePersonalAlbum = async (id: string, server: boolean = true) => {
        if (!personalAlbumsIds) return;

        try {
            await AsyncStorage.removeItem(id);

            setPersonalAlbumsIds(
                personalAlbumsIds.filter((albumId: any) => albumId !== id)
            );

            if (server) deletePersonalAlbumServer(id);
        } catch (error) {
            console.error("Error deleting personal album file:", error);
        }
    };

    const updatePersonalAlbum = async (
        album: AlbumType,
        title: string,
        cover: string | null = null
    ) => {
        return new Promise<AlbumType>(async (resolve) => {
            try {
                album.title = title;
                album.cover = cover;
                album.date = new Date().toISOString();

                await writePersonalAlbum(album);

                updatePersonalAlbumServer(album.id, title, album.songs);

                resolve(album);
            } catch (error) {
                console.error("Error updating personal album:", error);
            }
        });
    };

    const filterSongsNotInAlbum = async (
        album: AlbumType,
        searchQuery: string
    ) => {
        if (!songIds) return [];

        const normalizeString = (str: string) => {
            return str
                .toLowerCase()
                .replace(/ă/g, "a")
                .replace(/î/g, "i")
                .replace(/â/g, "a")
                .replace(/ș/g, "s")
                .replace(/ț/g, "t");
        };

        const query = normalizeString(searchQuery);

        const stripChords = (lyrics: string) => {
            return normalizeString(lyrics.replace(/\[[^\]]+\]/g, ""));
        };

        const titleMatches: any[] = [];
        const artistMatches: any[] = [];
        const lyricsMatches: any[] = [];

        const maxResults = 30;

        const songPromises = songIds.map(async (id) => {
            const song = await readSong(id);
            if (
                !song ||
                titleMatches.length +
                    artistMatches.length +
                    lyricsMatches.length >=
                    maxResults
            ) {
                return null;
            }

            const songNameMatches = normalizeString(song.title).includes(query);
            const artistMatchesQuery = song.artist
                ? normalizeString(song.artist).includes(query)
                : false;
            const lyricsMatchesQuery = song.lyrics
                ? stripChords(song.lyrics).includes(query)
                : false;

            if (
                (songNameMatches || artistMatchesQuery || lyricsMatchesQuery) &&
                !album.songs.includes(song.id)
            ) {
                if (songNameMatches && titleMatches.length < maxResults) {
                    titleMatches.push(song);
                } else if (
                    artistMatchesQuery &&
                    artistMatches.length < maxResults
                ) {
                    artistMatches.push(song);
                } else if (
                    lyricsMatchesQuery &&
                    lyricsMatches.length < maxResults
                ) {
                    lyricsMatches.push(song);
                }
            }
        });

        await Promise.all(songPromises);

        const filtered = [
            ...titleMatches,
            ...artistMatches,
            ...lyricsMatches,
        ].slice(0, maxResults);

        return filtered;
    };

    const addSongToPersonalAlbum = async (album: AlbumType, song: SongType) => {
        return new Promise<AlbumType>(async (resolve) => {
            try {
                album.songs.push(song.id);
                album.date = new Date().toISOString();

                await writePersonalAlbum(album);

                updatePersonalAlbumServer(album.id, album.title, album.songs);

                resolve(album);
            } catch (error) {
                console.error("Error adding song to personal album:", error);
            }
        });
    };

    const removeSongFromPersonalAlbum = async (
        album: AlbumType,
        song: SongType
    ) => {
        return new Promise<AlbumType>(async (resolve) => {
            try {
                album.songs = album.songs.filter((id) => id !== song.id);
                album.date = new Date().toISOString();

                await writePersonalAlbum(album);

                updatePersonalAlbumServer(album.id, album.title, album.songs);

                resolve(album);
            } catch (error) {
                console.error(
                    "Error removing song from personal album:",
                    error
                );
            }
        });
    };

    const clearData = async () => {
        if (songIds && albumIds && personalAlbumsIds && favoriteIds)
            for (let i = 0; i < personalAlbumsIds.length; i++)
                AsyncStorage.removeItem(personalAlbumsIds[i]);

        setPersonalAlbumsIds([]);
        setFavoriteIds([]);
        deleteHistory([]);

        resetTutorial();
        resetConstants();

        await AsyncStorage.multiRemove([
            "version",
            "recent",
            "user",
            "favoriteIds",
            "personalAlbumsIds",
        ]);

        resetData();

        updateRefresh();
    };

    const getPersonalAlbumsBySong = async (song: SongType) => {
        if (!personalAlbumsIds) return [];

        const albumsThatContainSong: AlbumType[] = [];
        const albumsThatDontContainSong: AlbumType[] = [];

        for (let i = 0; i < personalAlbumsIds.length; i++) {
            const album = await getPersonalAlbumById(personalAlbumsIds[i]);

            if (album.songs.includes(song.id)) {
                albumsThatContainSong.push(album);
            } else {
                albumsThatDontContainSong.push(album);
            }
        }

        return { albumsThatContainSong, albumsThatDontContainSong };
    };

    const syncFavorites = async (
        oldFavoriteList: string[] | null = favoriteIds,
        passedUser: any = user
    ): Promise<void> => {
        try {
            const userData = await getUserData(passedUser);

            if (userData === null || !userData.favorites || !oldFavoriteList) {
                return;
            }

            for (let i = 0; i < oldFavoriteList.length; i++) {
                if (
                    !userData.favorites.find(
                        (id: any) => id === oldFavoriteList[i]
                    )
                ) {
                    setFavorite(oldFavoriteList[i], false, false);
                }
            }

            for (let i = 0; i < userData.favorites.length; i++) {
                setFavorite(userData.favorites[i], true, false);
            }

            setFavoriteIds(userData.favorites);
        } catch (error) {
            console.error("Error syncing favorites:", error);
        }
    };

    const syncPersonalAlbums = async (
        personalAlbumsIds: string[] | null,
        passedUser: any = user
    ): Promise<void> => {
        try {
            const userData = await getUserData(passedUser);

            if (!userData || !userData.personalAlbumsIds || !personalAlbumsIds)
                return;

            for (let i = 0; i < personalAlbumsIds.length; i++)
                if (!userData.personalAlbumsIds.includes(personalAlbumsIds[i]))
                    await removeId(personalAlbumsIds[i]);

            const ids = userData.personalAlbumsIds;

            const albumPromises = userData.personalAlbumsIds.map(
                async (id: string) => {
                    const data = await getPersonalAlbumServer(id);
                    if (!data) {
                        removePersonalAlbum(id);
                        ids.splice(ids.indexOf(id), 1);
                        return null;
                    }

                    const displayName = await getUserDisplayName(data.creator);

                    const album: AlbumType = {
                        id,
                        type: "personal",
                        title: data.title,
                        songs: data.songs,
                        creator: data.creator,
                        creatorName: displayName,
                        favorite: false,
                        date: new Date().toISOString(),
                        cover: null,
                    };

                    await writePersonalAlbum(album, userData.personalAlbumsIds);
                    return album;
                }
            );

            setPersonalAlbumsIds(ids);

            setSyncLoading(false);

            await Promise.all(albumPromises);
        } catch (error) {
            console.error("Error syncing personal albums:", error);
        }
    };

    const getNotOwnedPersonalAlbum = async (
        id: string
    ): Promise<AlbumType | null> => {
        if (!personalAlbumsIds || personalAlbumsIds.includes(id)) {
            console.log("Album is already owned by the user.");
            return null;
        }

        try {
            const albumData = await getPersonalAlbumServer(id);

            if (!albumData) {
                console.log("Personal album not found on the server.");
                return null;
            }

            const displayName = await getUserDisplayName(albumData.creator);

            const newAlbum: AlbumType = {
                id,
                type: "personal",
                title: albumData.title,
                songs: albumData.songs,
                creator: albumData.creator,
                creatorName: displayName,
                favorite: false,
                date: new Date().toISOString(),
                cover: null,
            };

            await writePersonalAlbum(newAlbum);

            console.log("Personal album added to user's list:", newAlbum);
            return newAlbum;
        } catch (error) {
            console.error("Error fetching or saving personal album:", error);
            return null;
        }
    };

    const removePersonalAlbumFromUser = async (id: string) => {
        if (!personalAlbumsIds || !personalAlbumsIds.includes(id)) {
            console.log("Album is not owned by the user.");
            return;
        }

        try {
            await deletePersonalAlbum(id, false);
            await removePersonalAlbum(id);
        } catch (error) {
            console.error("Error removing personal album from user:", error);
        }
    };

    const getAllSongsOrdered = async () => {
        if (!songIds) return [];

        const songs = await Promise.all(
            songIds.map(async (id) => {
                const song = await getSongById(id);
                return song;
            })
        );

        songs.sort((a, b) => {
            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        });

        return songs;
    };

    const getAllAlbumsOrdered = async () => {
        if (!albumIds) return [];

        const albums = await Promise.all(
            albumIds.map(async (id) => {
                const album = await getAlbumById(id);
                return album;
            })
        );

        albums.sort((a, b) => {
            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        });

        return albums;
    };

    const reloadAllData = async () => {
        if (!songIds || !albumIds) return;

        setLoadingData(true);

        const networkState = await Network.getNetworkStateAsync();
        const hasInternet = networkState.isConnected;

        for (let i = 0; i < songIds.length; i++) removeId(songIds[i]);
        setSongIds([]);

        for (let i = 0; i < albumIds.length; i++) removeId(albumIds[i]);
        setAlbumIds([]);

        deleteHistory();

        await addData();

        setLoadingData(false);
    };

    const getFirstThreeAlbums = async () => {
        if (!albumIds) return [];

        const normalAlbums: AlbumType[] = [];

        for (let i = 0; i < albumIds.length; i++) {
            const album = await getAlbumById(albumIds[i]);
            if (album && album.type === "album") {
                normalAlbums.push(album);
            }
            if (normalAlbums.length === 3) break;
        }

        return normalAlbums;
    };

    return (
        <DataContext.Provider
            value={{
                songIds,
                albumIds,
                personalAlbumsIds,
                favoriteIds,
                loadingData,
                updates,
                updateDate,
                readSong,
                readAlbum,
                writeAlbum,
                writeSong,
                getById,
                filter,
                getRandom,
                getRandomSongs,
                getRandomAlbums,
                getSongById,
                getAlbumById,
                removeId,
                getFavoriteSongs,
                getFavoriteAlbums,
                setFavorite,
                getFavoriteSongsAlbum,
                createPersonalAlbum,
                writePersonalAlbum,
                getPersonalAlbums,
                getPersonalAlbumById,
                deletePersonalAlbum,
                updatePersonalAlbum,
                filterSongsNotInAlbum,
                addSongToPersonalAlbum,
                removeSongFromPersonalAlbum,
                clearData,
                getPersonalAlbumsBySong,
                syncFavorites,
                setPersonalAlbumsIds,
                syncPersonalAlbums,
                updateData,
                loadData,
                getNotOwnedPersonalAlbum,
                removePersonalAlbumFromUser,
                getAllSongsOrdered,
                reloadAllData,
                getAllAlbumsOrdered,
                getFirstThreeAlbums,
            }}>
            {children}
        </DataContext.Provider>
    );
};
