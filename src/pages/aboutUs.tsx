import { t } from "@lingui/macro";
import React, { useContext } from "react";
import { Linking, StyleSheet, View } from "react-native";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import AnimatedTouchable from "../components/wrapers/animatedTouchable";
import Button from "../components/wrapers/button";
import { ThemeContext } from "../context/theme";
import ScrollView from "../components/wrapers/scrollView";

const AboutUs = ({ navigation }: { navigation: any }) => {
    const { theme, themeType, systemTheme } = useContext(ThemeContext);

    return (
        <StackPage title={t`About Us`} navigation={navigation} noBottom variant>
            <View style={{ flex: 1, marginTop: -30, marginHorizontal: -20 }}>
                <ScrollView bottom={10} style={{ paddingHorizontal: 20 }}>
                    <View style={styles.section}>
                        <Text style={styles.text}>
                            {t`Welcome to Praise Up, a platform dedicated to exploring and celebrating music that glorifies God and uplifts the soul. Whether you're discovering new worship songs or organizing your favorite praise albums, our mission is to inspire, connect, and draw hearts closer to Him through the power of music.`}
                        </Text>

                        <Button
                            text={t`Visit our website`}
                            style={styles.button}
                            mode="contained"
                            bold
                            fullWidth
                            color={theme.colors.textOnPrimary}
                            onPress={() =>
                                Linking.openURL(
                                    "https://praiseup.alexbleotu.com"
                                )
                            }
                            icon={
                                <MCIcons
                                    name="web"
                                    size={24}
                                    color={theme.colors.textOnPrimary}
                                    style={styles.icon}
                                />
                            }
                        />
                    </View>
                    <View
                        style={[
                            styles.line,
                            {
                                backgroundColor:
                                    themeType === "light" ||
                                    (themeType === "system" &&
                                        systemTheme === "light")
                                        ? theme.colors.lightGrey
                                        : theme.colors.darkGrey,
                            },
                        ]}
                    />
                    <View style={styles.section}>
                        <Text style={styles.header}>
                            {t`I created PraiseUp to share a passion for christian music. Follow along for updates, new features, and more!`}
                        </Text>
                        <View
                            style={[
                                styles.iconContainer,
                                { backgroundColor: theme.colors.primary },
                            ]}>
                            <Text
                                style={styles.subHeader}
                                bold>{t`Follow me`}</Text>
                            <AnimatedTouchable
                                onPress={() =>
                                    Linking.openURL(
                                        "https://www.instagram.com/alex.bleotu/"
                                    )
                                }
                                style={styles.iconTouchable}>
                                <MCIcons
                                    name="instagram"
                                    size={30}
                                    color={theme.colors.textOnPrimary}
                                />
                            </AnimatedTouchable>
                            <AnimatedTouchable
                                onPress={() =>
                                    Linking.openURL("https://alexbleotu.com/")
                                }
                                style={styles.iconTouchable}>
                                <MCIcons
                                    name="web"
                                    size={30}
                                    color={theme.colors.textOnPrimary}
                                />
                            </AnimatedTouchable>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </StackPage>
    );
};

export default AboutUs;

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 10,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
    },
    subHeader: {
        fontSize: 18,
        color: "#666",
        marginRight: "auto",
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        color: "#333",
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
    },
    icon: {
        marginVertical: -1,
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 20,
        alignItems: "center",
        borderRadius: 12,
        padding: 10,
        paddingHorizontal: 20,
    },
    iconTouchable: {
        marginHorizontal: 10,
    },
    line: {
        width: "100%",
        height: 1,
        marginVertical: 30,
    },
});
