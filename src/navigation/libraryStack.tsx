import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import React from "react";
import Album from "../pages/album";
import Library from "../pages/library";
import Settings from "../pages/settings";
import Song from "../pages/song";

const S = createStackNavigator();

const LibraryStack = ({ navigation }: { navigation: any }) => {
    return (
        <S.Navigator
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <S.Screen name="LibraryPage" component={Library} />
            <S.Screen name="SettingsPage" component={Settings} />
            <S.Screen name="SongPage" component={Song} />
            <S.Screen name="AlbumPage" component={Album} />
        </S.Navigator>
    );
};

export default LibraryStack;
