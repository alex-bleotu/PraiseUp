import { t } from "@lingui/macro";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Button from "../components/wrapers/button";
import IconInput from "../components/wrapers/iconInput";
import ImageButton from "../components/wrapers/imageButton";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { AuthContext } from "../context/auth";
import { LoadingContext } from "../context/loading";
import { ThemeContext } from "../context/theme";
import { validateEmail } from "../utils/util";

const Register = ({ navigation }: { navigation: any }) => {
    const { loading } = useContext(LoadingContext);
    const { register, loginAsGuest, googleLogin }: any =
        useContext(AuthContext);
    const { theme, themeType, systemTheme } = useContext(ThemeContext);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [guestLoading, setGuestLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const [emailValid, setEmailValid] = useState(true);

    const [showEmailError, setShowEmailError] = useState(false);
    const [showNameError, setShowNameError] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setShowPasswordError(false);
    }, [password]);

    useEffect(() => {
        setShowEmailError(false);
        setError("");
    }, [email]);

    return (
        <StackPage
            title={t`Join Us`}
            navigation={navigation}
            noBottom
            variant
            description={t`Create an account to save your progress and access your data on multiple devices.`}>
            <View style={styles.container}>
                <View style={styles.top}>
                    <IconInput
                        icon="account"
                        placeholder={t`Your Name`}
                        value={username}
                        onChange={setUsername}
                        style={{ marginTop: 10 }}
                        autoCapitalize
                        error={showNameError}
                        errorText={t`Name is too short!`}
                    />
                    <IconInput
                        icon="email"
                        placeholder={t`Personal Email`}
                        value={email}
                        onChange={setEmail}
                        validate={validateEmail}
                        onValidateChange={setEmailValid}
                        style={{ marginTop: 10 }}
                        error={showEmailError}
                        keyboardType={"email-address"}
                    />
                    <IconInput
                        icon="lock"
                        placeholder={t`Password`}
                        value={password}
                        onChange={setPassword}
                        style={{ marginTop: 10 }}
                        hidden={true}
                        error={showPasswordError}
                        errorText={t`Password is too short.`}
                    />

                    {error.length > 0 && (
                        <View style={styles.error}>
                            <Text color={theme.colors.danger} fontSize={14}>
                                {error}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.bottom}>
                    <View
                        style={{
                            width: "100%",
                            marginTop: 10,
                        }}>
                        <Button
                            mode="contained"
                            text={t`Join`}
                            upper
                            fullWidth
                            color={theme.colors.textOnPrimary}
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
                                marginTop: 20,
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

                                setError("");

                                if (username.length < 4) {
                                    setShowNameError(true);
                                    return;
                                } else setShowNameError(false);

                                if (password.length > 5) {
                                    register(
                                        email.trim(),
                                        password,
                                        username.trim()
                                    )
                                        .then(() => {
                                            setError("");
                                        })
                                        .catch((error: any) => {
                                            if (
                                                error.message.includes(
                                                    "auth/email-already-in-use"
                                                )
                                            ) {
                                                setShowEmailError(true);
                                                setError(
                                                    t`Email is already in use.`
                                                );
                                            } else if (
                                                error.message.includes(
                                                    "auth/network-request-failed"
                                                )
                                            )
                                                setError(
                                                    t`Network error. Please try again later.`
                                                );
                                            else
                                                setError(
                                                    t`Something went wrong.`
                                                );
                                        });
                                } else setShowPasswordError(true);
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
                            fullWidth
                            disabled={loading || googleLoading}
                            color={theme.colors.textOnPrimary}
                            fontSize={14}
                            bold
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

export default Register;
