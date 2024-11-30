import { t } from "@lingui/macro";
import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { DataContext } from "../context/data";
import { HistoryContext } from "../context/history";
import { LoadingContext } from "../context/loading";
import { RecentContext } from "../context/recent";
import { RefreshContext } from "../context/refresh";
import { ThemeContext } from "../context/theme";
import { UserContext } from "../context/user";
import Loading from "../pages/loading";
import AppNavigation from "./appNavigation";
import SplashScreen from "../pages/splashScreen";
import * as SplashScreenExpo from "expo-splash-screen";

const AppContainer = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [video, setVideo] = useState<boolean>(false);

    const { theme, loadTheme, themeType, systemTheme } = useContext(ThemeContext);
    const { updateRefresh } = useContext(RefreshContext);
    const { user } = useContext(UserContext);
    const { loadingData, loadData } = useContext(DataContext);
    const { recent, loadRecent } = useContext(RecentContext);
    const { history, loadHistory } = useContext(HistoryContext);
    const { syncLoading } = useContext(LoadingContext);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await loadTheme();

            SplashScreenExpo.hideAsync();
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
            }}>
                {themeType !== null && (
            (user !== null &&
                (theme === null ||
                    loading === null ||
                    history === null ||
                    recent === null)) ||
            syncLoading ? (
                !video ? 
                <SplashScreen dark={!((themeType === "system" && systemTheme === "light") ||
                    themeType === "light")} setFinish={setVideo}/>
                    : <></>
            ) : (
                <AppNavigation />
            )
        )}
        </View>
    );
};

export default AppContainer;
