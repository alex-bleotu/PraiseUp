import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { AlbumType, DataContext, SongType } from "./data";
import { LoadingContext } from "./loading";

export const RecentContext = createContext<any>(null);

export const RecentProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [recent, setRecent] = React.useState<(SongType | AlbumType)[] | null>(
        null
    );

    const { getRandom, getPersonalAlbumsById, getSongById, getAlbumById } =
        useContext(DataContext);
    const { loading } = useContext(LoadingContext);

    useEffect(() => {
        if (loading) return;

        const loadRecent = async () => {
            try {
                const storedRecent = await AsyncStorage.getItem("recent");
                let recent;

                if (storedRecent !== null) {
                    recent = JSON.parse(storedRecent);
                    await fullyUpdateRecent(recent);
                } else setRecent(await getRandom(6));
            } catch (error) {
                console.error("Failed to load recent from storage", error);
            }
        };

        loadRecent();
    }, [loading]);

    useEffect(() => {
        const saveRecent = async () => {
            if (recent === null || recent.length === 0) return;

            await AsyncStorage.setItem("recent", JSON.stringify(recent));
        };

        saveRecent();
    }, [recent]);

    const addToRecent = (data: SongType | AlbumType) => {
        if (recent === null) return;

        const newRecent = recent.filter((value) => value.id !== data.id);

        newRecent.unshift(data);

        if (newRecent.length > 6) newRecent.pop();

        setRecent(newRecent);
    };

    const removeFromRecent = (data: SongType | AlbumType) => {
        if (recent === null) return;

        setRecent(recent.filter((item) => item !== data));
    };

    const deleteRecent = () => {
        setRecent([]);
    };

    const updateRecent = async () => {
        if (recent === null) return;

        const newRecent = await Promise.all(
            recent.map(async (item) => {
                if (item.id.startsWith("P")) {
                    const album = await getPersonalAlbumsById(item.id);

                    if (album === null) return null;

                    return album;
                }

                return item;
            })
        ).then((items) => items.filter((item) => item !== null));

        while (newRecent.length < 6) {
            const newSong = (await getRandom(1))[0];
            if (newRecent.find((item) => item.id === newSong.id)) continue;
            newRecent.push(newSong);
        }

        setRecent(newRecent);
    };

    const fullyUpdateRecent = async (recent: (SongType | AlbumType)[]) => {
        if (recent === null) return;

        const newRecent = await Promise.all(
            recent.map(async (item) => {
                if (item.id.startsWith("P")) {
                    const album = await getPersonalAlbumsById(item.id);

                    if (album === null) return null;

                    return album;
                } else if (item.id.startsWith("S")) {
                    const song = await getSongById(item.id);

                    if (song === null) return null;

                    return song;
                } else if (item.id.startsWith("A")) {
                    const album = await getAlbumById(item.id);

                    if (album === null) return null;

                    return album;
                }

                return item;
            })
        ).then((items) => items.filter((item: any) => item !== null));

        while (newRecent.length < 6) {
            const newSong = (await getRandom(1))[0];
            if (newRecent.find((item: any) => item.id === newSong.id)) continue;
            newRecent.push(newSong);
        }

        setRecent(newRecent);
    };

    return (
        <RecentContext.Provider
            value={{
                recent,
                addToRecent,
                removeFromRecent,
                deleteRecent,
                updateRecent,
                fullyUpdateRecent,
            }}>
            {children}
        </RecentContext.Provider>
    );
};
