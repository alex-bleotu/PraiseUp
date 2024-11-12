import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import React, { useContext } from "react";
import { ThemeContext } from "../context/theme";
import AboutUs from "../pages/aboutUs";
import Account from "../pages/account";
import AddSong from "../pages/addSong";
import AddToAlbum from "../pages/addToAlbum";
import ContactUs from "../pages/contactUs";
import ForgotPassword from "../pages/forgotPassword";
import Link from "../pages/link";
import ResetPassword from "../pages/resetPassword";
import Settings from "../pages/settings";
import Slideshow from "../pages/slideshow";
import Tabs from "./tabs";

const S = createStackNavigator();

const AppStack = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <S.Navigator
            initialRouteName="Tabs"
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                cardStyle: {
                    backgroundColor: theme.colors.background,
                },
            }}>
            <S.Screen name="Tabs" component={Tabs} />
            <S.Screen name="Settings" component={Settings} />
            <S.Screen name="Link" component={Link} />
            <S.Screen name="ResetPassword" component={ResetPassword} />
            <S.Screen name="ForgotPassword" component={ForgotPassword} />
            <S.Screen name="AddSong" component={AddSong} />
            <S.Screen name="AddToAlbum" component={AddToAlbum} />
            <S.Screen name="ContactUs" component={ContactUs} />
            <S.Screen name="AboutUs" component={AboutUs} />
            <S.Screen name="Account" component={Account} />
            <S.Screen
                name="Slideshow"
                component={Slideshow}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forFadeFromCenter,
                }}
            />
        </S.Navigator>
    );
};

export default AppStack;
