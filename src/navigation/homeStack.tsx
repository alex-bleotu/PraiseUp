import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Album from "../pages/album";
import Home from "../pages/home";
import Song from "../pages/song";

const S = createStackNavigator();

const HomeStack = ({ navigation }: { navigation: any }) => {
    return (
        <S.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <S.Screen name="Home Page" component={Home} />
            <S.Screen name="Song Page" component={Song} />
            <S.Screen name="Album Page" component={Album} />
        </S.Navigator>
    );
};

export default HomeStack;
