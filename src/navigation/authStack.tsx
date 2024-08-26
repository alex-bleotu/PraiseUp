import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import Loading from "../pages/loading";
import Login from "../pages/login";
import Onboard from "../pages/onboard";
import Register from "../pages/register";

const Stack = createNativeStackNavigator();

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
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {onboard ? null : (
                <Stack.Screen name="Onboard" component={Onboard} />
            )}
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
    );
};

export default AuthStack;
