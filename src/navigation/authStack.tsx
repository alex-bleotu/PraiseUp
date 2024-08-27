import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import { useEffect, useState } from "react";
import Loading from "../pages/loading";
import Login from "../pages/login";
import Onboard from "../pages/onboard";
import Register from "../pages/register";

const S = createStackNavigator();

const AuthStack = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [onboard, setOnboard] = useState<boolean>(false);

    useEffect(() => {
        const checkOnboarding = async () => {
            const value = await AsyncStorage.getItem("onboard");

            if (value !== null) setOnboard(true);

            setIsLoading(false);
        };

        checkOnboarding();
    }, []);

    if (isLoading) return <Loading />;

    return (
        <S.Navigator
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <S.Screen name="Onboard" component={Onboard} />
            <S.Screen name="Login" component={Login} />
            <S.Screen name="Register" component={Register} />
        </S.Navigator>
    );
};

export default AuthStack;
