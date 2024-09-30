import { t } from "@lingui/macro";
import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { ThemeContext } from "../context/theme";

const ContactUs = ({ navigation }: { navigation: any }) => {
    const { theme } = useContext(ThemeContext);

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
                            }>{t`Create an account to save your progress and access your data on multiple devices.`}</Text>
                    </View>
                </View>
            </View>
        </StackPage>
    );
};

export default ContactUs;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
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
});
