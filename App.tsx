import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "./src/context/auth";
import { ConstantsProvider } from "./src/context/constants";
import { DataProvider } from "./src/context/data";
import { HistoryProvider } from "./src/context/history";
import { LanguageProvider } from "./src/context/language";
import { RecentProvider } from "./src/context/recent";
import { RefreshProvider } from "./src/context/refresh";
import { ServerProvider } from "./src/context/server";
import { ThemeProvider } from "./src/context/theme";
import AppNavigation from "./src/navigation/appNavigation";
import { darkTheme } from "./src/utils/theme";

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <LanguageProvider>
                    <PaperProvider theme={darkTheme}>
                        <ConstantsProvider>
                            <RefreshProvider>
                                <DataProvider>
                                    <AuthProvider>
                                        <ServerProvider>
                                            <HistoryProvider>
                                                <RecentProvider>
                                                    <AppNavigation />
                                                    <StatusBar style="auto" />
                                                </RecentProvider>
                                            </HistoryProvider>
                                        </ServerProvider>
                                    </AuthProvider>
                                </DataProvider>
                            </RefreshProvider>
                        </ConstantsProvider>
                    </PaperProvider>
                </LanguageProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
