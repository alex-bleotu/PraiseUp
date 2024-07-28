import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect } from "react";

export const RecentContext = createContext<any>(null);

export const RecentProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [recent, setRecent] = React.useState<string[]>([]);

    useEffect(() => {
        const loadRecent = async () => {
            try {
                const storedRecent = await AsyncStorage.getItem("recent");

                if (storedRecent !== null) setRecent(JSON.parse(storedRecent));
                else await AsyncStorage.setItem("recent", JSON.stringify([]));
            } catch (error) {
                console.error("Failed to load favorite from storage", error);
            }
        };

        loadRecent();
    }, []);

    useEffect(() => {
        const saveRecent = async () => {
            try {
                await AsyncStorage.setItem("recent", JSON.stringify(recent));
            } catch (error) {
                console.error("Failed to save favorite to storage", error);
            }
        };

        saveRecent();
    }, [recent]);

    const addSongToRecent = (id: string) => {
        const newRecent = [];

        newRecent.push(id);
        newRecent.push(...recent.filter((songId: string) => songId !== id));

        if (newRecent.length > 6) newRecent.pop();

        setRecent(newRecent);
    };

    const removeSongFromRecent = (id: string) => {
        setRecent(recent.filter((songId: string) => songId !== id));
    };

    const deleteRecent = () => {
        setRecent([]);
    };

    return (
        <RecentContext.Provider
            value={{
                recent,
                addSongToRecent,
                removeSongFromRecent,
                deleteRecent,
            }}>
            {children}
        </RecentContext.Provider>
    );
};
