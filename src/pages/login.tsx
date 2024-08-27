import { t } from "@lingui/macro";
import { useContext, useEffect, useState } from "react";
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
    const { login, loading } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    const [registered, setRegistered] = useState<boolean>(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [emailValid, setEmailValid] = useState(true);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        // Only set registered to true if it's currently false and route param exists
        if (!registered && route.params?.registered) {
            setRegistered(true);
        }
    }, [route.params?.registered]);

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
                        {t`Log in`}
                    </Text>
                    <View
                        style={{
                            width: 240,
                        }}>
                        {registered && (
                            <ErrorText
                                succesful
                                text={t`Registered successfully!`}
                            />
                        )}
                        {showError && !emailValid && (
                            <ErrorText text={t`Email is not valid.`} />
                        )}
                        {showError && error && <ErrorText text={error} />}
                        {showError && error && (
                            <View style={{ marginBottom: 5 }} />
                        )}
                    </View>

                    <IconInput
                        icon="email"
                        placeholder={t`Email`}
                        value={email}
                        onChange={setEmail}
                        validate={validateEmail}
                        onValidateChange={setEmailValid}
                        errorEmpty={showError && !email}
                    />
                    <IconInput
                        icon="lock"
                        placeholder={t`Password`}
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
                            {t`Don't remember your password?`}
                        </Text>
                    </TouchableOpacity>
                    <View
                        style={{
                            width: 250,
                        }}>
                        <Button
                            mode="contained"
                            text={t`Log in`}
                            fullWidth
                            bold
                            onPress={() => {
                                setRegistered(false);

                                if (!email || !password || !emailValid) {
                                    setShowError(true);
                                } else {
                                    login(email.trim(), password)
                                        .then(() => {
                                            setShowError(false);
                                        })
                                        .catch((error: any) => {
                                            if (
                                                error.message.includes(
                                                    "auth/invalid-credential"
                                                )
                                            )
                                                setError(
                                                    t`Invalid email or password.`
                                                );
                                            else setError(error.message);
                                            setShowError(true);
                                        });
                                }
                            }}
                        />
                    </View>

                    <View style={styles.textContainer}>
                        <Text bold>{t`or`}</Text>
                    </View>

                    <IconButton
                        src={require("../../assets/images/auth/google.png")}
                        bgcolor={theme.colors.tomato}
                        color={theme.colors.darkWhite}
                        text={t`Continue with Google`}
                    />
                    <IconButton
                        src={require("../../assets/images/auth/facebook.png")}
                        bgcolor={theme.colors.blue}
                        color={theme.colors.darkWhite}
                        text={t`Continue with Facebook`}
                        style={{ marginTop: 10 }}
                    />

                    <View style={styles.textContainer}>
                        <Text color={theme.colors.dark}>
                            {t`Don't have an account?`}
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
                                {t`Register`}
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
