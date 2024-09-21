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
    const [themeType, setThemeType] = useState<"light" | "dark" | "system">(
        "system"
    );

    const loadTheme = async () => {
        const themeLoaded = await AsyncStorage.getItem("themeType");

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
        const systemTheme = Appearance.getColorScheme();
        if (systemTheme === "dark") {
            setTheme(darkTheme);
        } else {
            setTheme(lightTheme);
        }
    };

    useEffect(() => {
        loadTheme();

        const appearanceListener = Appearance.addChangeListener(() => {
            if (themeType === "system") {
                updateSystemTheme();
            }
        });

        return () => {
            appearanceListener.remove();
        };
    }, []);

    useEffect(() => {
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

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setThemeType,
                themeType,
            }}>
            {children}
        </ThemeContext.Provider>
    );
};
