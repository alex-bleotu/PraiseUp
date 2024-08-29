import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { albums, songs } from "../../assets/bundle";
import { RefreshContext } from "./refresh";

export const DataContext = createContext<any>(null);

export interface AlbumType {
    id: string;
    title: string;
    songs: string[];
    favorite: boolean;
    date: string;
    cover: string | null | string[];
}

export interface SongType {
    id: string;
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
        const writeLists = async () => {
            if (songIds.length !== 0)
                await AsyncStorage.setItem("songIds", JSON.stringify(songIds));

            if (albumIds.length !== 0)
                await AsyncStorage.setItem(
                    "albumIds",
                    JSON.stringify(albumIds)
                );

            if (personalAlbumsIds.length !== 0)
                await AsyncStorage.setItem(
                    "personalAlbumsIds",
                    JSON.stringify(personalAlbumsIds)
                );
        };

        writeLists();
    }, [songIds, albumIds, personalAlbumsIds]);

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
            if (album.songs.length > 2 && !Array.isArray(album.cover)) {
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
            await AsyncStorage.setItem(album.id, JSON.stringify(album));

            if (album.songs.length > 2 && !Array.isArray(album.cover)) {
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

            if (!personalAlbumsIds.find((id) => id === album.id))
                setPersonalAlbumsIds((prevArray) => [...prevArray, album.id]);

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

        const results = await Promise.all([...songPromises, ...albumPromises]);

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
    };

    const getFavoriteSongsAlbum = async () => {
        const favoriteSongs = await getFavoriteSongs();

        const album: AlbumType = {
            id: "F",
            title: "Favorite Songs",
            songs: favoriteSongs.map((song) => song.id),
            favorite: true,
            date: new Date().toISOString(),
            cover: null,
        };

        return album;
    };

    const createPersonalPlaylist = async (name: string) => {
        return new Promise<AlbumType>(async (resolve) => {
            try {
                const playlist: AlbumType = {
                    id: `P${personalAlbumsIds.length}`,
                    title: name,
                    songs: [],
                    favorite: false,
                    date: new Date().toISOString(),
                    cover: null,
                };

                await writePersonalAlbum(playlist);

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
        } catch (error) {
            console.error("Error deleting personal album file:", error);
        }
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
                createPersonalPlaylist,
                writePersonalAlbum,
                getPersonalAlbums,
                getPersonalAlbumsById,
                deletePersonalAlbum,
            }}>
            {children}
        </DataContext.Provider>
    );
};

export const isSong = (data: SongType | AlbumType | null): data is SongType => {
    return (data as SongType).artist !== undefined;
};
