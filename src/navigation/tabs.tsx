import {
    FontAwesome6,
    MaterialCommunityIcons as MCIcons,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useContext, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import AnimatedTouchable from "../components/wrapers/animatedTouchable";
import { ThemeContext } from "../context/theme";
import DiscoverStack from "./discoverStack";
import HomeStack from "./homeStack";
import LibraryStack from "./libraryStack";

const Tab = createBottomTabNavigator();

const Tabs = () => {
    const { theme } = useContext(ThemeContext);

    const { height, width } = Dimensions.get("window");

    // TODO: Fix tabs height
    let tabsHeight;
    console.log(height / width);
    if (height / width > 1.9) tabsHeight = Dimensions.get("screen").height - 15;
    else tabsHeight = height + 33;

    const getIconName = (
        routeName: string
    ): keyof typeof FontAwesome6.glyphMap => {
        switch (routeName) {
            case "Home":
                return "house";
            case "Discover":
                return "magnifying-glass";
            case "Library":
                return "bookshelf";
            default:
                return "question";
        }
    };

    return (
        <View style={{ height: tabsHeight }}>
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
                <Tab.Screen name="Library" component={LibraryStack} />
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
