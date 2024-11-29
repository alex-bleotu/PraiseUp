import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import { View } from "react-native";
import { ThemeContext } from "../context/theme";
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
    const { theme } = useContext(ThemeContext);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
            }}>
            <NavigationContainer
                linking={linking}
                theme={{
                    dark: false,
                    colors: {
                        background: theme.colors.background,
                        primary: "",
                        card: "",
                        text: "",
                        border: "",
                        notification: "",
                    },
                }}>
                {user !== null ? <AppStack /> : <AuthStack />}
            </NavigationContainer>
        </View>
    );
};

export default AppNavigation;
