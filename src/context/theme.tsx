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
    const [theme, setTheme] = useState<any>(null);
    const [themeType, setThemeType] = useState<
        "light" | "dark" | "system" | null
    >(null);
    const [systemTheme, setSystemTheme] = useState<"light" | "dark">(
        Appearance.getColorScheme() || "light"
    );

    const loadTheme = async () => {
        const themeLoaded = await AsyncStorage.getItem("themeType");

        console.log("themeLoaded", themeLoaded);

        if (themeLoaded === "dark") {
            setTheme(darkTheme);
            setThemeType("dark");
        } else if (themeLoaded === "light") {
            setTheme(lightTheme);
            setThemeType("light");
        } else {
            setThemeType("system");
            updateSystemTheme();
        }
    };

    const updateSystemTheme = () => {
        const systemColorScheme = Appearance.getColorScheme();
        setSystemTheme(systemColorScheme === "dark" ? "dark" : "light");
        if (themeType === "system") {
            setTheme(systemColorScheme === "dark" ? darkTheme : lightTheme);
        }
    };

    useEffect(() => {
        const appearanceListener = Appearance.addChangeListener(() => {
            updateSystemTheme();
        });

        return () => {
            appearanceListener.remove();
        };
    }, []);

    useEffect(() => {
        if (themeType === null) return;

        if (themeType === "light") {
            setTheme(lightTheme);
            AsyncStorage.setItem("themeType", "light");
        } else if (themeType === "dark") {
            setTheme(darkTheme);
            AsyncStorage.setItem("themeType", "dark");
        } else if (themeType === "system") {
            updateSystemTheme();
            AsyncStorage.setItem("themeType", "system");
        }
    }, [themeType]);

    const getSystemTheme = () => {
        return systemTheme === "dark" ? darkTheme : lightTheme;
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setThemeType,
                themeType,
                systemTheme,
                getSystemTheme,
                loadTheme,
            }}>
            {children}
        </ThemeContext.Provider>
    );
};
