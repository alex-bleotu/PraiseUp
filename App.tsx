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

import { LanguageProvider } from "./src/context/language";

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

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer linking={linking}>
                <LanguageProvider>
                    <PaperProvider theme={darkTheme}>
                        <RefreshProvider>
                            <ThemeProvider>
                                <DataProvider>
                                    <HistoryProvider>
                                        <RecentProvider>
                                            <Tabs />
                                            <StatusBar style="auto" />
                                        </RecentProvider>
                                    </HistoryProvider>
                                </DataProvider>
                            </ThemeProvider>
                        </RefreshProvider>
                    </PaperProvider>
                </LanguageProvider>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}
