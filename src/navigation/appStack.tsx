import { t } from "@lingui/macro";
import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import React, { useContext } from "react";
import { LoadingContext } from "../context/loading";
import AddSong from "../pages/addSong";
import AddToAlbum from "../pages/addToAlbum";
import ForgotPassword from "../pages/forgotPassword";
import Link from "../pages/link";
import Loading from "../pages/loading";
import ResetPassword from "../pages/resetPassword";
import Settings from "../pages/settings";
import Slideshow from "../pages/slideshow";
import Tabs from "./tabs";

const S = createStackNavigator();

const AppStack = () => {
    const { syncLoading } = useContext(LoadingContext);

    if (syncLoading) return <Loading text={t`Syncing data`} />;

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
            <S.Screen name="AddSong" component={AddSong} />
            <S.Screen name="AddToAlbum" component={AddToAlbum} />
            <S.Screen
                name="Slideshow"
                component={Slideshow}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forFadeFromCenter, // Change to fade animation
                }}
            />
        </S.Navigator>
    );
};

export default AppStack;
