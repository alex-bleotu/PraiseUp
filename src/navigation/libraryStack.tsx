import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import React from "react";
import Album from "../pages/album";
import Library from "../pages/library";
import Song from "../pages/song";

const S = createStackNavigator();

const LibraryStack = ({ navigation }: { navigation: any }) => {
    return (
        <S.Navigator
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <S.Screen name="Library" component={Library} />
            <S.Screen name="Song" component={Song} />
            <S.Screen name="Album" component={Album} />
        </S.Navigator>
    );
};

export default LibraryStack;
