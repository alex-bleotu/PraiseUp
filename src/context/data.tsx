import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import React, { createContext, ReactNode, useEffect, useState } from "react";

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
        const readLists = async () => {
            const songs = await AsyncStorage.getItem("songIds");
            const albums = await AsyncStorage.getItem("albumIds");

            if (songs !== null) setSongIds(JSON.parse(songs));
            else await AsyncStorage.setItem("songIds", JSON.stringify([]));

            if (albums !== null) setAlbumIds(JSON.parse(albums));
            else await AsyncStorage.setItem("albumIds", JSON.stringify([]));
        };

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
        const directory = FileSystem.documentDirectory + "songs/";
        const path = directory + song.id + ".json";

        try {
            await FileSystem.makeDirectoryAsync(directory, {
                intermediates: true,
            });
            await FileSystem.writeAsStringAsync(path, JSON.stringify(song));

            if (!songIds.includes(song.id))
                setSongIds((prevArray) => [...prevArray, song.id]);

            console.log("Wrote song file", song.id);
        } catch (error) {
            console.error("Error writing song file:", error);
        }
    };

    const writeAlbum = async (album: AlbumType) => {
        const directory = FileSystem.documentDirectory + "albums/";
        const path = directory + album.id + ".json";

        try {
            await FileSystem.makeDirectoryAsync(directory, {
                intermediates: true,
            });
            await FileSystem.writeAsStringAsync(path, JSON.stringify(album));

            if (!albumIds.includes(album.id))
                setAlbumIds((prevArray) => [...prevArray, album.id]);

            console.log("Wrote album file", album.id);
        } catch (error) {
            console.error("Error writing album file:", error);
        }
    };

    const readSong = async (id: string) => {
        const path = FileSystem.documentDirectory + "songs/" + id + ".json";

        const song = await FileSystem.readAsStringAsync(path);

        try {
            return JSON.parse(song);
        } catch {
            return null;
        }
    };

    const readAlbum = async (id: string) => {
        const path = FileSystem.documentDirectory + "albums/" + id + ".json";

        const album = await FileSystem.readAsStringAsync(path);

        try {
            return JSON.parse(album);
        } catch {
            return null;
        }
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
        const path =
            FileSystem.documentDirectory +
            (id.includes("A") ? "albums/" : "songs/") +
            id +
            ".json";

        try {
            await FileSystem.deleteAsync(path);
        } catch (error) {
            console.error("Error deleting song file:", error);
        }
    };

    const filter = async (searchQuery: string) => {
        let filtered: any[] = [];
        const query = searchQuery.toLowerCase();

        const stripChords = (lyrics: string) => {
            return lyrics.replace(/\[[^\]]+\]/g, "").toLowerCase();
        };

        const songPromises = songIds.map(async (id) => {
            const song = await readSong(id);
            if (!song) return null;

            const songNameMatches = song.title.toLowerCase().includes(query);
            const artistMatches = song.artist
                ? song.artist.toLowerCase().includes(query)
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

            const albumNameMatches = album.title.toLowerCase().includes(query);
            if (albumNameMatches) {
                return album;
            }
            return null;
        });

        const results = await Promise.all([...songPromises, ...albumPromises]);

        filtered = results.filter((result) => result !== null);

        return filtered;
    };

    const getRandomSongs = (number: number) => {
        const randomSongs: string[] = [];

        while (randomSongs.length < number) {
            const song = songIds[Math.floor(Math.random() * songIds.length)];

            if (!randomSongs.includes(song)) randomSongs.push(song);
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
