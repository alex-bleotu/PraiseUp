import {
    Entypo as EIcons,
    FontAwesome6 as FAIcons,
    Feather as FIcons,
    MaterialCommunityIcons as MCIcons,
    MaterialIcons as MIcons,
} from "@expo/vector-icons";
import { t } from "@lingui/macro";
import Constants from "expo-constants";
import React, { useContext, useEffect, useState } from "react";
import { Image, Share, StyleSheet, TouchableOpacity, View } from "react-native";
import {
    ActivityIndicator,
    RadioButton,
    Switch,
    ToggleButton,
} from "react-native-paper";
import BottomSheetModal from "../components/wrapers/bottomSheetModal";
import Button from "../components/wrapers/button";
import Input from "../components/wrapers/input";
import Modal from "../components/wrapers/modal";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { AuthContext } from "../context/auth";
import { ConstantsContext } from "../context/constants";
import { DataContext } from "../context/data";
import { LanguageContext } from "../context/language";
import { RecentContext } from "../context/recent";
import { ThemeContext } from "../context/theme";
import { UserContext } from "../context/user";
import { darkTheme, lightTheme } from "../utils/theme";
import { renderLyrics } from "./song";

const Settings = ({ navigation }: { navigation: any }) => {
    const { theme, setThemeType, themeType, getSystemTheme } =
        useContext(ThemeContext);
    const { language, setLanguage } = useContext(LanguageContext);
    const {
        lyricsSize,
        setLyricsSize,
        chords,
        setChords,
        showSections,
        setShowSections,
        allowRepetition,
        setAllowRepetition,
    } = useContext(ConstantsContext);
    const { user } = useContext(UserContext);
    const { logout, exitGuest, deleteAccount, deleteGoogleAccount } =
        useContext(AuthContext);
    const { reloadAllData } = useContext(DataContext);
    const { fullyUpdateRecent } = useContext(RecentContext);

    const [settings, setSettings] = useState<
        | "theme"
        | "language"
        | "zoom"
        | "chords"
        | "sections"
        | "repetition"
        | null
    >(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isReloadModalOpen, setIsReloadModalOpen] = useState(false);
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [reloadLoading, setReloadLoading] = useState<boolean>(false);
    const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [exitLoading, setExitLoading] = useState<boolean>(false);

    const lyricToRender = t`glo[F#m][E]ri[D]fy`;

    useEffect(() => {
        setError("");
        setPasswordError(false);
    }, [password]);

    useEffect(() => {
        if (error.includes("temporarily disabled")) {
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    }, [error]);

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
                    fontSize={16}
                    style={{ marginBottom: 10 }}
                    icon={
                        <MCIcons
                            name="magnify"
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
                    text={t`Chords`}
                    onPress={() => {
                        setSettings("chords"), setIsSettingsOpen(true);
                    }}
                    color={theme.colors.text}
                    center={false}
                    fontSize={15}
                    style={{ marginBottom: 10 }}
                    icon={
                        <FAIcons
                            name="itunes-note"
                            size={25}
                            color={theme.colors.text}
                        />
                    }
                />
                <Button
                    mode="contained"
                    fullWidth
                    bold
                    backgroundColor={theme.colors.paper}
                    text={t`Show labels`}
                    onPress={() => {
                        setSettings("sections"), setIsSettingsOpen(true);
                    }}
                    color={theme.colors.text}
                    center={false}
                    fontSize={15}
                    style={{ marginBottom: 10 }}
                    icon={
                        <MCIcons
                            name="subtitles-outline"
                            size={28}
                            color={theme.colors.text}
                            style={{ margin: -2 }}
                        />
                    }
                />
                <Button
                    mode="contained"
                    fullWidth
                    bold
                    backgroundColor={theme.colors.paper}
                    text={t`Allow repetitions`}
                    onPress={() => {
                        setSettings("repetition"), setIsSettingsOpen(true);
                    }}
                    color={theme.colors.text}
                    center={false}
                    fontSize={15}
                    style={{ marginBottom: 10 }}
                    icon={
                        <FAIcons
                            name="repeat"
                            size={22}
                            color={theme.colors.text}
                        />
                    }
                />
                <Button
                    mode="contained"
                    fullWidth
                    bold
                    backgroundColor={theme.colors.paper}
                    text={t`Reload all data`}
                    onPress={() => {
                        setIsReloadModalOpen(true);
                    }}
                    color={theme.colors.text}
                    center={false}
                    fontSize={15}
                    style={{ marginBottom: 10 }}
                    icon={
                        <MCIcons
                            name="delete-empty-outline"
                            size={32}
                            color={theme.colors.text}
                            style={{ marginVertical: -4 }}
                        />
                    }
                />
                {!user.isAnonymous && (
                    <>
                        <Text
                            fontSize={15}
                            color={theme.colors.textVariant}
                            style={styles.spacer}>{t`Account`}</Text>
                        <Button
                            mode="contained"
                            fullWidth
                            bold
                            backgroundColor={theme.colors.paper}
                            text={t`Account details`}
                            onPress={async () => {
                                navigation.navigate("Account");
                            }}
                            color={theme.colors.text}
                            center={false}
                            fontSize={15}
                            style={{ marginBottom: 10 }}
                            icon={
                                <FIcons
                                    name="user"
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
                            text={t`Reset your password`}
                            onPress={() => {
                                navigation.navigate("ResetPassword");
                            }}
                            color={theme.colors.text}
                            center={false}
                            fontSize={15}
                            style={{ marginBottom: 10 }}
                            icon={
                                <MIcons
                                    name="password"
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
                            text={t`Invite friends`}
                            onPress={async () => {
                                const url = "https://praiseup.alexbleotu.com";

                                await Share.share({
                                    message: `${
                                        t`Check this out on PraiseUp!` + "\n"
                                    }${url}`,
                                });
                            }}
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
                    </>
                )}

                <Text
                    fontSize={15}
                    color={theme.colors.textVariant}
                    style={styles.spacer}>{t`Get in Touch`}</Text>
                <Button
                    mode="contained"
                    fullWidth
                    bold
                    backgroundColor={theme.colors.paper}
                    text={t`About Us`}
                    onPress={() => {
                        navigation.navigate("AboutUs");
                    }}
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
                {/* <Button
                    mode="contained"
                    fullWidth
                    bold
                    backgroundColor={theme.colors.paper}
                    text={t`Rate Us`}
                    onPress={() => {
                        // open link to rating
                    }}
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
                /> */}
                <Button
                    mode="contained"
                    fullWidth
                    bold
                    backgroundColor={theme.colors.paper}
                    text={t`Contact Us`}
                    onPress={() => {
                        navigation.navigate("ContactUs");
                    }}
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
                            color={theme.colors.textOnPrimary}
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
                    <View>
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
                        <Button
                            mode="contained"
                            fullWidth
                            bold
                            backgroundColor={theme.colors.darkPaper}
                            upper
                            text={t`Delete Account`}
                            onPress={() => {
                                setIsDeleteModalOpen(true);
                            }}
                            color={theme.colors.text}
                            fontSize={14}
                            style={{ marginBottom: 10, marginTop: 10 }}
                        />
                    </View>
                )}
                <View style={styles.version}>
                    <Text color={theme.colors.textVariant}>{t`Version: `}</Text>
                    <View style={{ width: 10 }} />
                    <Text color={theme.colors.textVariant}>
                        {Constants.expoConfig?.version}
                    </Text>
                </View>
            </ScrollView>
            <BottomSheetModal
                isOpen={isSettingsOpen}
                onClose={() => {
                    setIsSettingsOpen(false), setSettings(null);
                }}>
                <View style={styles.bottomSheetContainer}>
                    {settings === "theme" ? (
                        <View style={styles.choices}>
                            <TouchableOpacity
                                style={styles.choiceContainer}
                                activeOpacity={1}
                                onPress={() => setThemeType("system")}>
                                <View
                                    style={[
                                        styles.theme,
                                        {
                                            backgroundColor:
                                                getSystemTheme().colors
                                                    .background,
                                        },
                                    ]}>
                                    <Text
                                        fontSize={30}
                                        bold
                                        color={getSystemTheme().colors.primary}
                                        style={{ marginTop: -2 }}>
                                        S
                                    </Text>
                                </View>
                                <Text>{t`System`}</Text>
                                <RadioButton
                                    value="system"
                                    color={theme.colors.primary}
                                    uncheckedColor={theme.colors.grey}
                                    status={
                                        themeType === "system"
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    onPress={() => setThemeType("system")}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.choiceContainer}
                                activeOpacity={1}
                                onPress={() => setThemeType("light")}>
                                <View
                                    style={[
                                        styles.theme,
                                        {
                                            backgroundColor:
                                                lightTheme.colors.background,
                                        },
                                    ]}>
                                    <Text
                                        fontSize={30}
                                        bold
                                        color={lightTheme.colors.primary}
                                        style={{ marginTop: -2 }}>
                                        A
                                    </Text>
                                </View>
                                <Text>{t`Light`}</Text>
                                <RadioButton
                                    value="light"
                                    color={theme.colors.primary}
                                    uncheckedColor={theme.colors.grey}
                                    status={
                                        themeType === "light"
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    onPress={() => setThemeType("light")}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.choiceContainer}
                                activeOpacity={1}
                                onPress={() => setThemeType("dark")}>
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
                                        style={{ marginTop: -2 }}>
                                        A
                                    </Text>
                                </View>
                                <Text>{t`Dark`}</Text>
                                <RadioButton
                                    value="dark"
                                    color={theme.colors.primary}
                                    uncheckedColor={theme.colors.grey}
                                    status={
                                        themeType === "dark"
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    onPress={() => setThemeType("dark")}
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
                                <View
                                    style={{
                                        marginVertical: 5,
                                        alignItems: "center",
                                    }}>
                                    <Text>{"English"}</Text>
                                    <Text>{t`(English)`}</Text>
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
                                <View
                                    style={{
                                        marginVertical: 5,
                                        alignItems: "center",
                                    }}>
                                    <Text>{"Română"}</Text>
                                    <Text>{t`(Romanian)`}</Text>
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
                    ) : settings === "zoom" ? (
                        <View style={styles.zoomContainer}>
                            <View style={styles.topBar}>
                                <TouchableOpacity
                                    activeOpacity={theme.activeOpacity}
                                    onPress={() => {
                                        if (lyricsSize > 13)
                                            setLyricsSize(lyricsSize - 1);
                                    }}>
                                    <MCIcons
                                        name={"minus-circle-outline"}
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
                                        fontSize={18}
                                        style={{
                                            marginRight: 10,
                                        }}>
                                        {t`Zoom Level: `}
                                    </Text>
                                    <Text bold fontSize={17}>
                                        {lyricsSize - 12}
                                    </Text>
                                    {lyricsSize - 12 === 4 && (
                                        <Text
                                            bold
                                            fontSize={17}
                                            style={{
                                                marginLeft: 5,
                                            }}>
                                            {t`(normal)`}
                                        </Text>
                                    )}
                                </View>
                                <TouchableOpacity
                                    activeOpacity={theme.activeOpacity}
                                    style={{ marginLeft: 10 }}
                                    onPress={() => {
                                        if (lyricsSize < 22)
                                            setLyricsSize(lyricsSize + 1);
                                    }}>
                                    <MCIcons
                                        name={"plus-circle-outline"}
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
                    ) : settings === "chords" ? (
                        <View style={styles.choices2}>
                            <TouchableOpacity
                                style={styles.choiceContainer2}
                                activeOpacity={1}
                                onPress={() => {
                                    setChords("combined");
                                }}>
                                <View
                                    style={{
                                        marginRight: "auto",
                                    }}>
                                    {renderLyrics(
                                        lyricToRender,
                                        true,
                                        theme,
                                        16,
                                        0,
                                        "combined"
                                    )}
                                </View>
                                <RadioButton
                                    value="chords"
                                    color={theme.colors.primary}
                                    uncheckedColor={theme.colors.grey}
                                    status={
                                        chords === "combined"
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    onPress={() => {
                                        setChords("combined");
                                    }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.choiceContainer2,
                                    { marginVertical: 10 },
                                ]}
                                activeOpacity={1}
                                onPress={() => {
                                    setChords("separated");
                                }}>
                                <View
                                    style={{
                                        marginRight: "auto",
                                    }}>
                                    {renderLyrics(
                                        lyricToRender,
                                        true,
                                        theme,
                                        16,
                                        0,
                                        "separated"
                                    )}
                                </View>
                                <RadioButton
                                    value="chords"
                                    color={theme.colors.primary}
                                    uncheckedColor={theme.colors.grey}
                                    status={
                                        chords === "separated"
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    onPress={() => {
                                        setChords("separated");
                                    }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.choiceContainer2}
                                activeOpacity={1}
                                onPress={() => {
                                    setChords("split");
                                }}>
                                <View
                                    style={{
                                        marginRight: "auto",
                                    }}>
                                    {renderLyrics(
                                        lyricToRender,
                                        true,
                                        theme,
                                        16,
                                        0,
                                        "split"
                                    )}
                                </View>
                                <RadioButton
                                    value="chords"
                                    color={theme.colors.primary}
                                    uncheckedColor={theme.colors.grey}
                                    status={
                                        chords === "split"
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    onPress={() => {
                                        setChords("split");
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : settings === "sections" ? (
                        <View
                            style={{
                                marginHorizontal: 10,
                            }}>
                            <Text
                                style={
                                    styles.sectionText
                                }>{t`Show labels for sections of the song as "Verse", "Chorus", "Bridge" etc.`}</Text>
                            <View style={styles.sections}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.section}
                                    onPress={() => setShowSections(true)}>
                                    <View>
                                        <Text
                                            style={{
                                                marginBottom: 5,
                                            }}
                                            fontSize={18}
                                            bold
                                            color={theme.colors.grey}>
                                            {t`Verse`}
                                        </Text>
                                        <Text
                                            fontSize={16}
                                            color={theme.colors.text}
                                            style={{}}>
                                            {t`A step at night,
Dreams so bright.
A heart so bold,
Chasing gold.`}
                                        </Text>
                                    </View>
                                    <View style={styles.radioButton}>
                                        <RadioButton
                                            value="showSections"
                                            color={theme.colors.primary}
                                            uncheckedColor={theme.colors.grey}
                                            status={
                                                showSections
                                                    ? "checked"
                                                    : "unchecked"
                                            }
                                            onPress={() => {
                                                setShowSections(true);
                                            }}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.section}
                                    onPress={() => setShowSections(false)}>
                                    <View>
                                        <Text
                                            style={{
                                                marginBottom: 5,
                                            }}
                                            fontSize={18}
                                            bold
                                            color={theme.colors.grey}>
                                            {" "}
                                        </Text>
                                        <Text
                                            fontSize={16}
                                            color={theme.colors.text}
                                            style={{}}>
                                            {t`A step at night,
Dreams so bright.
A heart so bold,
Chasing gold.`}
                                        </Text>
                                    </View>
                                    <View style={styles.radioButton}>
                                        <RadioButton
                                            value="showSections"
                                            color={theme.colors.primary}
                                            uncheckedColor={theme.colors.grey}
                                            status={
                                                !showSections
                                                    ? "checked"
                                                    : "unchecked"
                                            }
                                            onPress={() => {
                                                setShowSections(false);
                                            }}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.repetitionSection}>
                            <Text
                                style={{
                                    maxWidth: "55%",
                                }}>{t`Allow repetitions of verses and choruses in the slideshows?`}</Text>
                            <View style={styles.switchButton}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={{
                                        width: 60,
                                        height: 50,
                                        borderRadius: 10,
                                        zIndex: 10,
                                    }}
                                    onPress={() => {
                                        setAllowRepetition(!allowRepetition);
                                    }}
                                />
                                <Switch
                                    value={allowRepetition}
                                    style={{
                                        pointerEvents: "none",
                                        position: "absolute",
                                        top: 10,
                                        left: 10,
                                    }}
                                />
                            </View>
                        </View>
                    )}
                </View>
            </BottomSheetModal>

            <Modal
                visible={isLogoutModalOpen}
                setVisible={setIsLogoutModalOpen}
                disableClose={logoutLoading}>
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
                                width: 220,
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
                                if (logoutLoading) return;
                                setIsLogoutModalOpen(false);
                            }}
                            disabled={logoutLoading}
                            activeOpacity={theme.activeOpacity}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: theme.colors.darkPaper,
                                    opacity: !logoutLoading ? 1 : 0.5,
                                },
                            ]}>
                            <Text fontSize={14} bold upper center>
                                {t`Cancel`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: "48%" }}>
                        <TouchableOpacity
                            onPress={async () => {
                                if (logoutLoading) return;

                                setLogoutLoading(true);
                                await logout();
                                setLogoutLoading(false);
                            }}
                            activeOpacity={theme.activeOpacity}
                            disabled={logoutLoading}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: theme.colors.danger,
                                    flexDirection: "row",
                                    // opacity: !logoutLoading ? 1 : 0.5,
                                },
                            ]}>
                            {logoutLoading && (
                                <ActivityIndicator
                                    size={16}
                                    style={{ marginRight: 10 }}
                                    color={theme.colors.white}
                                />
                            )}
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

            <Modal
                visible={isExitModalOpen}
                setVisible={setIsExitModalOpen}
                disableClose={exitLoading}>
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
                                width: 220,
                            }}>{t`Are you sure you want to exit guest mode?`}</Text>
                        <Text
                            fontSize={18}
                            color={theme.colors.textVariant}
                            center
                            style={{
                                width: 220,
                                marginTop: 5,
                            }}>{t`All your data will be lost.`}</Text>
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
                                if (exitLoading) return;

                                setIsExitModalOpen(false);
                            }}
                            activeOpacity={theme.activeOpacity}
                            disabled={exitLoading}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: theme.colors.darkPaper,
                                    opacity: !exitLoading ? 1 : 0.5,
                                },
                            ]}>
                            <Text fontSize={14} bold upper center>
                                {t`Cancel`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: "47%" }}>
                        <TouchableOpacity
                            onPress={async () => {
                                if (exitLoading) return;

                                setExitLoading(true);
                                await exitGuest();
                                setExitLoading(false);
                            }}
                            activeOpacity={theme.activeOpacity}
                            disabled={exitLoading}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: theme.colors.danger,
                                    flexDirection: "row",
                                    // opacity: !exitLoading ? 1 : 0.5,
                                },
                            ]}>
                            {exitLoading && (
                                <ActivityIndicator
                                    size={16}
                                    style={{ marginRight: 10 }}
                                    color={theme.colors.white}
                                />
                            )}
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

            <Modal
                visible={isDeleteModalOpen}
                onClose={() => {
                    setPassword("");
                    setError("");
                }}
                disableClose={deleteLoading}
                setVisible={setIsDeleteModalOpen}>
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
                                width: 220,
                            }}>{t`Deleting your account will lose all your data.`}</Text>
                        {!user.emailVerified && (
                            <Text
                                fontSize={18}
                                color={theme.colors.textVariant}
                                center
                                style={{
                                    width: 220,
                                    marginTop: 20,
                                }}>
                                {t`Type your`}
                                <Text fontSize={18} bold>
                                    {" "}
                                    {t`password`}{" "}
                                </Text>
                                {t` to proceed.`}
                            </Text>
                        )}
                    </View>
                </View>
                {!user.emailVerified && (
                    <View>
                        <Input
                            placeholder={""}
                            value={password}
                            hidden
                            onChange={setPassword}
                            error={passwordError}
                            errorText={t`The password is incorrect.`}
                        />
                        {error.length > 0 && (
                            <View style={styles.error}>
                                <Text color={theme.colors.danger} fontSize={14}>
                                    {error}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
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
                                if (deleteLoading) return;

                                setIsDeleteModalOpen(false);
                                setPassword("");
                                setError("");
                            }}
                            disabled={deleteLoading}
                            activeOpacity={theme.activeOpacity}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: theme.colors.darkPaper,
                                    opacity: !deleteLoading ? 1 : 0.5,
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
                                if (deleteLoading) return;

                                setError("");
                                setDeleteLoading(true);

                                if (user.emailVerified)
                                    deleteGoogleAccount()
                                        .then(() => {})
                                        .catch((error: any) => {
                                            if (
                                                error.message.includes(
                                                    "Access to this account has been temporarily disabled"
                                                )
                                            )
                                                setError(
                                                    t`Access to this account has been temporarily disabled due to many failed attempts. Please try again later.`
                                                );
                                        })
                                        .finally(() => {
                                            setDeleteLoading(false);
                                        });
                                else
                                    deleteAccount(password)
                                        .then(() => {
                                            setPasswordError(false);
                                        })
                                        .catch((error: any) => {
                                            if (
                                                error.message.includes(
                                                    "auth/invalid-credential"
                                                )
                                            )
                                                setPasswordError(true);
                                            else if (
                                                error.message.includes(
                                                    "Access to this account has been temporarily disabled"
                                                )
                                            )
                                                setError(
                                                    t`Access to this account has been temporarily disabled due to many failed attempts. Please try again later.`
                                                );
                                        })
                                        .finally(() => {
                                            setDeleteLoading(false);
                                        });
                            }}
                            activeOpacity={theme.activeOpacity}
                            disabled={
                                (!user.emailVerified &&
                                    password.length === 0) ||
                                deleteLoading
                            }
                            style={[
                                styles.button,
                                {
                                    backgroundColor: theme.colors.danger,
                                    opacity:
                                        (!deleteLoading || true) &&
                                        (user.emailVerified ||
                                            password.length > 0)
                                            ? 1
                                            : 0.5,
                                    flexDirection: "row",
                                },
                            ]}>
                            {deleteLoading && (
                                <ActivityIndicator
                                    size={16}
                                    style={{ marginRight: 10 }}
                                    color={theme.colors.white}
                                />
                            )}
                            <Text
                                fontSize={14}
                                bold
                                upper
                                center
                                color={theme.colors.white}>
                                {t`Delete`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={isReloadModalOpen}
                setVisible={setIsReloadModalOpen}
                disableClose={reloadLoading}>
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
                                width: 220,
                            }}>{t`The songs and albums will be reloaded.`}</Text>
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
                                if (reloadLoading) return;

                                setIsReloadModalOpen(false);
                            }}
                            disabled={reloadLoading}
                            activeOpacity={theme.activeOpacity}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: theme.colors.darkPaper,
                                    opacity: !reloadLoading ? 1 : 0.5,
                                },
                            ]}>
                            <Text fontSize={14} bold upper center>
                                {t`Cancel`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: "47%" }}>
                        <TouchableOpacity
                            onPress={async () => {
                                if (reloadLoading) return;

                                setReloadLoading(true);
                                await reloadAllData();
                                await fullyUpdateRecent();
                                setReloadLoading(false);

                                setIsReloadModalOpen(false);
                            }}
                            activeOpacity={theme.activeOpacity}
                            disabled={reloadLoading}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: theme.colors.danger,
                                    flexDirection: "row",
                                    // opacity: !reloadLoading ? 1 : 0.5,
                                },
                            ]}>
                            {reloadLoading && (
                                <ActivityIndicator
                                    size={16}
                                    style={{ marginRight: 10 }}
                                    color={theme.colors.white}
                                />
                            )}
                            <Text
                                fontSize={14}
                                bold
                                upper
                                center
                                color={theme.colors.white}>
                                {t`Reload`}
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
    },
    choiceContainer: {
        alignItems: "center",
        marginRight: 20,
    },
    choices2: {
        flexDirection: "column",
    },
    choiceContainer2: {
        alignItems: "center",
        width: "100%",
        flexDirection: "row",
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
        marginBottom: 10,
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
        width: "95%",
    },
    zoomContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },
    error: {
        alignSelf: "flex-start",
        marginTop: 5,
        marginLeft: 15,
    },
    lyrics: {
        width: "90%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 170,
    },
    sections: {
        height: 160,
        display: "flex",
        flexDirection: "row",
    },
    section: {
        width: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    radioButton: {
        marginTop: 10,
        marginLeft: -20,
    },
    switchButton: {
        position: "relative",
        marginRight: 20,
    },
    repetitionSection: {
        height: 120,
        display: "flex",
        flexDirection: "row",
        marginHorizontal: 10,
        marginTop: -20,
        alignItems: "center",
        justifyContent: "space-between",
    },
    sectionText: {
        marginHorizontal: 10,
        marginBottom: 25,
    },
});
