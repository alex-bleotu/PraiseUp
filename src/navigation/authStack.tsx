import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import ForgotPassword from "../pages/forgotPassword";
import Login from "../pages/login";
import Onboard from "../pages/onboard";
import Register from "../pages/register";

const S = createStackNavigator();

const AuthStack = () => {
    return (
        <S.Navigator
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <S.Screen name="Onboard" component={Onboard} />
            <S.Screen name="Login" component={Login} />
            <S.Screen name="Register" component={Register} />
            <S.Screen name="ForgotPassword" component={ForgotPassword} />
        </S.Navigator>
    );
};

export default AuthStack;
