import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import { t } from "@lingui/macro";
import Constants from "expo-constants";
import React, { useContext } from "react";
import { Image, StyleSheet, View } from "react-native";
import { RadioButton } from "react-native-paper";
import Button from "../components/wrapers/button";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { LanguageContext } from "../context/language";
import { ThemeContext } from "../context/theme";
import { darkTheme, lightTheme } from "../utils/theme";

const Settings = ({ navigation }: { navigation: any }) => {
    const { theme, setTheme } = useContext(ThemeContext);
    const { language, setLanguage } = useContext(LanguageContext);

    return (
        <StackPage title={t`Settings`} navigation={navigation}>
            <View
                style={[
                    styles.container,
                    { backgroundColor: theme.colors.paper },
                ]}>
                <ScrollView style={styles.scroll}>
                    <Text
                        size={16}
                        color={theme.colors.grey}
                        style={{
                            marginBottom: 20,
                        }}>{t`Display settings`}</Text>

                    <View style={styles.text}>
                        <MCIcons
                            name="white-balance-sunny"
                            size={24}
                            color={theme.colors.text}
                            style={{ marginRight: 10, marginTop: 3 }}
                        />
                        <Text size={18} bold>{t`Theme`}</Text>
                    </View>

                    <View style={styles.choices}>
                        <View style={styles.choiceContainer}>
                            <View
                                style={[
                                    styles.theme,
                                    {
                                        backgroundColor:
                                            lightTheme.colors.primaryVariant,
                                    },
                                ]}>
                                <Text
                                    size={30}
                                    bold
                                    color={lightTheme.colors.primary}
                                    style={{ marginTop: -5 }}>
                                    A
                                </Text>
                            </View>
                            <RadioButton
                                value="light"
                                color={theme.colors.primary}
                                uncheckedColor={theme.colors.grey}
                                status={
                                    theme === lightTheme
                                        ? "checked"
                                        : "unchecked"
                                }
                                onPress={() => setTheme(lightTheme)}
                            />
                        </View>
                        <View style={styles.choiceContainer}>
                            <View
                                style={[
                                    styles.theme,
                                    {
                                        backgroundColor:
                                            darkTheme.colors.primaryVariant,
                                    },
                                ]}>
                                <Text
                                    size={30}
                                    bold
                                    color={darkTheme.colors.primary}
                                    style={{ marginTop: -5 }}>
                                    A
                                </Text>
                            </View>
                            <RadioButton
                                value="dark"
                                color={theme.colors.primary}
                                uncheckedColor={theme.colors.grey}
                                status={
                                    theme === darkTheme
                                        ? "checked"
                                        : "unchecked"
                                }
                                onPress={() => setTheme(darkTheme)}
                            />
                        </View>
                    </View>

                    <View style={styles.text}>
                        <MCIcons
                            name="comment-text"
                            size={24}
                            color={theme.colors.text}
                            style={{ marginRight: 10, marginTop: 3 }}
                        />
                        <Text size={18} bold>{t`Language`}</Text>
                    </View>

                    <View style={styles.choices}>
                        <View style={styles.choiceContainer}>
                            <View>
                                <Image
                                    source={require("../../assets/flags/en.png")}
                                    style={styles.image}
                                />
                            </View>
                            <RadioButton
                                value="english"
                                color={theme.colors.primary}
                                uncheckedColor={theme.colors.grey}
                                status={
                                    language === "en" ? "checked" : "unchecked"
                                }
                                onPress={() => setLanguage("en")}
                            />
                        </View>
                        <View style={styles.choiceContainer}>
                            <View>
                                <Image
                                    source={require("../../assets/flags/ro.png")}
                                    style={styles.image}
                                />
                            </View>
                            <RadioButton
                                value="romanian"
                                color={theme.colors.primary}
                                uncheckedColor={theme.colors.grey}
                                status={
                                    language === "ro" ? "checked" : "unchecked"
                                }
                                onPress={() => setLanguage("ro")}
                            />
                        </View>
                    </View>

                    <Text
                        size={16}
                        color={theme.colors.grey}
                        style={{
                            marginBottom: 20,
                            marginTop: 10,
                        }}>{t`Other info`}</Text>

                    <View style={styles.text}>
                        <Text size={18} bold>
                            {t`Version`}
                        </Text>
                        <Text size={18} style={{ marginHorizontal: 20 }} bold>
                            -
                        </Text>
                        <Text size={18}>{Constants.expoConfig?.version}</Text>
                    </View>
                    <View style={styles.text}>
                        <Text size={18} bold>
                            {t`Creator`}
                        </Text>
                        <Text size={18} style={{ marginHorizontal: 20 }} bold>
                            -
                        </Text>
                        <Text size={18}>Bleotu Alex</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            mode="contained"
                            text={t`Report`}
                            icon={
                                <MCIcons
                                    name="bug"
                                    size={20}
                                    color={theme.colors.text}
                                />
                            }
                        />
                        <Button
                            mode="contained"
                            text={t`Help`}
                            icon={
                                <MCIcons
                                    name="help"
                                    size={20}
                                    color={theme.colors.text}
                                />
                            }
                        />
                    </View>
                </ScrollView>
            </View>
        </StackPage>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
        paddingVertical: 20,
        borderRadius: 30,
    },
    scroll: {
        paddingHorizontal: 30,
    },
    text: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    theme: {
        width: 60,
        height: 60,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 5,
    },
    choices: {
        flexDirection: "row",
        marginBottom: 20,
    },
    choiceContainer: {
        alignItems: "center",
        marginRight: 15,
    },
    image: {
        width: 60,
        height: 40,
        borderRadius: 10,
        marginVertical: 5,
    },
    buttonContainer: {
        marginTop: 30,
        marginBottom: 5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: -5,
    },
});
