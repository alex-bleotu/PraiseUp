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
                // gestureEnabled: true,
                presentation: "transparentModal",
            }}>
            <S.Screen name="HomePage" component={Home} />
            <S.Screen name="SongPage" component={Song} />
            <S.Screen name="AlbumPage" component={Album} />
        </S.Navigator>
    );
};

export default HomeStack;
