import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect } from "react";

export const HistoryContext = createContext<any>(null);

export const HistoryProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [history, setHistory] = React.useState<string[]>([]);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const storedHistory = await AsyncStorage.getItem("history");

                if (storedHistory !== null)
                    setHistory(JSON.parse(storedHistory));
                else await AsyncStorage.setItem("history", JSON.stringify([]));
            } catch (error) {
                console.error("Failed to load history from storage", error);
            }
        };

        loadHistory();
    }, []);

    useEffect(() => {
        const saveHistory = async () => {
            try {
                await AsyncStorage.setItem("history", JSON.stringify(history));
            } catch (error) {
                console.error("Failed to save history to storage", error);
            }
        };

        saveHistory();
    }, [history]);

    const addSongToHistory = (id: string) => {
        const newHistory = [];

        newHistory.push(id);
        newHistory.push(...history.filter((songId: string) => songId !== id));

        if (newHistory.length > 30) newHistory.pop();

        setHistory(newHistory);
    };

    const removeSongFromHistory = (id: string) => {
        setHistory(history.filter((songId: string) => songId !== id));
    };

    const deleteHistory = () => {
        setHistory([]);
    };

    return (
        <HistoryContext.Provider
            value={{
                history,
                addSongToHistory,
                removeSongFromHistory,
                deleteHistory,
            }}>
            {children}
        </HistoryContext.Provider>
    );
};
