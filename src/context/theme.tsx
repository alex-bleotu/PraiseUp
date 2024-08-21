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

    const changeTheme = () => {
        if (theme === lightTheme) {
            setTheme(darkTheme);
            AsyncStorage.setItem("theme", "dark");
        } else {
            setTheme(lightTheme);
            AsyncStorage.setItem("theme", "light");
        }
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                changeTheme,
            }}>
            {children}
        </ThemeContext.Provider>
    );
};
