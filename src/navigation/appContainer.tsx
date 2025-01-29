import * as SplashScreenExpo from "expo-splash-screen";
import React, { useContext, useEffect, useState } from "react";
import { Appearance, View } from "react-native";
import { DataContext } from "../context/data";
import { HistoryContext } from "../context/history";
import { LoadingContext } from "../context/loading";
import { RecentContext } from "../context/recent";
import { RefreshContext } from "../context/refresh";
import { ThemeContext } from "../context/theme";
import { UserContext } from "../context/user";
import SplashScreen from "../pages/splashScreen";
import AppNavigation from "./appNavigation";

const AppContainer = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [video, setVideo] = useState<boolean>(false);

    const { theme, loadTheme, themeType, systemTheme } =
        useContext(ThemeContext);
    const { updateRefresh } = useContext(RefreshContext);
    const { user } = useContext(UserContext);
    const { loadingData, loadData } = useContext(DataContext);
    const { recent, loadRecent } = useContext(RecentContext);
    const { history, loadHistory } = useContext(HistoryContext);
    const { syncLoading } = useContext(LoadingContext);

    // useEffect(() => {
    //     const checkForUpdates = async () => {
    //         try {
    //             // const update = await Updates.checkForUpdateAsync();
    //             const update = { isAvailable: false };
    //             if (update.isAvailable) {
    //                 Alert.alert(
    //                     t`Update Available`,
    //                     t`A new update is available. The app will reload to apply the update.`,
    //                     [
    //                         {
    //                             text: "OK",
    //                             onPress: async () => {
    //                                 // await Updates.fetchUpdateAsync();
    //                                 // await Updates.reloadAsync();
    //                             },
    //                         },
    //                     ]
    //                 );
    //             }
    //         } catch (error) {
    //             console.error("Error checking for updates:", error);
    //         }
    //     };

    //     checkForUpdates();
    // }, []);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await loadTheme();
        };

        load();
    }, []);

    useEffect(() => {
        if (user === undefined && !loading) return;

        const load = async () => {
            console.log("Loading data");
            await loadData();
        };

        load();
    }, [user]);

    useEffect(() => {
        if (loadingData && !loading) return;

        const load = async () => {
            console.log("Loading history");
            await loadHistory();
            console.log("Loading recent");
            await loadRecent();

            updateRefresh();

            setLoading(false);
        };

        load();
    }, [loadingData]);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor:
                    themeType === null
                        ? Appearance.getColorScheme() === "light"
                            ? "#f4f4f4"
                            : "#1a1a1a"
                        : themeType === "light"
                          ? "#f4f4f4"
                          : "#1a1a1a",
            }}>
            {themeType !== null &&
                ((user !== null &&
                    (theme === null ||
                        loading === null ||
                        history === null ||
                        recent === null)) ||
                syncLoading ? (
                    !video ? (
                        <SplashScreen
                            dark={
                                !(
                                    (themeType === "system" &&
                                        systemTheme === "light") ||
                                    themeType === "light"
                                )
                            }
                            onFinish={setVideo}
                            onStart={() => {
                                SplashScreenExpo.hideAsync();
                            }}
                        />
                    ) : (
                        <></>
                    )
                ) : (
                    <AppNavigation />
                ))}
        </View>
    );
};

export default AppContainer;
