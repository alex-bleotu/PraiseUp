import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Album from "../pages/album";
import Discover from "../pages/discover";
import Song from "../pages/song";

const S = createStackNavigator();

const DiscoverStack = ({ navigation }: { navigation: any }) => {
    return (
        <S.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <S.Screen name="Discover Page" component={Discover} />
            <S.Screen name="Song Page" component={Song} />
            <S.Screen name="Album Page" component={Album} />
        </S.Navigator>
    );
};

export default DiscoverStack;
