import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Settings from "../pages/settings";
import User from "../pages/user";

const S = createStackNavigator();

const UserStack = ({ navigation }: { navigation: any }) => {
    return (
        <S.Navigator
            screenOptions={{
                headerShown: false,
                presentation: "transparentModal",
                // cardStyle: { backgroundColor: "black" }, // Set the background color
                // cardStyleInterpolator: ({ current, layouts }) => {
                //     return {
                //         cardStyle: {
                //             opacity: current.progress,
                //             backgroundColor: "black", // Ensure the interpolator sets the background color
                //         },
                //     };
                // },
                gestureEnabled: true,
            }}>
            <S.Screen name="UserPage" component={User} />
            <S.Screen name="SettingsPage" component={Settings} />
        </S.Navigator>
    );
};

export default UserStack;
