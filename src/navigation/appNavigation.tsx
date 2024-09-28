import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import { UserContext } from "../context/user";
import AppStack from "./appStack";
import AuthStack from "./authStack";

const linking: LinkingOptions<any> = {
    prefixes: ["praiseup://", "https://praiseup.alexbleotu.com"],
    config: {
        screens: {
            Tabs: {
                screens: {
                    HomeStack: {
                        path: "home",
                        initialRouteName: "Home",
                        screens: {
                            Home: "",
                            Song: "song/:id",
                            Album: "album/:id",
                        },
                    },
                },
            },
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
