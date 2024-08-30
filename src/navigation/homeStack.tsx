import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import React from "react";
import Album from "../pages/album";
import Home from "../pages/home";
import Song from "../pages/song";

const S = createStackNavigator();

const HomeStack = () => {
    return (
        <S.Navigator
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <S.Screen name="Home" component={Home} />
            <S.Screen name="Song" component={Song} />
            <S.Screen name="Album" component={Album} />
        </S.Navigator>
    );
};

export default HomeStack;
