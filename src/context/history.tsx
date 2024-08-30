import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { AlbumType, DataContext, SongType } from "./data";

export const HistoryContext = createContext<any>(null);

export const HistoryProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [history, setHistory] = React.useState<
        (SongType | AlbumType)[] | null
    >(null);

    const { loading } = useContext(DataContext);

    useEffect(() => {
        if (loading) return;

        const loadHistory = async () => {
            try {
                const storedHistory = await AsyncStorage.getItem("history");

                if (storedHistory !== null)
                    setHistory(JSON.parse(storedHistory));
                else {
                    await AsyncStorage.setItem("history", JSON.stringify([]));
                    setHistory([]);
                }
            } catch (error) {
                console.error("Failed to load history from storage", error);
            }
        };

        loadHistory();
    }, [loading]);

    useEffect(() => {
        const saveHistory = async () => {
            if (history === null) return;

            await AsyncStorage.setItem("history", JSON.stringify(history));
        };

        saveHistory();
    }, [history]);

    const addToHistory = (data: SongType | AlbumType) => {
        if (history === null) return;

        const newHistory = history.filter((value) => value.id !== data.id);

        newHistory.unshift(data);

        if (newHistory.length > 30) newHistory.pop();

        setHistory(newHistory);
    };

    const removeFromHistory = (song: SongType | AlbumType) => {
        if (history === null) return;

        setHistory(history.filter((item) => item !== song));
    };

    const deleteHistory = () => {
        setHistory([]);
    };

    return (
        <HistoryContext.Provider
            value={{
                history,
                addToHistory,
                removeFromHistory,
                deleteHistory,
            }}>
            {children}
        </HistoryContext.Provider>
    );
};
