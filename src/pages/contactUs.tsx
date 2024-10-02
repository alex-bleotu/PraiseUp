import { EmailJSResponseStatus, send } from "@emailjs/react-native";
import { t } from "@lingui/macro";
import React, { useContext, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Button from "../components/wrapers/button";
import Input from "../components/wrapers/input";
import Message from "../components/wrapers/message";
import StackPage from "../components/wrapers/stackPage";
import { ThemeContext } from "../context/theme";
import { UserContext } from "../context/user";

const ContactUs = ({ navigation }: { navigation: any }) => {
    const { theme } = useContext(ThemeContext);
    const { user } = useContext(UserContext);

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [state, setState] = useState<"success" | "error">("error");
    const [show, setShow] = useState<boolean>(false);

    const sendEmail = () => {
        setLoading(true);

        const templateParams = {
            user_name: user.displayName,
            user_email: user.email,
            message: message,
        };

        send("service_aguv79r", "template_hfpki5l", templateParams, {
            publicKey: "X7eJatn7kvJUL5CWU",
        }).then(
            (response: EmailJSResponseStatus) => {
                setLoading(false);
                setState("success");
                setMessage("");
                setShow(true);
            },
            (error: any) => {
                console.log(error);
                setLoading(false);
                setState("error");
                setShow(true);
            }
        );
    };

    return (
        <StackPage
            title={t`Contact Us`}
            navigation={navigation}
            noBottom
            variant
            description={t`If you have any questions or problems with the app or its content, please contact us.`}>
            <View style={styles.container}>
                <View style={styles.top}>
                    <Input
                        placeholder={t`Message`}
                        value={message}
                        onChange={setMessage}
                        multiline
                        lines={15}
                    />
                    <View style={{ marginTop: 15 }} />
                    {show && (
                        <Message
                            variant={"success"}
                            message={
                                state === "success"
                                    ? t`Message sent successfully!`
                                    : t`Message failed to send!`
                            }
                            setShow={setShow}
                        />
                    )}
                </View>

                <View style={styles.bottom}>
                    <View
                        style={{
                            width: "100%",
                        }}>
                        <Button
                            mode="contained"
                            text={t`Send the message`}
                            disabled={loading || !message}
                            upper
                            color={theme.colors.textOnPrimary}
                            fullWidth
                            fontSize={14}
                            bold
                            style={{
                                paddingVertical: loading ? 13 : 14.5,
                                marginTop: 15,
                            }}
                            onPress={sendEmail}
                            icon={
                                loading && (
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

export default ContactUs;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
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
});
