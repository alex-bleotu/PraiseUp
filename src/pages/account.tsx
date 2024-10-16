import { t } from "@lingui/macro";
import React, { useContext, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Button from "../components/wrapers/button";
import IconInput from "../components/wrapers/iconInput";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { ServerContext } from "../context/server";
import { ThemeContext } from "../context/theme";
import { UserContext } from "../context/user";
import { validateEmail } from "../utils/util";

const Account = ({ navigation }: { navigation: any }) => {
    const { theme } = useContext(ThemeContext);
    const { user } = useContext(UserContext);
    const { updateUser } = useContext(ServerContext);

    const [loading, setLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>(user.displayName);
    const [email, setEmail] = useState<string>(user.email);
    const [error, setError] = useState<string>("");

    return (
        <StackPage
            title={t`Account details`}
            navigation={navigation}
            variant
            noBottom
            description={t`Update your account details here.`}>
            <View style={styles.container}>
                <View style={styles.top}>
                    <IconInput
                        icon="email"
                        placeholder={t`Email`}
                        value={email}
                        onChange={setEmail}
                        editable={false}
                        // validate={validateEmail}
                        // error={error.includes("email")}
                        // keyboardType={"email-address"}
                    />

                    <View
                        style={{
                            width: "100%",
                            marginTop: 30,
                        }}>
                        <Text
                            fontSize={18}
                            color={
                                theme.colors.textVariant
                            }>{t`Editable:`}</Text>
                    </View>
                    <IconInput
                        icon="account"
                        placeholder={t`Username`}
                        value={username}
                        onChange={setUsername}
                        error={error.includes("Username")}
                        style={{ marginTop: 10 }}
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
                </View>

                <View style={styles.bottom}>
                    <View
                        style={{
                            width: "100%",
                        }}>
                        <Button
                            mode="contained"
                            text={t`Update details`}
                            upper
                            fullWidth
                            fontSize={14}
                            bold
                            disabled={loading || !username || !email}
                            color={theme.colors.textOnPrimary}
                            style={{
                                marginTop: 10,
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
                                setLoading(true);
                                setError("");

                                if (!validateEmail(email)) {
                                    setError(t`Invalid email address!`);
                                    setLoading(false);
                                    return;
                                }
                                if (username.length < 4) {
                                    setError(t`Username is too short!`);
                                    setLoading(false);
                                    return;
                                }

                                updateUser(username)
                                    .then(() => {
                                        // if (user.email !== email) {
                                        //     setError(
                                        //         t`Please check your email to verify your email address first.`
                                        //     );
                                        // } else
                                        //     setError(
                                        //         t`Account details updated successfully!`
                                        //     );
                                        setError(
                                            t`Account details updated successfully!`
                                        );
                                        setLoading(false);
                                    })
                                    .catch((error: any) => {
                                        setError(t`Something went wrong.`);
                                        setLoading(false);
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

export default Account;
