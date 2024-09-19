import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { Dimensions } from "react-native";

export const ConstantsContext = createContext<any>(null);

export const ConstantsProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [sortBy, setSortBy] = useState<"date" | "name" | null>(null);
    const [display, setDisplay] = useState<"grid" | "list" | null>(null);
    const [lyricsSize, setLyricsSize] = useState<number | null>(null);
    const [chords, setChords] = useState<
        "split" | "combined" | "separated" | null
    >(null);
    const [appHeight, setAppHeight] = useState(0);

    const loadConstants = async () => {
        const sortBy = await AsyncStorage.getItem("sortBy");
        const display = await AsyncStorage.getItem("display");
        const lyricsSize = await AsyncStorage.getItem("lyricsSize");
        const chords = await AsyncStorage.getItem("chords");

        if (sortBy) setSortBy(sortBy as "date" | "name");
        else setSortBy("date");
        if (display) setDisplay(display as "grid" | "list");
        else setDisplay("grid");
        if (lyricsSize) setLyricsSize(parseInt(lyricsSize));
        else setLyricsSize(16);
        if (chords) setChords(chords as "split" | "combined" | "separated");
        else setChords("combined");

        const { height: windowHeight } = Dimensions.get("window");
        const { height: screenHeight } = Dimensions.get("screen");

        // TODO: Fix tabs height
        let appHeight;
        if (screenHeight - windowHeight < 70) appHeight = screenHeight - 15;
        else appHeight = screenHeight - 48;

        setAppHeight(appHeight);
    };

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

    useEffect(() => {
        if (chords !== null) AsyncStorage.setItem("chords", chords);
    }, [chords]);

    return (
        <ConstantsContext.Provider
            value={{
                sortBy,
                setSortBy,
                display,
                setDisplay,
                lyricsSize,
                setLyricsSize,
                appHeight,
                chords,
                setChords,
                loadConstants,
            }}>
            {children}
        </ConstantsContext.Provider>
    );
};
