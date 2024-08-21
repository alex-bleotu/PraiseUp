import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { darkTheme, lightTheme } from "../utils/theme";

export const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [theme, setTheme] = useState<any>(lightTheme);

    useEffect(() => {
        const load = async () => {
            const themeLoaded = await AsyncStorage.getItem("theme");

            if (themeLoaded === "dark") setTheme(darkTheme);
            else setTheme(lightTheme);
        };

        load();
    }, []);

    useEffect(() => {
        if (theme === lightTheme) AsyncStorage.setItem("theme", "light");
        else AsyncStorage.setItem("theme", "dark");
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
            }}>
            {children}
        </ThemeContext.Provider>
    );
};
