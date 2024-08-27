import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { DataProvider } from "./src/context/data";
import { HistoryProvider } from "./src/context/history";
import { RecentProvider } from "./src/context/recent";
import { RefreshProvider } from "./src/context/refresh";
import { ThemeProvider } from "./src/context/theme";
import { darkTheme } from "./src/utils/theme";

import { AuthProvider } from "./src/context/auth";
import { ConstantsProvider } from "./src/context/constants";
import { LanguageProvider } from "./src/context/language";
import AppNavigation from "./src/navigation/appNavigation";

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <LanguageProvider>
                <ThemeProvider>
                    <PaperProvider theme={darkTheme}>
                        <ConstantsProvider>
                            <RefreshProvider>
                                <AuthProvider>
                                    <DataProvider>
                                        <HistoryProvider>
                                            <RecentProvider>
                                                <AppNavigation />
                                                <StatusBar style="auto" />
                                            </RecentProvider>
                                        </HistoryProvider>
                                    </DataProvider>
                                </AuthProvider>
                            </RefreshProvider>
                        </ConstantsProvider>
                    </PaperProvider>
                </ThemeProvider>
            </LanguageProvider>
        </GestureHandlerRootView>
    );
}
