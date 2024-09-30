import { t } from "@lingui/macro";
import React, { useContext, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Button from "../components/wrapers/button";
import Input from "../components/wrapers/input";
import StackPage from "../components/wrapers/stackPage";
import { ThemeContext } from "../context/theme";

const ContactUs = ({ navigation }: { navigation: any }) => {
    const { theme } = useContext(ThemeContext);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

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
                        lines={12}
                    />
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
                            onPress={() => {}}
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
