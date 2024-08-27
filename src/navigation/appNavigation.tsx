import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import { AuthContext } from "../context/auth";
import AuthStack from "./authStack";
import Tabs from "./tabs";

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

    return (
        <NavigationContainer linking={linking}>
            {user !== null ? <Tabs /> : <AuthStack />}
        </NavigationContainer>
    );
};

export default AppNavigation;
