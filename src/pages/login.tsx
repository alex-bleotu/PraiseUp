import { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Background from "../components/wrapers/background";
import Button from "../components/wrapers/button";
import ErrorText from "../components/wrapers/errorText";
import IconButton from "../components/wrapers/iconButton";
import IconInput from "../components/wrapers/iconInput";
import Text from "../components/wrapers/text";
import { AuthContext } from "../context/auth";
import { ThemeContext } from "../context/theme";
import { validateEmail } from "../utils/util";
import Loading from "./loading";

const Login = ({ navigation, route }: { navigation: any; route: any }) => {
    const { login } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    const [registered, setRegistered] = useState<boolean>(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [showError, setShowError] = useState(false);

    if (registered == false) {
        try {
            const { registered: register } = route.params;
            setRegistered(true);
        } catch {}
    }

    if (loading) return <Loading />;

    return (
        <Background center>
            <View>
                <View
                    style={[
                        styles.background,
                        {
                            backgroundColor: theme.colors.paper,
                        },
                    ]}>
                    <Text fontSize={26} bold style={{ marginBottom: 20 }}>
                        Login
                    </Text>
                    <View
                        style={{
                            width: 240,
                        }}>
                        {registered && (
                            <ErrorText
                                succesful
                                text="Registered successfully!"
                            />
                        )}
                        {showError && error && <ErrorText text={error} />}
                        {showError && error && (
                            <View style={{ marginBottom: 5 }} />
                        )}
                    </View>

                    <IconInput
                        icon="email"
                        placeholder="Email"
                        value={email}
                        onChange={setEmail}
                        validate={validateEmail}
                        errorEmpty={showError && !email}
                    />
                    <IconInput
                        icon="lock"
                        placeholder="Password"
                        value={password}
                        onChange={setPassword}
                        style={{ marginTop: 10 }}
                        hidden={true}
                        errorEmpty={showError && !password}
                    />

                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.textContainer}>
                        <Text
                            style={{
                                marginVertical: 2,
                            }}>
                            Don't remember your password?
                        </Text>
                    </TouchableOpacity>

                    <Button
                        mode="contained"
                        text="Log in"
                        onPress={() => {
                            if (!email || !password) setShowError(true);
                            else {
                                setLoading(true);
                                login(email.trim(), password)
                                    .then(() => {
                                        setLoading(false);
                                    })
                                    .catch((error: any) => {
                                        if (
                                            error.message ===
                                            "Request failed with status code 400"
                                        )
                                            setError(
                                                "Invalid email or password"
                                            );
                                        else setError(error.message);
                                        setShowError(true);
                                        setLoading(false);
                                    });
                            }
                        }}
                    />

                    <View style={styles.textContainer}>
                        <Text bold>or</Text>
                    </View>

                    <IconButton
                        src={require("../../assets/images/auth/google.png")}
                        bgcolor={theme.colors.tomato}
                        color={theme.colors.darkWhite}
                        text="Continue with Google"
                    />
                    <IconButton
                        src={require("../../assets/images/auth/facebook.png")}
                        bgcolor={theme.colors.blue}
                        color={theme.colors.darkWhite}
                        text="Continue with Facebook"
                        style={{ marginTop: 10 }}
                    />

                    <View style={styles.textContainer}>
                        <Text color={theme.colors.dark}>
                            Don't have an account?
                        </Text>
                        <TouchableOpacity
                            activeOpacity={theme.activeOpacity}
                            onPress={() => {
                                navigation.navigate("Register");
                                setShowError(false);
                            }}>
                            <Text
                                bold={true}
                                color={theme.colors.lightBlue}
                                style={{
                                    marginLeft: 5,
                                }}>
                                Register
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Background>
    );
};

const styles = StyleSheet.create({
    textContainer: {
        marginTop: 10,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    background: {
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default Login;
