import { useContext, useState } from "react";
import {
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import Background from "../components/wrapers/background";
import Button from "../components/wrapers/button";
import ErrorText from "../components/wrapers/errorText";
import IconButton from "../components/wrapers/iconButton";
import IconInput from "../components/wrapers/iconInput";
import Input from "../components/wrapers/input";
import Text from "../components/wrapers/text";
import { AuthContext } from "../context/auth";
import { ThemeContext } from "../context/theme";
import { validateEmail } from "../utils/util";
import Loading from "./loading";

const Register = ({ navigation }: { navigation: any }) => {
    const { register }: any = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [emailValid, setEmailValid] = useState(true);

    const [showError, setShowError] = useState(false);
    const [error, setError] = useState("");

    if (loading) return <Loading />;

    return (
        <Background center>
            <KeyboardAvoidingView behavior="height">
                <View
                    style={[
                        styles.background,
                        {
                            backgroundColor: theme.colors.paper,
                        },
                    ]}>
                    <Text fontSize={26} bold style={{ marginBottom: 20 }}>
                        Register
                    </Text>
                    <View
                        style={{
                            width: 240,
                        }}>
                        {showError && !emailValid && (
                            <ErrorText text="Email is not valid." />
                        )}
                        {showError && password !== confirmPassword && (
                            <ErrorText text="Passwords don't match" />
                        )}
                        {showError && password && password.length < 8 && (
                            <ErrorText text="Password too short" />
                        )}
                        {showError && error && <ErrorText text={error} />}
                        {showError && <View style={{ marginBottom: 5 }} />}
                    </View>

                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                        <Input
                            placeholder="First name"
                            value={firstName}
                            onChange={setFirstName}
                            style={{ width: 120 }}
                            errorEmpty={showError && !firstName}
                            autoCapitalize
                            maxLength={15}
                        />
                        <Input
                            placeholder="Last name"
                            value={lastName}
                            onChange={setLastName}
                            style={{ width: 120, marginLeft: 10 }}
                            errorEmpty={showError && !lastName}
                            autoCapitalize
                            maxLength={15}
                        />
                    </View>

                    <IconInput
                        icon="email"
                        placeholder="Email"
                        value={email}
                        onChange={setEmail}
                        validate={validateEmail}
                        onValidateChange={setEmailValid}
                        style={{ marginTop: 10 }}
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

                    <IconInput
                        icon="lock"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        style={{ marginVertical: 10 }}
                        hidden={true}
                        errorEmpty={showError && !confirmPassword}
                    />

                    <Button
                        mode="contained"
                        text="Register"
                        onPress={() => {
                            if (
                                firstName &&
                                lastName &&
                                email &&
                                password &&
                                confirmPassword &&
                                emailValid &&
                                password === confirmPassword &&
                                password.length > 4
                            ) {
                                setLoading(true);
                                register(
                                    firstName.trim(),
                                    lastName.trim(),
                                    email.trim(),
                                    password
                                )
                                    .then(() => {
                                        setLoading(false);
                                        navigation.navigate("Login", {
                                            registered: true,
                                        });
                                    })
                                    .catch((error: any) => {
                                        setError(error.response.data.message);
                                        if (
                                            error.response.data.message ===
                                            undefined
                                        )
                                            setError("Something went wrong.");
                                        setShowError(true);
                                        setLoading(false);
                                    });
                            } else setShowError(true);
                        }}
                    />

                    <View style={styles.textContainer}>
                        <Text bold>or</Text>
                    </View>

                    <IconButton
                        src={require("../../assets/images/auth/google.png")}
                        bgcolor={theme.colors.tomato}
                        color={theme.colors.white}
                        text="Continue with Google"
                    />
                    <IconButton
                        src={require("../../assets/images/auth/facebook.png")}
                        bgcolor={theme.colors.blue}
                        color={theme.colors.white}
                        text="Continue with Facebook"
                        style={{ marginTop: 10 }}
                    />

                    <View style={styles.textContainer}>
                        <Text>Already have an account?</Text>
                        <TouchableOpacity
                            activeOpacity={theme.activeOpacity}
                            onPress={() => {
                                navigation.navigate("Login");
                            }}>
                            <Text
                                bold={true}
                                color={theme.colors.lightBlue}
                                style={{
                                    marginLeft: 5,
                                }}>
                                Log in
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Background>
    );
};

const styles = StyleSheet.create({
    textContainer: {
        marginTop: 10,
        marginBottom: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
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

export default Register;
