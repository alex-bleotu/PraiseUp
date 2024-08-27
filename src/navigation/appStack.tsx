import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import React from "react";
import Settings from "../pages/settings";
import Tabs from "./tabs";

const S = createStackNavigator();

const AppStack = () => {
    return (
        <S.Navigator
            initialRouteName="Tabs"
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <S.Screen name="Tabs" component={Tabs} />
            <S.Screen name="Settings" component={Settings} />
        </S.Navigator>
    );
};

export default AppStack;
