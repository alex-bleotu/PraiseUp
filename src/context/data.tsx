import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { albums, songs } from "../../assets/bundle";

export const DataContext = createContext<any>(null);

export interface AlbumType {
    id: string;
    title: string;
    songs: string[];
    favorite: boolean;
}

export interface SongType {
    id: string;
    title: string;
    artist: string;
    cover: string | null;
    lyrics: string;
    favorite: boolean;
}

export const DataProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [songIds, setSongIds] = useState<string[]>([]);
    const [albumIds, setAlbumIds] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const firstLoad = async () => {
            const loaded = await AsyncStorage.getItem("loaded");

            if (loaded === null) {
                AsyncStorage.clear();

                for (let i = 0; i < songs.length; i++)
                    await writeSong(songs[i]);
                for (let i = 0; i < albums.length; i++)
                    await writeAlbum(albums[i]);

                await AsyncStorage.setItem("loaded", "true");
            }
        };

        const readLists = async () => {
            const songs = await AsyncStorage.getItem("songIds");
            const albums = await AsyncStorage.getItem("albumIds");

            if (songs !== null) setSongIds(JSON.parse(songs));

            if (albums !== null) setAlbumIds(JSON.parse(albums));

            setLoading(false);
        };

        firstLoad();
        readLists();
    }, []);

    useEffect(() => {
        const writeLists = async () => {
            await AsyncStorage.setItem("songIds", JSON.stringify(songIds));
            await AsyncStorage.setItem("albumIds", JSON.stringify(albumIds));
        };

        writeLists();
    }, [songIds, albumIds]);

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
            await AsyncStorage.setItem(album.id, JSON.stringify(album));

            if (!albumIds.find((id) => id === album.id))
                setAlbumIds((prevArray) => [...prevArray, album.id]);

            console.log("Wrote album file", album.id);
        } catch (error) {
            console.error("Error writing album file:", error);
        }
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

    const getRandomSongs = async (number: number) => {
        const randomSongs: SongType[] = [];

        if (number > songIds.length) return [];

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

        if (number > albumIds.length) return [];

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

            await writeSong(song);
        } else if (id.includes("A")) {
            const album = await getAlbumById(id);
            album.favorite = isFavorite;

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
        };

        return album;
    };

    return (
        <DataContext.Provider
            value={{
                songIds,
                albumIds,
                loading,
                readSong,
                readAlbum,
                writeAlbum,
                writeSong,
                getById,
                filter,
                getRandomSongs,
                getRandomAlbums,
                getSongById,
                getAlbumById,
                removeId,
                getFavoriteSongs,
                getFavoriteAlbums,
                setFavorite,
                getFavoriteSongsAlbum,
            }}>
            {children}
        </DataContext.Provider>
    );
};

export const isSong = (data: SongType | AlbumType): data is SongType => {
    return (data as SongType).artist !== undefined;
};
