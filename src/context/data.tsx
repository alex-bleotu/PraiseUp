import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { albums, songs } from "../../assets/bundle";

export const DataContext = createContext<any>(null);

export interface AlbumType {
    id: string;
    title: string;
    songs: string[];
}

export interface SongType {
    id: string;
    title: string;
    artist: string;
    cover: string | null;
    lyrics: string;
}

export const DataProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [songIds, setSongIds] = useState<string[]>([]);
    const [albumIds, setAlbumIds] = useState<string[]>([]);

    useEffect(() => {
        const firstLoad = async () => {
            const loaded = await AsyncStorage.getItem("loaded");

            if (loaded === null) {
                AsyncStorage.clear();

                for (let i = 0; i < songs.length; i++)
                    await writeSong(songs[i]);
                for (let i = 0; i < albums.length; i++)
                    await writeAlbum(albums[i]);

                const path = FileSystem.documentDirectory + "bundle.ts";

                try {
                    const fileInfo = await FileSystem.getInfoAsync(path);
                    if (fileInfo.exists) {
                        await FileSystem.deleteAsync(path);
                        console.log("Deleted bundle file");
                    } else console.log("Bundle file does not exist");
                } catch (error) {
                    console.error("Error checking bundle file", error);
                }

                await AsyncStorage.setItem("loaded", "true");
            }
        };

        const readLists = async () => {
            const songs = await AsyncStorage.getItem("songIds");
            const albums = await AsyncStorage.getItem("albumIds");

            if (songs !== null) setSongIds(JSON.parse(songs));

            if (albums !== null) setAlbumIds(JSON.parse(albums));
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

    return (
        <DataContext.Provider
            value={{
                songIds,
                albumIds,
                readSong,
                readAlbum,
                writeAlbum,
                writeSong,
                getById,
                filter,
                getRandomSongs,
                getSongById,
                getAlbumById,
                removeId,
            }}>
            {children}
        </DataContext.Provider>
    );
};

export const isSong = (data: SongType | AlbumType): data is SongType => {
    return (data as SongType).artist !== undefined;
};
