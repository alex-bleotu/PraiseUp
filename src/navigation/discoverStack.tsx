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
                gestureEnabled: true,
                presentation: "transparentModal",
            }}>
            <S.Screen name="DiscoverPage" component={Discover} />
            <S.Screen name="SongPage" component={Song} />
            <S.Screen name="AlbumPage" component={Album} />
        </S.Navigator>
    );
};

export default DiscoverStack;
