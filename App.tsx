import { NavigationContainer } from "@react-navigation/native";
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

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider theme={darkTheme}>
                <ThemeProvider>
                    <HistoryProvider>
                        <RecentProvider>
                            <DataProvider>
                                <RefreshProvider>
                                    <NavigationContainer>
                                        <Tabs />
                                        <StatusBar style="auto" />
                                    </NavigationContainer>
                                </RefreshProvider>
                            </DataProvider>
                        </RecentProvider>
                    </HistoryProvider>
                </ThemeProvider>
            </PaperProvider>
        </GestureHandlerRootView>
    );
}
