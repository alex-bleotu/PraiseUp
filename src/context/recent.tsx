import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect } from "react";
import { AlbumType, SongType } from "./data";

export const RecentContext = createContext<any>(null);

export const RecentProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [recent, setRecent] = React.useState<(SongType | AlbumType)[]>([]);

    useEffect(() => {
        const loadRecent = async () => {
            try {
                const storedRecent = await AsyncStorage.getItem("recent");

                if (storedRecent !== null) setRecent(JSON.parse(storedRecent));
                else await AsyncStorage.setItem("recent", JSON.stringify([]));
            } catch (error) {
                console.error("Failed to load recent from storage", error);
            }
        };

        loadRecent();
    }, []);

    useEffect(() => {
        const saveRecent = async () => {
            try {
                await AsyncStorage.setItem("recent", JSON.stringify(recent));
            } catch (error) {
                console.error("Failed to save recent to storage", error);
            }
        };

        saveRecent();
    }, [recent]);

    const addToRecent = (data: SongType | AlbumType) => {
        const newRecent = recent.filter((value) => value.id !== data.id);

        newRecent.unshift(data);

        if (newRecent.length > 6) newRecent.pop();

        setRecent(newRecent);
    };

    const removeFromRecent = (data: SongType | AlbumType) => {
        setRecent(recent.filter((item) => item !== data));
    };

    const deleteRecent = () => {
        setRecent([]);
    };

    return (
        <RecentContext.Provider
            value={{
                recent,
                addToRecent,
                removeFromRecent,
                deleteRecent,
            }}>
            {children}
        </RecentContext.Provider>
    );
};
