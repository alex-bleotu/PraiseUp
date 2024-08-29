import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import React from "react";
import ForgotPassword from "../pages/forgotPassword";
import Link from "../pages/link";
import ResetPassword from "../pages/resetPassword";
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
            <S.Screen name="Link" component={Link} />
            <S.Screen name="ResetPassword" component={ResetPassword} />
            <S.Screen name="ForgotPassword" component={ForgotPassword} />
        </S.Navigator>
    );
};

export default AppStack;
