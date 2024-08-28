import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import Login from "../pages/login";
import Onboard from "../pages/onboard";
import Password from "../pages/password";
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
            <S.Screen name="Password" component={Password} />
        </S.Navigator>
    );
};

export default AuthStack;
