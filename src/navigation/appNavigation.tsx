import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import { UserContext } from "../context/user";
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
    const { user } = useContext(UserContext);

    return (
        <NavigationContainer linking={linking}>
            {user !== null ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

export default AppNavigation;
