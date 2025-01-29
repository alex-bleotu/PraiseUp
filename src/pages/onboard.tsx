import { t } from "@lingui/macro";
import { useContext, useMemo, useRef } from "react";
import { Animated, FlatList, StyleSheet, View } from "react-native";
import OnboardItem from "../components/items/onboardItem";
import Background from "../components/wrapers/background";
import Button from "../components/wrapers/button";
import Paginator from "../components/wrapers/paginator";
import { LanguageContext } from "../context/language";
import { ThemeContext } from "../context/theme";

function Onboard({ navigation }: { navigation: any }) {
    const { theme, themeType, systemTheme } = useContext(ThemeContext);
    const { language } = useContext(LanguageContext);

    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    type ImageType = {
        [key: string]: {
            light: {
                en: any;
                ro: any;
            };
            dark: {
                en: any;
                ro: any;
            };
        };
    };

    const getImage = (
        themeType: string,
        language: "en" | "ro",
        imageName: keyof ImageType
    ) => {
        const images: ImageType = {
            home: {
                light: {
                    en: require("../../assets/images/onboard/homeLightEn.png"),
                    ro: require("../../assets/images/onboard/homeLightRo.png"),
                },
                dark: {
                    en: require("../../assets/images/onboard/homeDarkEn.png"),
                    ro: require("../../assets/images/onboard/homeDarkRo.png"),
                },
            },
            album: {
                light: {
                    en: require("../../assets/images/onboard/albumLightEn.png"),
                    ro: require("../../assets/images/onboard/albumLightRo.png"),
                },
                dark: {
                    en: require("../../assets/images/onboard/albumDarkEn.png"),
                    ro: require("../../assets/images/onboard/albumDarkRo.png"),
                },
            },
            slideshow: {
                light: {
                    en: require("../../assets/images/onboard/slideshowEn.png"),
                    ro: require("../../assets/images/onboard/slideshowRo.png"),
                },
                dark: {
                    en: require("../../assets/images/onboard/slideshowEn.png"),
                    ro: require("../../assets/images/onboard/slideshowRo.png"),
                },
            },
        };

        const selectedTheme =
            themeType === "light" ||
            (themeType === "system" && systemTheme === "light")
                ? "light"
                : "dark";

        return (
            images[imageName]?.[selectedTheme]?.[language] ||
            images[imageName]?.[selectedTheme]?.en
        );
    };

    const slides = useMemo(
        () => [
            {
                id: 1,
                title: t`Worship Made Easy`,
                description: t`Access lyrics and chords with ease, bringing your worship moments to life.`,
                image: getImage(themeType, language, "home"),
            },
            {
                id: 2,
                title: t`Your Music, His Glory`,
                description: t`Organize and share your favorite worship songs with your friends.`,
                image: getImage(themeType, language, "album"),
            },
            {
                id: 3,
                title: t`Prepare, Play, Praise`,
                description: t`Make your worship sessions with quick access to slideshows and more.`,
                image: getImage(themeType, language, "slideshow"),
            },
        ],
        [themeType, language]
    );

    return (
        <Background
            center
            noBottom
            noPadding
            style={{
                alignItems: "center",
            }}>
            <FlatList
                data={slides}
                renderItem={({ item }) => <OnboardItem item={item} />}
                horizontal
                pagingEnabled
                bounces={false}
                keyExtractor={(item: any) => String(item.id)}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={32}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
                showsHorizontalScrollIndicator={false}
            />

            <View style={styles.paginator}>
                <Paginator data={slides} scrollX={scrollX} />
            </View>

            <View style={styles.buttons}>
                <Button
                    mode="contained"
                    text={t`Join PraiseUp`}
                    upper
                    fullWidth
                    color={theme.colors.textOnPrimary}
                    fontSize={14}
                    bold
                    onPress={() => {
                        navigation.navigate("Register");
                    }}
                />
                <Button
                    mode="none"
                    text={t`Already have an account?`}
                    upper
                    fullWidth
                    fontSize={14}
                    bold
                    style={{ marginTop: 10 }}
                    color={theme.colors.grey}
                    onPress={() => {
                        navigation.navigate("Login");
                    }}
                />
            </View>
        </Background>
    );
}

export default Onboard;

const styles = StyleSheet.create({
    paginator: {
        position: "absolute",
        bottom: 100,
    },
    buttons: {
        marginBottom: 20,
        width: "100%",
        paddingHorizontal: 20,
    },
});
