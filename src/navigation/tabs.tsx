import { FontAwesome6 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useContext, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import AnimatedTouchable from "../components/wrapers/animatedTouchable";
import { ThemeContext } from "../context/theme";
import User from "../pages/user";
import DiscoverStack from "./discoverStack";
import HomeStack from "./homeStack";

const Tab = createBottomTabNavigator();

const Tabs = () => {
    const { theme } = useContext(ThemeContext);

    const height = Dimensions.get("screen").height - 15;

    const getIconName = (
        routeName: string
    ): keyof typeof FontAwesome6.glyphMap => {
        switch (routeName) {
            case "Home":
                return "house";
            case "Discover":
                return "magnifying-glass";
            case "User":
                return "user-large";
            default:
                return "question";
        }
    };

    return (
        <View style={{ height }}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        const iconName = useMemo(
                            () => getIconName(route.name),
                            [route.name]
                        );

                        return (
                            <AnimatedTouchable>
                                <View
                                    style={[
                                        styles.iconContainer,
                                        {
                                            backgroundColor: focused
                                                ? theme.colors.primaryVariant
                                                : "transparent",
                                        },
                                    ]}>
                                    <FontAwesome6
                                        name={iconName}
                                        size={size}
                                        color={color}
                                    />
                                </View>
                            </AnimatedTouchable>
                        );
                    },
                    tabBarStyle: {
                        backgroundColor: theme.colors.paper,
                        borderRadius: 20,
                        height: 80,
                        position: "absolute",
                        marginBottom: 10,
                        marginHorizontal: 10,
                        borderTopWidth: 0,
                        elevation: 0,
                    },
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: "gray",
                    tabBarShowLabel: false,
                    headerShown: false,
                })}>
                <Tab.Screen name="Home" component={HomeStack} />
                <Tab.Screen name="Discover" component={DiscoverStack} />
                <Tab.Screen name="User" component={User} />
            </Tab.Navigator>
        </View>
    );
};

export default Tabs;

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        height: 60,
        borderRadius: 15,
        marginTop: 0.5,
        overflow: "hidden",
    },
});
