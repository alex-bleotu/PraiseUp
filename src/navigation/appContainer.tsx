import { t } from "@lingui/macro";
import * as SplashScreen from "expo-splash-screen";
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

const AppContainer = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<string>("");
    const { theme, loadTheme } = useContext(ThemeContext);
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
            setLoadingText(t`Loading user theme`);
        };

        load();
    }, []);

    useEffect(() => {
        if (user === undefined && !loading) return;

        const load = async () => {
            console.log("Loading data");
            setLoadingText(t`Loading data`);
            await loadData();
        };

        load();
    }, [user]);

    useEffect(() => {
        if (loadingData && !loading) return;

        const load = async () => {
            console.log("Loading history");
            setLoadingText(t`Loading history`);
            await loadHistory();
            console.log("Loading recent");
            setLoadingText(t`Loading recent data`);
            await loadRecent();

            setLoadingText(t`Updating the content`);
            updateRefresh();

            setLoading(false);

            SplashScreen.hideAsync();
        };

        load();
    }, [loadingData]);

    return (
        <View
            style={{
                flex: 1,
            }}>
            {(user !== null &&
                (theme === null ||
                    loading === null ||
                    history === null ||
                    recent === null)) ||
            syncLoading ? (
                <Loading text={syncLoading ? t`Syncing data` : loadingText} />
            ) : (
                <AppNavigation />
            )}
        </View>
    );
};

export default AppContainer;
