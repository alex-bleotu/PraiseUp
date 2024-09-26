import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { coversList } from "../utils/covers";
import { HistoryContext } from "./history";
import { RefreshContext } from "./refresh";
import { ServerContext } from "./server";
import { UserContext } from "./user";

export const DataContext = createContext<any>(null);

export interface AlbumType {
    id: string;
    type: "album" | "personal" | "favorite" | "extra";
    title: string;
    songs: string[];
    creator: string | null;
    favorite: boolean;
    date: string;
    cover: string | null | string[];
}

export interface SongType {
    id: string;
    type: "song" | "extra";
    title: string;
    artist: string;
    cover: string | null;
    lyrics: string;
    favorite: boolean;
    date: string;
    order: string | null;
    initialChord: string | null;
}

export const DataProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const { user, setUser } = useContext(UserContext);
    const { updateRefresh } = useContext(RefreshContext);
    const { history, removeFromHistory } = useContext(HistoryContext);
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
    } = useContext(ServerContext);

    const [version, setVersion] = useState<string | null>(null);
    const [songIds, setSongIds] = useState<string[] | null>(null);
    const [albumIds, setAlbumIds] = useState<string[] | null>(null);
    const [personalAlbumsIds, setPersonalAlbumsIds] = useState<string[] | null>(
        null
    );
    const [favoriteIds, setFavoriteIds] = useState<string[] | null>(null);
    const [loadingData, setLoadingData] = useState<boolean>(true);

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
            await AsyncStorage.clear();

            await addData();

            await AsyncStorage.setItem("loaded", "true");
        };

        const readLists = async () => {
            const storedSongs = await AsyncStorage.getItem("songIds");
            const storedAlbums = await AsyncStorage.getItem("albumIds");
            const storedPersonalAlbums = await AsyncStorage.getItem(
                "personalAlbumsIds"
            );
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

            const lists = await readLists();

            const loaded = await AsyncStorage.getItem("loaded");

            if (loaded === null) await firstLoad();
            else await checkForUpdates(lists.songs, lists.albums);

            if (user) {
                filterHistory();

                (async () => {
                    try {
                        await syncFavorites(lists.favorites);
                        await syncPersonalAlbums(lists.personalAlbums);

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

    const resetData = async () => {
        if (!songIds || !albumIds) return;

        for (let i = 0; i < songIds.length; i++)
            setFavorite(songIds[i], false, false);
        for (let i = 0; i < albumIds.length; i++)
            setFavorite(albumIds[i], false, false);
    };

    const updateData = async (
        songs: string[] | null = songIds,
        albums: string[] | null = albumIds,
        vers: string | null = version
    ) => {
        const newVersion = await getVersion();

        if (newVersion === vers) {
            console.log("No updates available: " + newVersion);
            return;
        } else console.log("Updates available: " + newVersion);

        const data = await checkUpdates();

        if (!songs || !albums) return;

        if (data) {
            for (let i = 0; i < data.songs.length; i++)
                if (!songs.find((id) => id === data.songs[i].id)) {
                    const cover = data.songs[i].cover;

                    if (cover && !coversList.includes(cover)) {
                        const uri = await saveCover(cover);

                        await writeSong({
                            ...data.songs[i],
                            cover: uri,
                            favorite: false,
                            date: new Date().toISOString(),
                            type: data.songs[i].type as "song" | "extra",
                        });
                    } else
                        await writeSong({
                            ...data.songs[i],
                            favorite: false,
                            date: new Date().toISOString(),
                            type: data.songs[i].type as "song" | "extra",
                        });
                }

            for (let i = 0; i < data.albums.length; i++)
                if (!albums.find((id) => id === data.albums[i].id)) {
                    const cover = data.albums[i].cover;

                    if (cover && !coversList.includes(cover)) {
                        const uri = await saveCover(cover);

                        await writeAlbum({
                            ...data.albums[i],
                            cover: uri,
                            favorite: false,
                            date: new Date().toISOString(),
                            type: data.albums[i].type as
                                | "album"
                                | "extra"
                                | "favorite"
                                | "personal",
                        });
                    } else
                        await writeAlbum({
                            ...data.albums[i],
                            favorite: false,
                            date: new Date().toISOString(),
                            type: data.albums[i].type as
                                | "album"
                                | "extra"
                                | "favorite"
                                | "personal",
                        });
                }

            for (let i = 0; i < data.updated.length; i++) {
                if (data.updated[i].startsWith("S")) {
                    const song = await getSongById(data.updated[i]);

                    const newSong = data.songs.find(
                        (s: SongType) => s.id === data.updated[i]
                    );

                    if (newSong.cover && !coversList.includes(newSong.cover)) {
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
                    } else
                        await writeSong(
                            {
                                ...song,
                                ...newSong,
                                date: new Date().toISOString(),
                            },
                            false
                        );
                } else if (data.updated[i].startsWith("A")) {
                    const album = await getAlbumById(data.updated[i]);

                    const newAlbum = data.albums.find(
                        (a: AlbumType) => a.id === data.updated[i]
                    );

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
                    } else
                        await writeAlbum(
                            {
                                ...album,
                                ...newAlbum,
                                date: new Date().toISOString(),
                            },
                            false
                        );
                }
            }

            for (let i = 0; i < data.deleted.length; i++) {
                if (data.deleted[i].startsWith("S"))
                    await removeId(data.deleted[i]);
                else if (data.deleted[i].startsWith("A"))
                    await removeId(data.deleted[i]);

                await removeFromHistory(data.deleted[i].id);
            }

            updateRefresh();
        }

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
            if (album.songs.length >= 3) {
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
        if (id.startsWith("P")) return getPersonalAlbumsById(id);

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

    const getPersonalAlbumsById = async (id: string) => {
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
            setFavoriteIds((prevArray: any) => {
                if (!prevArray.includes(id)) {
                    return [...prevArray, id];
                }
                return prevArray;
            });

            updateRefresh();
        } else if (update) {
            removeFavorite(id);
            setFavoriteIds((prevArray: any) =>
                prevArray.filter((favoriteId: string) => favoriteId !== id)
            );

            updateRefresh();
        }
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

        console.log(favoriteSongs);

        const album: AlbumType = {
            id: "F",
            type: "favorite",
            title: "Favorite Songs",
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
                    creator: user.displayName,
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
            const album = await getPersonalAlbumsById(personalAlbumsIds[i]);

            personalAlbumsArray.push(album);
        }

        return personalAlbumsArray;
    };

    const deletePersonalAlbum = async (id: string) => {
        if (!personalAlbumsIds) return;

        try {
            await AsyncStorage.removeItem(id);

            setPersonalAlbumsIds(
                personalAlbumsIds.filter((albumId: any) => albumId !== id)
            );

            deletePersonalAlbumServer(id);
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

        let filtered: any[] = [];

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

        for (let i = 0; i < songIds.length && filtered.length < 30; i++) {
            const song = await readSong(songIds[i]);
            if (!song) continue;

            const songNameMatches = normalizeString(song.title).includes(query);
            const artistMatches = song.artist
                ? normalizeString(song.artist).includes(query)
                : false;
            const lyricsMatches = song.lyrics
                ? stripChords(song.lyrics).includes(query)
                : false;

            if (
                (songNameMatches || artistMatches || lyricsMatches) &&
                !album.songs.includes(song.id)
            ) {
                filtered.push(song);
            }
        }

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
        if (!songIds || !albumIds || !personalAlbumsIds) return;

        for (let i = 0; i < personalAlbumsIds.length; i++)
            await AsyncStorage.removeItem(personalAlbumsIds[i]);

        setPersonalAlbumsIds([]);

        await AsyncStorage.multiRemove([
            "version",
            "recent",
            "history",
            "user",
            "personalAlbumsIds",
        ]);

        await resetData();
        await updateData();
    };

    const getPersonalAlbumsBySong = async (song: SongType) => {
        if (!personalAlbumsIds) return [];

        const albumsThatContainSong: AlbumType[] = [];
        const albumsThatDontContainSong: AlbumType[] = [];

        for (let i = 0; i < personalAlbumsIds.length; i++) {
            const album = await getPersonalAlbumsById(personalAlbumsIds[i]);

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
        return new Promise(async (resolve, reject) => {
            try {
                const userData = await getUserData(passedUser);

                if (
                    userData === null ||
                    !userData.favorites ||
                    !oldFavoriteList
                )
                    return resolve();

                for (let i = 0; i < oldFavoriteList.length; i++) {
                    if (
                        !userData.favorites.find(
                            (id: any) => id === oldFavoriteList[i]
                        )
                    )
                        setFavorite(oldFavoriteList[i], false, false);
                }

                for (let i = 0; i < userData.favorites.length; i++) {
                    setFavorite(userData.favorites[i], true, false);
                }

                setFavoriteIds(userData.favorites);

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };

    const syncPersonalAlbums = async (
        personalAlbumsIds: string[] | null,
        passedUser: any = user
    ): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            try {
                const userData = await getUserData(passedUser);

                if (
                    userData === null ||
                    !userData.personalAlbumsIds ||
                    !personalAlbumsIds
                )
                    return resolve();

                for (let i = 0; i < personalAlbumsIds.length; i++) {
                    if (
                        !userData.personalAlbumsIds.find(
                            (id: any) => id === personalAlbumsIds[i]
                        )
                    )
                        removeId(personalAlbumsIds[i]);
                }

                setPersonalAlbumsIds(userData.personalAlbumsIds);

                const albumPromises = userData.personalAlbumsIds.map(
                    async (id: string) => {
                        const data = await getPersonalAlbumServer(id);
                        if (!data) return null;

                        const displayName = await getUserDisplayName(
                            data.creator
                        );

                        const album: AlbumType = {
                            id,
                            type: "personal",
                            title: data.title,
                            songs: data.songs,
                            creator: displayName,
                            favorite: false,
                            date: new Date().toISOString(),
                            cover: null,
                        };

                        await writePersonalAlbum(
                            album,
                            userData.personalAlbumsIds
                        );
                        return album;
                    }
                );

                await Promise.all(albumPromises);

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };

    return (
        <DataContext.Provider
            value={{
                songIds,
                albumIds,
                personalAlbumsIds,
                favoriteIds,
                loadingData,
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
                getPersonalAlbumsById,
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
            }}>
            {children}
        </DataContext.Provider>
    );
};
