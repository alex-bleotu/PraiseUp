import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { DataProvider } from "./src/context/data";
import { HistoryProvider } from "./src/context/history";
import { RecentProvider } from "./src/context/recent";
import { RefreshProvider } from "./src/context/refresh";
import { ThemeProvider } from "./src/context/theme";
import Tabs from "./src/navigation/tabs";
import { darkTheme } from "./src/utils/theme";

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { messages as enMessages } from "./src/locales/en/messages";
import { messages as roMessages } from "./src/locales/ro/messages";

const linking: LinkingOptions<any> = {
    prefixes: ["app://"],
    config: {
        screens: {
            Home: {
                screens: {
                    HomePage: "home",
                    SongPage: "song/:id",
                    AlbumPage: "album/:id",
                },
            },
            Discover: "discover",
            User: "user",
        },
    },
};

i18n.load({
    en: enMessages,
    ro: roMessages,
});

i18n.activate("ro");

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer linking={linking}>
                <I18nProvider i18n={i18n}>
                    <PaperProvider theme={darkTheme}>
                        <ThemeProvider>
                            <DataProvider>
                                <HistoryProvider>
                                    <RecentProvider>
                                        <RefreshProvider>
                                            <Tabs />
                                            <StatusBar style="auto" />
                                        </RefreshProvider>
                                    </RecentProvider>
                                </HistoryProvider>
                            </DataProvider>
                        </ThemeProvider>
                    </PaperProvider>
                </I18nProvider>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}
