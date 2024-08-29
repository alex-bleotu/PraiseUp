import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import Background from "../components/wrapers/background";
import { AuthContext } from "../context/auth";
import HomeStack from "./homeStack";

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

    if (user === undefined) return <Background />;

    return (
        <NavigationContainer linking={linking}>
            {/* {user !== null ? <AppStack /> : <AuthStack /> */}
            <HomeStack />
        </NavigationContainer>
    );
};

export default AppNavigation;
