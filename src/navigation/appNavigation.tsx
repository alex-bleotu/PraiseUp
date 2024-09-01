import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import Background from "../components/wrapers/background";
import { AuthContext } from "../context/auth";
import { LoadingContext } from "../context/loading";
import Loading from "../pages/loading";
import AppStack from "./appStack";
import AuthStack from "./authStack";

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

const AppNavigation = () => {
    const { user } = useContext(AuthContext);
    const { loading } = useContext(LoadingContext);

    if (user === undefined) return <Background />;

    if (loading) return <Loading />;

    return (
        <NavigationContainer linking={linking}>
            {user !== null ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

export default AppNavigation;
