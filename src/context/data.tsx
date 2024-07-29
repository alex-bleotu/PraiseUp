import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import React, { createContext, ReactNode, useEffect, useState } from "react";

export const DataContext = createContext<any>(null);

export interface Album {
    id: string;
    type: string;
    title: string;
    songs: string[];
}

export interface Song {
    id: string;
    type: string;
    title: string;
    artist: string;
    cover: string;
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

    const writeSong = async (song: Song) => {
        const path =
            FileSystem.documentDirectory + "songs/" + song.id + ".json";

        await FileSystem.writeAsStringAsync(path, JSON.stringify(song));
    };

    const writeAlbum = async (album: Album) => {
        const path =
            FileSystem.documentDirectory + "albums/" + album.id + ".json";

        await FileSystem.writeAsStringAsync(path, JSON.stringify(album));
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
        const song = await readSong(id);
        const album = await readAlbum(id);

        if (song) return song;
        if (album) return album;

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

    const filter = (searchQuery: string) => {
        let filtered: any = [];
        const query = searchQuery.toLowerCase();

        songIds.forEach(async (id) => {
            const song = await readSong(id);

            if (!song) return;

            const stripChords = (lyrics: string) => {
                return lyrics.replace(/\[[^\]]+\]/g, "").toLowerCase();
            };

            const songNameMatches = song.title.toLowerCase().includes(query);
            const artistMatches = song.artist
                ? song.artist.toLowerCase().includes(query)
                : false;
            const lyricsMatches = song.lyrics
                ? stripChords(song.lyrics).includes(query)
                : false;

            if (songNameMatches || artistMatches || lyricsMatches)
                filtered.push(song);
        });

        albumIds.forEach(async (id) => {
            const album = await readAlbum(id);

            if (!album) return;

            const albumNameMatches = album.title.toLowerCase().includes(query);

            if (albumNameMatches) filtered.push(album);
        });

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
            }}>
            {children}
        </DataContext.Provider>
    );
};
