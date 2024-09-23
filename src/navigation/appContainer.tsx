import { t } from "@lingui/macro";
import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/data";
import { HistoryContext } from "../context/history";
import { RecentContext } from "../context/recent";
import { RefreshContext } from "../context/refresh";
import { UserContext } from "../context/user";
import Loading from "../pages/loading";
import AppNavigation from "./appNavigation";

const AppContainer = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { updateRefresh } = useContext(RefreshContext);
    const { user } = useContext(UserContext);
    const { loadingData, loadData } = useContext(DataContext);
    const { recent, loadRecent } = useContext(RecentContext);
    const { history, loadHistory } = useContext(HistoryContext);

    useEffect(() => {
        setLoading(true);
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

    if (
        user !== null &&
        (loading === null || history === null || recent === null)
    )
        return <Loading text={t`Updating the content`} />;

    return <AppNavigation />;
};

export default AppContainer;
