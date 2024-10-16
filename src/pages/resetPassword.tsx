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
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { AuthContext } from "../context/auth";
import { ThemeContext } from "../context/theme";

const ResetPassword = ({ navigation }: { navigation: any }) => {
    const { updatePassword } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    const [loading, setLoading] = useState<boolean>(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState<boolean>(false);

    const [error, setError] = useState<string>("");

    useEffect(() => {
        setError("");
    }, [oldPassword]);

    useEffect(() => {
        setNewPasswordError(false);
    }, [newPassword]);

    useEffect(() => {
        if (error === "The password has been changed successfully.") {
            setTimeout(() => {
                setError("");
            }, 5000);
        } else if (error.includes("temporarily disabled")) {
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    }, [error]);

    return (
        <StackPage
            title={t`Reset your password`}
            navigation={navigation}
            variant
            noBottom
            description={t`Type in the old password and the new password you want to use.`}>
            <View style={styles.container}>
                <View style={styles.top}>
                    <IconInput
                        icon="lock"
                        placeholder={t`Old Password`}
                        value={oldPassword}
                        onChange={setOldPassword}
                        hidden={true}
                        error={
                            error.length > 0 &&
                            !error.includes("successfully") &&
                            !error.includes("temporarily disabled")
                        }
                        errorText={""}
                    />
                    <IconInput
                        icon="lock"
                        placeholder={t`New Password`}
                        value={newPassword}
                        onChange={setNewPassword}
                        hidden={true}
                        error={newPasswordError}
                        errorText={t`Password is too short.`}
                        style={{
                            marginTop: 10,
                        }}
                    />

                    {error.length > 0 && (
                        <View style={styles.error}>
                            <Text
                                color={
                                    error.includes("successfully")
                                        ? theme.colors.success
                                        : theme.colors.danger
                                }
                                fontSize={14}>
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
                            text={t`Reset your password`}
                            upper
                            fullWidth
                            fontSize={14}
                            bold
                            color={theme.colors.textOnPrimary}
                            disabled={!oldPassword || !newPassword || loading}
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
                                setError("");
                                setNewPasswordError(false);
                                setLoading(true);

                                if (loading) return;

                                if (newPassword.length < 6) {
                                    setNewPasswordError(true);
                                    return;
                                } else {
                                    updatePassword(oldPassword, newPassword)
                                        .then(() => {
                                            setError(
                                                t`The password has been changed successfully.`
                                            );
                                            setLoading(false);
                                        })
                                        .catch((error: any) => {
                                            if (
                                                error.message.includes(
                                                    "auth/invalid-credential"
                                                )
                                            )
                                                setError(
                                                    t`The password you entered is incorrect.`
                                                );
                                            else if (
                                                error.message.includes(
                                                    "Access to this account has been temporarily disabled"
                                                )
                                            )
                                                setError(
                                                    t`Access to this account has been temporarily disabled due to many failed attempts. Please try again later.`
                                                );
                                            else
                                                setError(
                                                    t`Something went wrong.`
                                                );
                                            setLoading(false);
                                        });
                                }
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

export default ResetPassword;
