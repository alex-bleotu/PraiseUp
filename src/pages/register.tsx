import { t } from "@lingui/macro";
import { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
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
    const { register, loading }: any = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [emailValid, setEmailValid] = useState(true);

    const [showError, setShowError] = useState(false);
    const [error, setError] = useState("");

    if (loading) return <Loading />;

    return (
        <Background center>
            <View
                style={[
                    styles.background,
                    {
                        backgroundColor: theme.colors.paper,
                    },
                ]}>
                <Text fontSize={26} bold style={{ marginBottom: 20 }}>
                    {t`Register`}
                </Text>
                <View
                    style={{
                        width: 240,
                    }}>
                    {showError && !emailValid && (
                        <ErrorText text={t`Email is not valid.`} />
                    )}
                    {showError && password !== confirmPassword && (
                        <ErrorText text={t`Passwords don't match`} />
                    )}
                    {showError && password && password.length < 8 && (
                        <ErrorText text={t`Password is too short`} />
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
                        placeholder={t`First name`}
                        value={firstName}
                        onChange={setFirstName}
                        style={{ width: 120 }}
                        errorEmpty={showError && !firstName}
                        autoCapitalize
                        maxLength={15}
                    />
                    <Input
                        placeholder={t`Last name`}
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
                    placeholder={t`Email`}
                    value={email}
                    onChange={setEmail}
                    validate={validateEmail}
                    onValidateChange={setEmailValid}
                    style={{ marginTop: 10 }}
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

                <IconInput
                    icon="lock"
                    placeholder={t`Confirm Password`}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    style={{ marginVertical: 10 }}
                    hidden={true}
                    errorEmpty={showError && !confirmPassword}
                />

                <View
                    style={{
                        width: 250,
                    }}>
                    <Button
                        mode="contained"
                        text={t`Register`}
                        fullWidth
                        bold
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
                                register(email.trim(), password)
                                    .then(() => {
                                        setShowError(false);
                                    })
                                    .catch((error: any) => {
                                        if (
                                            error.message.includes(
                                                "auth/email-already-in-use"
                                            )
                                        )
                                            setError(t`Email already in use.`);
                                        else if (error.message === undefined)
                                            setError(t`Something went wrong.`);
                                        else setError(error.message);
                                        setShowError(true);
                                    });
                            } else setShowError(true);
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
                    <Text>{t`Already have an account?`}</Text>
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
                            {t`Log in`}
                        </Text>
                    </TouchableOpacity>
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
