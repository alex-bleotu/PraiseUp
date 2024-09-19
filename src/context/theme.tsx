import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { Appearance } from "react-native";
import { darkTheme, lightTheme } from "../utils/theme";

export const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [loading] = useState(true);
    const [theme, setTheme] = useState<any>(null);

    const loadTheme = async () => {
        const themeLoaded = await AsyncStorage.getItem("theme");

        if (themeLoaded === "dark") setTheme(darkTheme);
        else if (themeLoaded === "light") setTheme(lightTheme);
        else if (Appearance.getColorScheme() === "dark") setTheme(darkTheme);
        else setTheme(lightTheme);
    };

    useEffect(() => {
        if (theme === lightTheme) AsyncStorage.setItem("theme", "light");
        else if (theme === darkTheme) AsyncStorage.setItem("theme", "dark");
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                loadTheme,
            }}>
            {children}
        </ThemeContext.Provider>
    );
};
