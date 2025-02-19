import { t } from "@lingui/macro";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Button from "../components/wrapers/button";
import IconInput from "../components/wrapers/iconInput";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { AuthContext } from "../context/auth";
import { LoadingContext } from "../context/loading";
import { ThemeContext } from "../context/theme";
import { validateEmail } from "../utils/util";

const ForgotPassword = ({ navigation }: { navigation: any }) => {
    const { loading } = useContext(LoadingContext);
    const { sendPasswordResetEmail } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(true);

    const [error, setError] = useState<string>("");
    const [errorState, setErrorState] = useState<"success" | "error" | null>(
        null
    );

    useEffect(() => {
        setError("");
    }, [email]);

    useEffect(() => {
        if (error === "Password reset email sent successfully.") {
            setTimeout(() => {
                setError("");
                navigation.navigate("Login", {
                    email,
                });
            }, 5000);
        }
    }, [error]);

    return (
        <StackPage
            title={t`Reset your password`}
            navigation={navigation}
            variant
            description={t`Type in the email you used to create your account.`}
            noBottom>
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
                        error={error.length > 0 && errorState === "error"}
                    />

                    {error.length > 0 && (
                        <View style={styles.error}>
                            <Text
                                color={
                                    errorState === "success"
                                        ? theme.colors.success
                                        : theme.colors.danger
                                }
                                fontSize={14}>
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
                            text={t`Send reset email`}
                            upper
                            fullWidth
                            fontSize={14}
                            bold
                            color={theme.colors.textOnPrimary}
                            disabled={!email || !emailValid}
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

                                setError("");
                                setErrorState(null);

                                sendPasswordResetEmail(email)
                                    .then(() => {
                                        setError(
                                            "Password reset email sent successfully."
                                        );
                                        setErrorState("success");
                                    })
                                    .catch((error: any) => {
                                        setError(t`Something went wrong.`);
                                        setErrorState("error");
                                    });
                            }}
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
    },
    error: {
        alignSelf: "flex-start",
        marginTop: 5,
        marginLeft: 15,
    },
});

export default ForgotPassword;
