import { t } from "@lingui/macro";
import { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import Button from "../components/wrapers/button";
import IconInput from "../components/wrapers/iconInput";
import ImageButton from "../components/wrapers/imageButton";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { AuthContext } from "../context/auth";
import { LoadingContext } from "../context/loading";
import { ThemeContext } from "../context/theme";
import { validateEmail } from "../utils/util";

const Login = ({ navigation, route }: { navigation: any; route: any }) => {
    const { loading } = useContext(LoadingContext);
    const { login, loginAsGuest, googleLogin } = useContext(AuthContext);
    const { theme, themeType, systemTheme } = useContext(ThemeContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailValid, setEmailValid] = useState(true);

    const [guestLoading, setGuestLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const [error, setError] = useState<string>("");

    useEffect(() => {
        setError("");
    }, [email, password]);

    useEffect(() => {
        if (email === "") {
            try {
                const { email } = route.params;
                setEmail(email);
                setEmailValid(validateEmail(email));
            } catch {}
        }
    }, [route.params]);

    return (
        <StackPage
            title={t`Sign In`}
            navigation={navigation}
            noBottom
            variant
            description={t`Type in the email and password you used to create your account.`}>
            <View style={styles.container}>
                <View style={styles.top}>
                    <IconInput
                        icon="email"
                        placeholder={t`Email`}
                        value={email}
                        onChange={setEmail}
                        validate={validateEmail}
                        onValidateChange={setEmailValid}
                        keyboardType={"email-address"}
                        error={error.length > 0}
                    />
                    <IconInput
                        icon="lock"
                        placeholder={t`Password`}
                        value={password}
                        onChange={setPassword}
                        style={{ marginTop: 10 }}
                        hidden={true}
                        error={error.length > 0}
                    />

                    {error.length > 0 && (
                        <View style={styles.error}>
                            <Text color={theme.colors.danger} fontSize={14}>
                                {error}
                            </Text>
                        </View>
                    )}

                    <View
                        style={{
                            marginLeft: "auto",
                        }}>
                        <TouchableOpacity
                            activeOpacity={theme.activeOpacity}
                            style={styles.textContainer}
                            onPress={() => {
                                navigation.navigate("ForgotPassword");
                            }}>
                            <Text
                                color={theme.colors.lightBlue}
                                bold
                                fontSize={16}
                                style={{
                                    marginVertical: 2,
                                    textDecorationLine: "underline",
                                }}>
                                {t`Forgot your password?`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.bottom}>
                    <View
                        style={{
                            width: "100%",
                        }}>
                        <Button
                            mode="contained"
                            text={t`Log in`}
                            upper
                            color={theme.colors.textOnPrimary}
                            fullWidth
                            fontSize={14}
                            bold
                            disabled={
                                !email ||
                                !password ||
                                !emailValid ||
                                guestLoading ||
                                googleLoading
                            }
                            style={{
                                paddingVertical: loading ? 13 : 14.5,
                            }}
                            icon={
                                loading && (
                                    <ActivityIndicator
                                        animating={true}
                                        size={22}
                                        color={theme.colors.textOnPrimary}
                                    />
                                )
                            }
                            onPress={() => {
                                if (loading) return;

                                login(email.trim(), password)
                                    .then(() => {
                                        setError("");
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
                                        else if (
                                            error.message.includes(
                                                "auth/network-request-failed"
                                            )
                                        )
                                            setError(
                                                t`Network error. Please try again later.`
                                            );
                                        else setError(t`Something went wrong.`);
                                    });
                            }}
                        />
                    </View>

                    <View
                        style={[
                            styles.textContainer,
                            {
                                marginVertical: 30,
                            },
                        ]}>
                        <Text bold fontSize={18} upper>{t`or`}</Text>
                    </View>

                    <View style={{ width: "100%" }}>
                        <ImageButton
                            src={require("../../assets/images/auth/google.png")}
                            disabled={loading || guestLoading}
                            bgcolor={
                                themeType === "system"
                                    ? systemTheme === "dark"
                                        ? theme.colors.darkGrey
                                        : theme.colors.white
                                    : themeType === "light"
                                      ? theme.colors.white
                                      : theme.colors.darkGrey
                            }
                            color={
                                themeType === "system"
                                    ? systemTheme === "dark"
                                        ? theme.colors.white
                                        : theme.colors.black
                                    : themeType === "light"
                                      ? theme.colors.black
                                      : theme.colors.white
                            }
                            loading={googleLoading}
                            text={t`Continue with Google`}
                            onPress={() => {
                                if (googleLoading) return;

                                setGoogleLoading(true);
                                setError("");
                                googleLogin()
                                    .then(() => {
                                        setError("");
                                    })
                                    .catch((error: any) => {
                                        if (
                                            error.message.includes(
                                                "auth/network-request-failed"
                                            )
                                        )
                                            setError(
                                                t`Network error. Please try again later.`
                                            );
                                        else setError(t`Something went wrong.`);
                                    })
                                    .finally(() => {
                                        setGoogleLoading(false);
                                    });
                            }}
                        />
                        <Button
                            mode="contained"
                            text={t`Continue as Guest`}
                            upper
                            color={theme.colors.textOnPrimary}
                            fullWidth
                            fontSize={14}
                            bold
                            disabled={loading || googleLoading}
                            style={{
                                paddingVertical: guestLoading ? 13 : 14.5,
                                marginTop: 15,
                            }}
                            onPress={() => {
                                if (guestLoading) return;

                                setError("");
                                setGuestLoading(true);
                                loginAsGuest()
                                    .then(() => {
                                        setError("");
                                        setGuestLoading(false);
                                    })
                                    .catch((error: any) => {
                                        setError(t`Something went wrong.`);
                                        setGuestLoading(false);
                                    });
                            }}
                            icon={
                                guestLoading && (
                                    <ActivityIndicator
                                        animating={true}
                                        size={22}
                                        color={theme.colors.textOnPrimary}
                                    />
                                )
                            }
                        />
                    </View>
                </View>
            </View>
        </StackPage>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
    },
    textContainer: {
        marginVertical: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    top: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    bottom: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginBottom: 15,
        marginTop: 20,
    },
    error: {
        alignSelf: "flex-start",
        marginTop: 5,
        marginLeft: 15,
    },
});

export default Login;
