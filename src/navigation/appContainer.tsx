import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth";
import { ConstantsContext } from "../context/constants";
import { DataContext } from "../context/data";
import { HistoryContext } from "../context/history";
import { LoadingContext } from "../context/loading";
import { RecentContext } from "../context/recent";
import { ThemeContext } from "../context/theme";
import { UserContext } from "../context/user";
import Loading from "../pages/loading";
import AppNavigation from "./appNavigation";

const AppContainer = () => {
    const { loading, setLoading } = useContext(LoadingContext);
    const { user } = useContext(UserContext);
    const { songIds, albumIds, personalAlbumsIds, loadData } =
        useContext(DataContext);
    const { theme, loadTheme } = useContext(ThemeContext);
    const { recent, loadRecent } = useContext(RecentContext);
    const { history, loadHistory } = useContext(HistoryContext);
    const { loadAuth } = useContext(AuthContext);
    const { loadConstants } = useContext(ConstantsContext);

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            console.log("Loading theme");
            await loadTheme();
            console.log("Loading auth");
            await loadAuth();
            console.log("Loading constants");
            await loadConstants();
        };

        load();
    }, []);

    useEffect(() => {
        if (!user && loading) return;

        const load = async () => {
            console.log("Loading data");
            await loadData();
        };

        load();
    }, [user]);

    useEffect(() => {
        if ((songIds.length === 0 || albumIds.length === 0) && loading) return;

        const load = async () => {
            console.log("Loading history");
            await loadHistory();
            console.log("Loading recent");
            await loadRecent();

            setLoading(false);
        };

        load();
    }, [songIds, albumIds, personalAlbumsIds]);

    if (theme === null) return <></>;
    else if (loading || history === null || recent === null) return <Loading />;

    return <AppNavigation />;
};

export default AppContainer;
