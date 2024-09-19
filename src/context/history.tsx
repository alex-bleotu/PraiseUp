import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect } from "react";
import { AlbumType, SongType } from "./data";

export const HistoryContext = createContext<any>(null);

export const HistoryProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [history, setHistory] = React.useState<
        (SongType | AlbumType)[] | null
    >(null);

    useEffect(() => {
        if (history === null) return;
        AsyncStorage.setItem("history", JSON.stringify(history));
    }, [history]);

    const loadHistory = async () => {
        try {
            const storedHistory = await AsyncStorage.getItem("history");

            if (storedHistory !== null) {
                const parsedHistory = JSON.parse(storedHistory);

                setHistory(parsedHistory);
            } else {
                await AsyncStorage.setItem("history", JSON.stringify([]));
                setHistory([]);
            }
        } catch (error) {
            console.error("Failed to load history from storage", error);
        }
    };

    const addToHistory = (data: SongType | AlbumType) => {
        if (history === null) return;

        const newHistory = history.filter((value) => value.id !== data.id);

        newHistory.unshift(data);

        if (newHistory.length > 30) newHistory.pop();

        setHistory(newHistory);
    };

    const removeFromHistory = (id: string) => {
        if (history === null) return;

        setHistory(history.filter((value) => value.id !== id));
    };

    const deleteHistory = () => {
        setHistory([]);
    };

    return (
        <HistoryContext.Provider
            value={{
                history,
                setHistory,
                addToHistory,
                removeFromHistory,
                deleteHistory,
                loadHistory,
            }}>
            {children}
        </HistoryContext.Provider>
    );
};
