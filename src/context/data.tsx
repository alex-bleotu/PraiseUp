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
import { albums, songs } from "../../assets/bundle";
import { RefreshContext } from "./refresh";
import { ServerContext } from "./server";

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
    initialChord: string | null;
}

export const DataProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const { updateRefresh } = useContext(RefreshContext);
    const {
        addFavorite,
        removeFavorite,
        createPersonalAlbum: createPersonalAlbumServer,
        updatePersonalAlbumsList,
        updatePersonalAlbum: updatePersonalAlbumServer,
        deletePersonalAlbum: deletePersonalAlbumServer,
        getPersonalAlbum: getPersonalAlbumServer,
    } = useContext(ServerContext);

    const [songIds, setSongIds] = useState<string[]>([]);
    const [albumIds, setAlbumIds] = useState<string[]>([]);
    const [personalAlbumsIds, setPersonalAlbumsIds] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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

            updateRefresh();
        };

        const firstLoad = async () => {
            const loaded = await AsyncStorage.getItem("loaded");

            if (loaded === null) {
                await AsyncStorage.clear();

                for (let i = 0; i < songs.length; i++)
                    await writeSong(songs[i]);

                for (let i = 0; i < albums.length; i++)
                    await writeAlbum(albums[i]);

                await AsyncStorage.setItem("loaded", "true");
            }
        };

        const readLists = async () => {
            const storedSongs = await AsyncStorage.getItem("songIds");
            const storedAlbums = await AsyncStorage.getItem("albumIds");
            const storedPersonalAlbums = await AsyncStorage.getItem(
                "personalAlbumsIds"
            );

            if (storedSongs !== null) {
                setSongIds(
                    JSON.parse(storedSongs).sort((a: string, b: string) => {
                        const aNum = parseInt(a.slice(1));
                        const bNum = parseInt(b.slice(1));

                        return aNum - bNum;
                    })
                );
            }

            if (storedAlbums !== null) {
                setAlbumIds(
                    JSON.parse(storedAlbums).sort((a: string, b: string) => {
                        const aNum = parseInt(a.slice(1));
                        const bNum = parseInt(b.slice(1));

                        return aNum - bNum;
                    })
                );
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
        };

        const initialize = async () => {
            // await clear();

            await firstLoad();
            await readLists();

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

    const writeSong = async (song: SongType) => {
        try {
            await AsyncStorage.setItem(song.id, JSON.stringify(song));

            if (!songIds.find((id) => id === song.id))
                setSongIds((prevArray) => [...prevArray, song.id]);

            console.log("Wrote song file", song.id);
        } catch (error) {
            console.error("Error writing song file:", error);
        }
    };

    const writeAlbum = async (album: AlbumType) => {
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

            if (!albumIds.find((id) => id === album.id))
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
        if (id.includes("S")) {
            const song = await readSong(id);
            song.date = new Date().toISOString();

            await writeSong(song);
        } else if (id.includes("A")) {
            const album = await readAlbum(id);
            album.date = new Date().toISOString();

            await writeAlbum(album);
        } else if (id.includes("P")) {
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
        if (id.includes("S")) return getSongById(id);
        if (id.includes("A")) return getAlbumById(id);
        if (id.includes("P")) return getPersonalAlbumsById(id);

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
            await AsyncStorage.removeItem(id);

            if (id.includes("S")) {
                setSongIds((prevArray) =>
                    prevArray.filter((songId) => songId !== id)
                );
            } else if (id.includes("A")) {
                setAlbumIds((prevArray) =>
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

    const setFavorite = async (id: string, isFavorite: boolean) => {
        if (id.includes("S")) {
            const song = await getSongById(id);
            song.favorite = isFavorite;
            song.date = new Date().toISOString();

            await writeSong(song);
        } else if (id.includes("A")) {
            const album = await getAlbumById(id);
            album.favorite = isFavorite;
            album.date = new Date().toISOString();

            await writeAlbum(album);
        }

        if (isFavorite) {
            addFavorite(id);
        } else {
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
        setLoading(true);

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

        for (let i = 0; i < songs.length; i++) await writeSong(songs[i]);

        for (let i = 0; i < albums.length; i++) await writeAlbum(albums[i]);

        setLoading(false);
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

    const syncPersonalAlbumsIds = async (personalAlbumsList: string[]) => {
        setPersonalAlbumsIds(personalAlbumsList);
    };

    return (
        <DataContext.Provider
            value={{
                songIds,
                albumIds,
                loading,
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
            }}>
            {children}
        </DataContext.Provider>
    );
};
