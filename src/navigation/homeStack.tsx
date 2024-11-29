import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import React, { useContext } from "react";
import { ThemeContext } from "../context/theme";
import Album from "../pages/album";
import AllAlbums from "../pages/allAlbums";
import AllSongs from "../pages/allSongs";
import Home from "../pages/home";
import Song from "../pages/song";

const S = createStackNavigator();

const HomeStack = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <S.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <S.Screen name="Home" component={Home} />
            <S.Screen name="Song" component={Song} />
            <S.Screen name="Album" component={Album} />
            <S.Screen name="AllSongs" component={AllSongs} />
            <S.Screen name="AllAlbums" component={AllAlbums} />
        </S.Navigator>
    );
};

export default HomeStack;
