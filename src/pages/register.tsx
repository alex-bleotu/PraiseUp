import { t } from "@lingui/macro";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "../components/wrapers/button";
import IconButton from "../components/wrapers/iconButton";
import IconInput from "../components/wrapers/iconInput";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { AuthContext } from "../context/auth";
import { ThemeContext } from "../context/theme";
import { validateEmail } from "../utils/util";
import Loading from "./loading";

const Register = ({ navigation }: { navigation: any }) => {
    const { register, loading }: any = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailValid, setEmailValid] = useState(true);

    const [showEmailError, setShowEmailError] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setShowPasswordError(false);
    }, [password]);

    useEffect(() => {
        setShowEmailError(false);
    }, [email]);

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
                        <Text bold fontSize={30}>{t`Join Us`}</Text>
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
                            }>{t`Lorem Ipsum is simply dummy text of the printing and typesetting industry.`}</Text>
                    </View>
                    <IconInput
                        icon="account"
                        placeholder={t`Your Name`}
                        value={username}
                        onChange={setUsername}
                        style={{ marginTop: 10 }}
                        autoCapitalize
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
                        errorText={t`Password is too short`}
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
                        }}>
                        <Button
                            mode="contained"
                            text={t`Join App`}
                            upper
                            fullWidth
                            fontSize={14}
                            bold
                            disabled={!email || !password || !emailValid}
                            onPress={() => {
                                setError("");
                                if (password.length > 5) {
                                    register(email.trim(), password)
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
                                                    t`Email is already in use`
                                                );
                                            } else
                                                setError(
                                                    t`Something went wrong`
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
    textContainer: {
        marginHorizontal: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    container: {
        paddingHorizontal: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
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
        marginBottom: 15,
    },
    error: {
        alignSelf: "flex-start",
        marginTop: 5,
        marginLeft: 15,
    },
});

export default Register;
