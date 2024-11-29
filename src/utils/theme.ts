import { MD3LightTheme } from "react-native-paper";

const defaultTheme = {
    ...MD3LightTheme,

    activeOpacity: 0.75,

    colors: {
        ...MD3LightTheme.colors,

        white: "#ffffff",
        darkWhite: "#f6f6f6",
        black: "#1a1a1a",
        grey: "#7f7f7f",
        blue: "#0a58d1",
        lightBlue: "#586eb2",
        lightGrey: "#bababa",
        darkGrey: "#383838",
        danger: "#f65857",
        tomato: "#f5593d",
        success: "#00b16a",
        gold: "#f5a623",
    },
};

export const lightTheme = {
    ...defaultTheme,
    colors: {
        ...defaultTheme.colors,
        primary: "#4491c2",
        primaryVariant: "#c7d6fc",
        secondary: "#CCE490",

        background: "#f4f4f4",
        paper: "#ffffff",
        darkPaper: "#dcdcdc",

        text: "#1a1a1a",
        textInverted: "#f2f2f2",
        textVariant: "#9f9f9f",
        textOnPrimary: "#f2f2f2",

        successBackground: "rgba(46, 125, 50, 0.6)",
        errorBackground: "rgba(150, 20, 20, 0.6)",
    },
};

export const darkTheme = {
    ...defaultTheme,
    colors: {
        ...defaultTheme.colors,
        primary: "#8a56ac",
        primaryVariant: "#3a2e48",
        secondary: "#ffb74d",

        background: "#1a1a1a",
        paper: "#2b2b2b",
        darkPaper: "#383838",

        text: "#e6e6e6",
        textInverted: "#121212",
        textVariant: "#9f9f9f",
        textOnPrimary: "#f2f2f2",

        successBackground: "rgba(46, 125, 50, 0.25)",
        errorBackground: "rgba(150, 20, 20, 0.25)",
    },
};

// darkPurple
export const darkPurpleTheme = {
    ...defaultTheme,
    colors: {
        ...defaultTheme.colors,
        primary: "#8a56ac",
        primaryVariant: "#b39ddb",
        secondary: "#ffb74d",

        background: "#2c2235",
        paper: "#3a2e4a",
        darkPaper: "#4a415a",

        text: "#e6e6e6",
        textInverted: "#121212",
    },
};
