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
                <PaperProvider theme={darkTheme}>
                    <ThemeProvider>
                        <HistoryProvider>
                            <RecentProvider>
                                <DataProvider>
                                    <RefreshProvider>
                                        <Tabs />
                                        <StatusBar style="auto" />
                                    </RefreshProvider>
                                </DataProvider>
                            </RecentProvider>
                        </HistoryProvider>
                    </ThemeProvider>
                </PaperProvider>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}
