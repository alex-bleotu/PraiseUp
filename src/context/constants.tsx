import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect, useState } from "react";

export const ConstantsContext = createContext<any>(null);

export const ConstantsProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [sortBy, setSortBy] = useState<"date" | "name" | null>(null);
    const [display, setDisplay] = useState<"grid" | "list" | null>(null);
    const [lyricsSize, setLyricsSize] = useState<number | null>(null);

    useEffect(() => {
        const load = async () => {
            const sortBy = await AsyncStorage.getItem("sortBy");
            const display = await AsyncStorage.getItem("display");
            const lyricsSize = await AsyncStorage.getItem("lyricsSize");

            if (sortBy) setSortBy(sortBy as "date" | "name");
            else setSortBy("date");
            if (display) setDisplay(display as "grid" | "list");
            else setDisplay("grid");
            if (lyricsSize) setLyricsSize(parseInt(lyricsSize));
            else setLyricsSize(16);
        };

        load();
    }, []);

    useEffect(() => {
        if (sortBy !== null) AsyncStorage.setItem("sortBy", sortBy);
    }, [sortBy]);

    useEffect(() => {
        if (display !== null) AsyncStorage.setItem("display", display);
    }, [display]);

    useEffect(() => {
        if (lyricsSize !== null)
            AsyncStorage.setItem("lyricsSize", lyricsSize.toString());
    }, [lyricsSize]);

    return (
        <ConstantsContext.Provider
            value={{
                sortBy,
                setSortBy,
                display,
                setDisplay,
                lyricsSize,
                setLyricsSize,
            }}>
            {children}
        </ConstantsContext.Provider>
    );
};
