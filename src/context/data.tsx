import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "firebase/auth";
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
import { LoadingContext } from "./loading";
import { RefreshContext } from "./refresh";
import { ServerContext } from "./server";
import { UserContext } from "./user";

export const DataContext = createContext<any>(null);

export interface AlbumType {
    id: string;
    type: "album" | "personal" | "favorite" | "extra";
    title: string;
    songs: string[];
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
    const { setUser } = useContext(UserContext);
    const { updateRefresh } = useContext(RefreshContext);
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
        saveCover,
    } = useContext(ServerContext);
    const { setLoading } = useContext(LoadingContext);

    const [songIds, setSongIds] = useState<string[]>([]);
    const [albumIds, setAlbumIds] = useState<string[]>([]);
    const [personalAlbumsIds, setPersonalAlbumsIds] = useState<string[]>([]);

    useEffect(() => {
        setLoading(true);

        const clear = async () => {
            setSongIds([]);
            setAlbumIds([]);
            setPersonalAlbumsIds([]);

            await AsyncStorage.clear();
            await AsyncStorage.multiRemove([
                "songIds",
                "albumIds",
                "recent",
                "history",
                "onboard",
                "user",
                "language",
                "personalAlbumsIds",
            ]);
            console.log("Keys: " + (await AsyncStorage.getAllKeys()));

            setUser(null);

            updateRefresh();
        };

        const firstLoad = async () => {
            const loaded = await AsyncStorage.getItem("loaded");

            if (loaded === null) {
                await AsyncStorage.clear();

                await addData();

                await AsyncStorage.setItem("loaded", "true");
            }
        };

        const readLists = async () => {
            const storedSongs = await AsyncStorage.getItem("songIds");
            const storedAlbums = await AsyncStorage.getItem("albumIds");
            const storedPersonalAlbums = await AsyncStorage.getItem(
                "personalAlbumsIds"
            );

            let sortedSongs: string[] = [];
            let sortedAlbums: string[] = [];

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
                setPersonalAlbumsIds(
                    JSON.parse(storedPersonalAlbums).sort(
                        (a: string, b: string) => {
                            const aNum = parseInt(a.slice(1));
                            const bNum = parseInt(b.slice(1));

                            return aNum - bNum;
                        }
                    )
                );
            }

            return { sortedSongs, sortedAlbums, storedPersonalAlbums };
        };

        const checkForUpdates = async (
            songs: string[] = songIds,
            albums: string[] = albumIds
        ) => {
            await updateData(songs, albums);
        };

        const initialize = async () => {
            // await clear();

            await firstLoad();
            const lists = await readLists();

            await checkForUpdates(lists.sortedSongs, lists.sortedAlbums);

            setLoading(false);
        };

        initialize();
    }, []);

    useEffect(() => {
        if (songIds === null) return;

        const writeSongIds = async () => {
            if (songIds.length !== 0) {
                await AsyncStorage.setItem("songIds", JSON.stringify(songIds));
            }
        };

        writeSongIds();
    }, [songIds]);

    useEffect(() => {
        if (albumIds === null) return;

        const writeAlbumIds = async () => {
            if (albumIds.length !== 0) {
                await AsyncStorage.setItem(
                    "albumIds",
                    JSON.stringify(albumIds)
                );
            }
        };

        writeAlbumIds();
    }, [albumIds]);

    useEffect(() => {
        if (personalAlbumsIds === null) return;

        const writePersonalAlbumsIds = async () => {
            if (personalAlbumsIds.length !== 0) {
                await AsyncStorage.setItem(
                    "personalAlbumsIds",
                    JSON.stringify(personalAlbumsIds)
                );
            }
        };

        writePersonalAlbumsIds();
    }, [personalAlbumsIds]);

    const addData = async () => {
        const data = await checkUpdates();

        if (data) {
            for (let i = 0; i < data.songs.length; i++) {
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

            for (let i = 0; i < data.albums.length; i++) {
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
        } else {
            for (let i = 0; i < bundle.songs.length; i++)
                await writeSong({
                    ...bundle.songs[i],
                    favorite: false,
                    date: new Date().toISOString(),
                    type: bundle.songs[i].type as "song" | "extra",
                });

            for (let i = 0; i < bundle.albums.length; i++)
                await writeAlbum({
                    ...bundle.albums[i],
                    favorite: false,
                    date: new Date().toISOString(),
                    type: bundle.albums[i].type as
                        | "album"
                        | "extra"
                        | "favorite"
                        | "personal",
                });
        }
    };

    const resetData = async () => {
        for (let i = 0; i < songIds.length; i++)
            setFavorite(songIds[i], false, false);
        for (let i = 0; i < albumIds.length; i++)
            setFavorite(albumIds[i], false, false);
    };

    const updateData = async (
        songs: string[] = songIds,
        albums: string[] = albumIds
    ) => {
        const data = await checkUpdates();

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
            }

            updateRefresh();
        }
    };

    const writeSong = async (song: SongType, update = true) => {
        try {
            await AsyncStorage.setItem(song.id, JSON.stringify(song));

            if (update && !songIds.find((id) => id === song.id))
                setSongIds((prevArray) => [...prevArray, song.id]);

            console.log("Wrote song file", song.id);
        } catch (error) {
            console.error("Error writing song file:", error);
        }
    };

    const writeAlbum = async (album: AlbumType, update = true) => {
        try {
            if (album.songs.length >= 3 && !Array.isArray(album.cover)) {
                const songs = album.songs.slice(0, 4);

                const songPromises = await Promise.all(
                    songs.map(async (id) => {
                        const song = await readSong(id);

                        if (!song) return null;

                        return song;
                    })
                );

                const covers = songPromises.map((song) => song.cover);

                album.cover = covers;
            }

            await AsyncStorage.setItem(album.id, JSON.stringify(album));

            if (update && !albumIds.find((id) => id === album.id))
                setAlbumIds((prevArray) => [...prevArray, album.id]);

            console.log("Wrote album file", album.id);
        } catch (error) {
            console.error("Error writing album file:", error);
        }
    };

    const writePersonalAlbum = async (album: AlbumType) => {
        try {
            if (album.songs.length >= 4) {
                const songs = album.songs.slice(-4).reverse();

                const songPromises = await Promise.all(
                    songs.map(async (id) => {
                        const song = await readSong(id);

                        if (!song) return null;

                        return song;
                    })
                );

                const covers = songPromises.map((song) => song.cover);

                album.cover = covers;
            } else if (album.songs.length > 0) {
                const song = await readSong(
                    album.songs[album.songs.length - 1]
                );

                if (song) album.cover = song.cover;
            } else if (album.songs.length === 0) {
                album.cover = null;
            }

            await AsyncStorage.setItem(album.id, JSON.stringify(album));

            if (!personalAlbumsIds.find((id) => id === album.id)) {
                setPersonalAlbumsIds((prevArray) => [...prevArray, album.id]);
                updatePersonalAlbumsList(personalAlbumsIds);
            }

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
                await AsyncStorage.removeItem(id);
            } catch (error) {
                console.error("Error deleting song file:", error);
            }

            console.log("Deleted file:", id);

            if (id.startsWith("S")) {
                setSongIds((prevArray) =>
                    prevArray.filter((songId) => songId !== id)
                );
            } else if (id.startsWith("A")) {
                setAlbumIds((prevArray) =>
                    prevArray.filter((albumId) => albumId !== id)
                );
            } else if (id.startsWith("P")) {
                setPersonalAlbumsIds((prevArray) =>
                    prevArray.filter((albumId) => albumId !== id)
                );
            }
        } catch (error) {
            console.error("Error deleting song file:", error);
        }
    };

    const filter = async (searchQuery: string) => {
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

        const songPromises = songIds.map(async (id) => {
            const song = await readSong(id);
            if (!song) return null;

            const songNameMatches = normalizeString(song.title).includes(query);
            const artistMatches = song.artist
                ? normalizeString(song.artist).includes(query)
                : false;
            const lyricsMatches = song.lyrics
                ? stripChords(song.lyrics).includes(query)
                : false;

            if (songNameMatches || artistMatches || lyricsMatches) {
                return song;
            }
            return null;
        });

        const albumPromises = albumIds.map(async (id) => {
            const album = await readAlbum(id);
            if (!album) return null;

            const albumNameMatches = normalizeString(album.title).includes(
                query
            );
            if (albumNameMatches) {
                return album;
            }
            return null;
        });

        const personalAlbumPromises = personalAlbumsIds.map(async (id) => {
            const album = await readAlbum(id);
            if (!album) return null;

            const albumNameMatches = normalizeString(album.title).includes(
                query
            );
            if (albumNameMatches) {
                return album;
            }
            return null;
        });

        const results = await Promise.all([
            ...songPromises,
            ...albumPromises,
            ...personalAlbumPromises,
        ]);

        filtered = results.filter((result) => result !== null);

        return filtered;
    };

    const getRandom = async (number: number) => {
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
        const favoriteSongs: SongType[] = [];

        for (let i = 0; i < songIds.length; i++) {
            const song = await getSongById(songIds[i]);

            if (song.favorite) favoriteSongs.push(song);
        }

        return favoriteSongs;
    };

    const getFavoriteAlbums = async () => {
        const favoriteAlbums: AlbumType[] = [];

        for (let i = 0; i < albumIds.length; i++) {
            const album = await getAlbumById(albumIds[i]);

            if (album.favorite) favoriteAlbums.push(album);
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
            song.favorite = isFavorite;
            song.date = new Date().toISOString();

            await writeSong(song);
        } else if (id.startsWith("A")) {
            const album = await getAlbumById(id);
            album.favorite = isFavorite;
            album.date = new Date().toISOString();

            await writeAlbum(album);
        }

        if (isFavorite && update) {
            addFavorite(id);
        } else if (update) {
            removeFavorite(id);
        }
    };

    const getFavoriteSongsAlbum = async () => {
        const favoriteSongs = await getFavoriteSongs();

        const album: AlbumType = {
            id: "F",
            type: "favorite",
            title: "Favorite Songs",
            songs: favoriteSongs.map((song) => song.id),
            favorite: true,
            date: new Date().toISOString(),
            cover: null,
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
                    songs: [],
                    favorite: false,
                    date: new Date().toISOString(),
                    cover: null,
                };

                await writePersonalAlbum(playlist);

                createPersonalAlbumServer(playlist.id, title);

                resolve(playlist);
            } catch (error) {
                console.error("Error creating personal playlist:", error);
            }
        });
    };

    const getPersonalAlbums = async () => {
        const personalAlbumsArray: AlbumType[] = [];

        for (let i = 0; i < personalAlbumsIds.length; i++) {
            const album = await getPersonalAlbumsById(personalAlbumsIds[i]);

            personalAlbumsArray.push(album);
        }

        return personalAlbumsArray;
    };

    const deletePersonalAlbum = async (id: string) => {
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
        for (let i = 0; i < personalAlbumsIds.length; i++)
            await AsyncStorage.removeItem(personalAlbumsIds[i]);

        setPersonalAlbumsIds([]);

        await AsyncStorage.multiRemove([
            "recent",
            "history",
            "user",
            "language",
            "personalAlbumsIds",
        ]);

        await resetData();
        await updateData();
    };

    const getPersonalAlbumsBySong = async (song: SongType) => {
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

    const syncFavorites = async (favoriteList: string[]) => {
        for (let i = 0; i < favoriteList.length; i++) {
            if (favoriteList[i].startsWith("S")) {
                const song = await getSongById(favoriteList[i]);
                song.favorite = true;

                await writeSong(song);
            } else if (favoriteList[i].startsWith("A")) {
                const album = await getAlbumById(favoriteList[i]);
                album.favorite = true;

                await writeAlbum(album);
            }
        }

        updateRefresh();
    };

    const syncPersonalAlbums = async (
        personalAlbumsList: string[],
        user: User
    ) => {
        for (let i = 0; i < personalAlbumsList.length; i++) {
            const data = await getPersonalAlbumServer(
                personalAlbumsList[i],
                user
            );

            if (!data) continue;

            const album: AlbumType = {
                id: personalAlbumsList[i],
                type: "personal",
                title: data.title,
                songs: data.songs,
                favorite: false,
                date: new Date().toISOString(),
                cover: null,
            };

            await writePersonalAlbum(album);
        }

        updateRefresh();
    };

    const updatePersonalAlbums = async (user: User) => {
        const userData = await getUserData(user);

        if (userData.personalAlbumsIds) {
            await syncPersonalAlbumsIds(userData.personalAlbumsIds);
            await syncPersonalAlbums(userData.personalAlbumsIds, user);
        }
    };

    const syncPersonalAlbumsIds = async (personalAlbumsList: string[]) => {
        for (let i = 0; i < personalAlbumsList.length; i++)
            if (!personalAlbumsIds.find((id) => id === personalAlbumsList[i]))
                removeId(personalAlbumsList[i]);

        setPersonalAlbumsIds(personalAlbumsList);
    };

    return (
        <DataContext.Provider
            value={{
                songIds,
                albumIds,
                personalAlbumsIds,
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
                syncPersonalAlbumsIds,
                updateData,
                updatePersonalAlbums,
            }}>
            {children}
        </DataContext.Provider>
    );
};
