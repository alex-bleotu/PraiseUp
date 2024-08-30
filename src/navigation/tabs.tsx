import {
    FontAwesome6,
    MaterialCommunityIcons as MCIcons,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useContext, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import AnimatedTouchable from "../components/wrapers/animatedTouchable";
import { ConstantsContext } from "../context/constants";
import { ThemeContext } from "../context/theme";
import DiscoverStack from "./discoverStack";
import HomeStack from "./homeStack";
import LibraryStack from "./libraryStack";

const Tab = createBottomTabNavigator();

const Tabs = () => {
    const { theme } = useContext(ThemeContext);
    const { appHeight } = useContext(ConstantsContext);

    const getIconName = (
        routeName: string
    ): keyof typeof FontAwesome6.glyphMap => {
        switch (routeName) {
            case "HomeStack":
                return "house";
            case "DiscoverStack":
                return "magnifying-glass";
            case "LibraryStack":
                return "bookshelf";
            default:
                return "question";
        }
    };

    return (
        <View style={{ height: appHeight }}>
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
                                    {iconName === "bookshelf" ? (
                                        <MCIcons
                                            name={iconName}
                                            size={35}
                                            color={color}
                                        />
                                    ) : (
                                        <FontAwesome6
                                            name={iconName}
                                            size={size}
                                            color={color}
                                        />
                                    )}
                                </View>
                            </AnimatedTouchable>
                        );
                    },
                    tabBarStyle: {
                        backgroundColor: theme.colors.paper,
                        borderRadius: 12,
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
                <Tab.Screen name="HomeStack" component={HomeStack} />
                <Tab.Screen name="DiscoverStack" component={DiscoverStack} />
                <Tab.Screen name="LibraryStack" component={LibraryStack} />
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
        borderRadius: 12,
        marginTop: 0.5,
        overflow: "hidden",
    },
});
