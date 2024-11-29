import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import React, { useContext } from "react";
import { ThemeContext } from "../context/theme";
import Album from "../pages/album";
import Discover from "../pages/discover";
import Song from "../pages/song";

const S = createStackNavigator();

const DiscoverStack = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <S.Navigator
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <S.Screen name="Discover" component={Discover} />
            <S.Screen name="Song" component={Song} />
            <S.Screen name="Album" component={Album} />
        </S.Navigator>
    );
};

export default DiscoverStack;
