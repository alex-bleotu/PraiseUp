import { t } from "@lingui/macro";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Button from "../components/wrapers/button";
import ErrorText from "../components/wrapers/errorText";
import IconButton from "../components/wrapers/iconButton";
import IconInput from "../components/wrapers/iconInput";
import StackPage from "../components/wrapers/stackPage";
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
        if (!registered && route.params?.registered) {
            setRegistered(true);
        }
    }, [route.params?.registered]);

    if (loading) return <Loading />;

    return (
        <StackPage title={""} navigation={navigation} noBottom>
            <View style={styles.container}>
                <View style={styles.top}>
                    <View
                        style={{
                            alignSelf: "flex-start",
                            marginTop: 10,
                            marginBottom: 20,
                        }}>
                        <Text bold fontSize={30}>{t`Sign In`}</Text>
                    </View>
                    <View
                        style={{
                            alignSelf: "flex-start",
                            marginBottom: 20,
                        }}>
                        <Text
                            fontSize={18}
                            color={
                                theme.colors.textVariant
                            }>{t`Type in the email and password you used to create your account.`}</Text>
                    </View>
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

                    <View
                        style={{
                            marginLeft: "auto",
                        }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.textContainer}>
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
                            fullWidth
                            fontSize={14}
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
                        <IconButton
                            src={require("../../assets/images/auth/google.png")}
                            bgcolor={theme.colors.white}
                            color={"black"}
                            text={t`Continue with Google`}
                        />
                    </View>
                    <View style={{ width: "100%" }}>
                        <IconButton
                            src={require("../../assets/images/auth/facebook.png")}
                            bgcolor={theme.colors.blue}
                            color={"white"}
                            text={t`Continue with Facebook`}
                            style={{ marginTop: 15 }}
                        />
                    </View>
                </View>
            </View>
        </StackPage>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
        marginTop: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginBottom: 20,
    },
});

export default Login;
