import {
    Entypo as EIcons,
    Feather as FIcons,
    MaterialCommunityIcons as MCIcons,
    MaterialIcons as MIcons,
} from "@expo/vector-icons";
import { t } from "@lingui/macro";
import Constants from "expo-constants";
import React, { useContext, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { RadioButton } from "react-native-paper";
import BottomSheetModal from "../components/wrapers/bottomSheetModal";
import Button from "../components/wrapers/button";
import Modal from "../components/wrapers/modal";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { AuthContext } from "../context/auth";
import { ConstantsContext } from "../context/constants";
import { LanguageContext } from "../context/language";
import { ThemeContext } from "../context/theme";
import { darkTheme, lightTheme } from "../utils/theme";

const Settings = ({ navigation }: { navigation: any }) => {
    const { theme, setTheme } = useContext(ThemeContext);
    const { language, setLanguage } = useContext(LanguageContext);
    const { lyricsSize, setLyricsSize } = useContext(ConstantsContext);
    const { user, logout, exitGuest } = useContext(AuthContext);

    const [settings, setSettings] = useState<
        "theme" | "language" | "zoom" | null
    >(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);

    return (
        <StackPage title={t`Settings`} navigation={navigation} noBottom>
            <ScrollView
                style={styles.scroll}
                top={10}
                bottom={10}
                showScroll={false}>
                <Text
                    fontSize={15}
                    color={theme.colors.textVariant}
                    style={{
                        marginBottom: 20,
                    }}>{t`General Settings`}</Text>

                <Button
                    mode="contained"
                    fullWidth
                    bold
                    backgroundColor={theme.colors.paper}
                    text={t`Theme`}
                    onPress={() => {
                        setSettings("theme"), setIsSettingsOpen(true);
                    }}
                    color={theme.colors.text}
                    center={false}
                    fontSize={15}
                    style={{ marginBottom: 10 }}
                    icon={
                        <EIcons
                            name="adjust"
                            size={26}
                            color={theme.colors.text}
                        />
                    }
                />
                <Button
                    mode="contained"
                    fullWidth
                    bold
                    backgroundColor={theme.colors.paper}
                    text={t`Language`}
                    onPress={() => {
                        setSettings("language"), setIsSettingsOpen(true);
                    }}
                    color={theme.colors.text}
                    center={false}
                    fontSize={15}
                    style={{ marginBottom: 10 }}
                    icon={
                        <EIcons
                            name="language"
                            size={26}
                            color={theme.colors.text}
                        />
                    }
                />
                <Button
                    mode="contained"
                    fullWidth
                    bold
                    backgroundColor={theme.colors.paper}
                    text={t`Zoom level`}
                    onPress={() => {
                        setSettings("zoom"), setIsSettingsOpen(true);
                    }}
                    color={theme.colors.text}
                    center={false}
                    fontSize={15}
                    style={{ marginBottom: 10 }}
                    icon={
                        <MCIcons
                            name="magnify"
                            size={26}
                            color={theme.colors.text}
                        />
                    }
                />

                <Text
                    fontSize={15}
                    color={theme.colors.textVariant}
                    style={styles.spacer}>{t`App`}</Text>

                <Button
                    mode="contained"
                    fullWidth
                    bold
                    backgroundColor={theme.colors.paper}
                    text={t`About Us`}
                    onPress={() => {}}
                    color={theme.colors.text}
                    center={false}
                    fontSize={15}
                    style={{ marginBottom: 10 }}
                    icon={
                        <FIcons
                            name="smile"
                            size={26}
                            color={theme.colors.text}
                        />
                    }
                />
                <Button
                    mode="contained"
                    fullWidth
                    bold
                    backgroundColor={theme.colors.paper}
                    text={t`Invite Friends`}
                    onPress={() => {}}
                    color={theme.colors.text}
                    center={false}
                    fontSize={15}
                    style={{ marginBottom: 10 }}
                    icon={
                        <FIcons
                            name="users"
                            size={26}
                            color={theme.colors.text}
                        />
                    }
                />

                <Text
                    fontSize={15}
                    color={theme.colors.textVariant}
                    style={styles.spacer}>{t`Get in Touch`}</Text>

                <Button
                    mode="contained"
                    fullWidth
                    bold
                    backgroundColor={theme.colors.paper}
                    text={t`Give us Feedback`}
                    onPress={() => {}}
                    color={theme.colors.text}
                    center={false}
                    fontSize={15}
                    style={{ marginBottom: 10 }}
                    icon={
                        <MIcons
                            name="chat-bubble-outline"
                            size={26}
                            color={theme.colors.text}
                        />
                    }
                />
                <Button
                    mode="contained"
                    fullWidth
                    bold
                    backgroundColor={theme.colors.paper}
                    text={t`Contact Us`}
                    onPress={() => {}}
                    color={theme.colors.text}
                    center={false}
                    fontSize={15}
                    style={{ marginBottom: 10 }}
                    icon={
                        <FIcons
                            name="send"
                            size={26}
                            color={theme.colors.text}
                        />
                    }
                />

                {user.isAnonymous ? (
                    <View>
                        <Button
                            mode="contained"
                            fullWidth
                            bold
                            backgroundColor={theme.colors.primary}
                            upper
                            text={t`Link Account`}
                            onPress={() => {
                                navigation.navigate("Link");
                            }}
                            color={theme.colors.textInverted}
                            fontSize={14}
                            style={{ marginBottom: 10, marginTop: 30 }}
                        />
                        <Button
                            mode="contained"
                            fullWidth
                            bold
                            backgroundColor={theme.colors.darkPaper}
                            upper
                            text={t`Exit Guest Mode`}
                            onPress={() => {
                                setIsExitModalOpen(true);
                            }}
                            color={theme.colors.text}
                            fontSize={14}
                            style={{ marginBottom: 10, marginTop: 10 }}
                        />
                    </View>
                ) : (
                    <Button
                        mode="contained"
                        fullWidth
                        bold
                        backgroundColor={theme.colors.darkPaper}
                        upper
                        text={t`Log Out`}
                        onPress={() => {
                            setIsLogoutModalOpen(true);
                        }}
                        color={theme.colors.text}
                        fontSize={14}
                        style={{ marginBottom: 10, marginTop: 30 }}
                    />
                )}

                <View style={styles.version}>
                    <Text color={theme.colors.textVariant}>{t`Version: `}</Text>
                    <View style={{ width: 10 }} />
                    <Text color={theme.colors.textVariant}>
                        {Constants.expoConfig?.version}
                    </Text>
                </View>
            </ScrollView>
            {settings && (
                <BottomSheetModal
                    isOpen={isSettingsOpen}
                    onClose={() => {
                        setIsSettingsOpen(false), setSettings(null);
                    }}
                    height={
                        settings === "theme"
                            ? 170
                            : settings === "language"
                            ? 150
                            : 300
                    }>
                    <View style={styles.bottomSheetContainer}>
                        {settings === "theme" ? (
                            <View style={styles.choices}>
                                <TouchableOpacity
                                    style={styles.choiceContainer}
                                    activeOpacity={1}
                                    onPress={() => setTheme(lightTheme)}>
                                    <View
                                        style={[
                                            styles.theme,
                                            {
                                                backgroundColor:
                                                    lightTheme.colors
                                                        .background,
                                            },
                                        ]}>
                                        <Text
                                            fontSize={30}
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
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.choiceContainer}
                                    activeOpacity={1}
                                    onPress={() => setTheme(darkTheme)}>
                                    <View
                                        style={[
                                            styles.theme,
                                            {
                                                backgroundColor:
                                                    darkTheme.colors.background,
                                            },
                                        ]}>
                                        <Text
                                            fontSize={30}
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
                                </TouchableOpacity>
                            </View>
                        ) : settings === "language" ? (
                            <View
                                style={[
                                    styles.choices,
                                    {
                                        marginTop: -5,
                                    },
                                ]}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.choiceContainer}
                                    onPress={() => setLanguage("en")}>
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
                                            language === "en"
                                                ? "checked"
                                                : "unchecked"
                                        }
                                        onPress={() => setLanguage("en")}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.choiceContainer}
                                    activeOpacity={1}
                                    onPress={() => setLanguage("ro")}>
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
                                            language === "ro"
                                                ? "checked"
                                                : "unchecked"
                                        }
                                        onPress={() => setLanguage("ro")}
                                    />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.zoomContainer}>
                                <View style={styles.topBar}>
                                    <TouchableOpacity
                                        activeOpacity={theme.activeOpacity}
                                        style={{ marginRight: 10 }}
                                        onPress={() => {
                                            if (lyricsSize < 21)
                                                setLyricsSize(lyricsSize + 1);
                                        }}>
                                        <MCIcons
                                            name={"plus-circle-outline"}
                                            size={30}
                                            color={theme.colors.text}
                                        />
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                        }}>
                                        <Text
                                            bold
                                            fontSize={17}
                                            style={{
                                                marginRight: 10,
                                            }}>
                                            {t`Zoom level: `}
                                        </Text>
                                        <Text bold fontSize={17}>
                                            {lyricsSize - 11}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        activeOpacity={theme.activeOpacity}
                                        onPress={() => {
                                            if (lyricsSize > 12)
                                                setLyricsSize(lyricsSize - 1);
                                        }}>
                                        <MCIcons
                                            name={"minus-circle-outline"}
                                            size={30}
                                            color={theme.colors.text}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.lyrics}>
                                    <Text
                                        fontSize={lyricsSize}
                                        color={theme.colors.text}
                                        style={{
                                            marginTop: 10,
                                        }}>
                                        {t`I took a step into the night,  
With dreams that glimmered in the light,  
A path unknown, a heart so bold,  
Seeking stories yet untold.`}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </BottomSheetModal>
            )}

            <Modal
                visible={isLogoutModalOpen}
                setVisible={setIsLogoutModalOpen}>
                <View>
                    <View
                        style={{
                            width: "100%",
                            alignItems: "center",
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                        }}>
                        <Text
                            fontSize={18}
                            color={theme.colors.textVariant}
                            center
                            style={{
                                width: 150,
                            }}>{t`Are you sure you want to leave?`}</Text>
                    </View>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 30,
                    }}>
                    <View style={{ width: "47%" }}>
                        <TouchableOpacity
                            onPress={() => {
                                setIsLogoutModalOpen(false);
                            }}
                            activeOpacity={theme.activeOpacity}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: theme.colors.darkPaper,
                                },
                            ]}>
                            <Text fontSize={14} bold upper center>
                                {t`Cancel`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: "47%" }}>
                        <TouchableOpacity
                            onPress={() => {
                                logout();
                            }}
                            activeOpacity={theme.activeOpacity}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: theme.colors.danger,
                                },
                            ]}>
                            <Text
                                fontSize={14}
                                bold
                                upper
                                center
                                color={theme.colors.white}>
                                {t`Log Out`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={isExitModalOpen} setVisible={setIsExitModalOpen}>
                <View>
                    <View
                        style={{
                            width: "100%",
                            alignItems: "center",
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                        }}>
                        <Text
                            fontSize={18}
                            color={theme.colors.textVariant}
                            center
                            style={{
                                width: 200,
                            }}>{t`Are you sure you want to exit guest mode?`}</Text>
                        <Text
                            fontSize={18}
                            color={theme.colors.textVariant}
                            center
                            style={{
                                width: 200,
                                marginTop: 5,
                            }}>{t`Your data will be lost.`}</Text>
                    </View>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 30,
                    }}>
                    <View style={{ width: "47%" }}>
                        <TouchableOpacity
                            onPress={() => {
                                setIsExitModalOpen(false);
                            }}
                            activeOpacity={theme.activeOpacity}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: theme.colors.darkPaper,
                                },
                            ]}>
                            <Text fontSize={14} bold upper center>
                                {t`Cancel`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: "47%" }}>
                        <TouchableOpacity
                            onPress={() => {
                                exitGuest();
                            }}
                            activeOpacity={theme.activeOpacity}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: theme.colors.danger,
                                },
                            ]}>
                            <Text
                                fontSize={14}
                                bold
                                upper
                                center
                                color={theme.colors.white}>
                                {t`Exit`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </StackPage>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginBottom: 20,
    },
    scroll: {
        paddingHorizontal: 20,
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
        marginBottom: 5,
        marginTop: 15,
    },
    buttonContainer: {
        marginTop: 30,
        marginBottom: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: -5,
        justifyContent: "space-between",
    },
    version: {
        marginTop: 20,
        marginBottom: 20,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    spacer: {
        marginBottom: 20,
        marginTop: 20,
    },
    bottomSheetContainer: {
        paddingHorizontal: 20,
        paddingTop: 5,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 12,
        justifyContent: "center",
    },
    topBar: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 15,
        width: "90%",
    },
    zoomContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    lyrics: {
        width: "90%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 160,
    },
});
