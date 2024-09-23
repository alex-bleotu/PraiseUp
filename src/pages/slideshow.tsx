import {
    Entypo as EIcons,
    MaterialCommunityIcons as MCIcons,
    MaterialIcons as MIcons,
} from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import AnimatedTouchable from "../components/wrapers/animatedTouchable";
import Text from "../components/wrapers/text";
import { DataContext } from "../context/data";

const countLines = (str: string) => {
    const lines = str.split("\n").filter((line) => line.trim() !== "");
    return lines.length;
};

const Slideshow = ({ route, navigation }: { route: any; navigation: any }) => {
    const { song: s, id } = route.params;
    const { getSongById } = useContext(DataContext);

    const [rotation, setRotation] = useState<0 | 180>(0);
    const [lyricsArray, setLyricsArray] = useState<string[]>([]);
    const [currentVerse, setCurrentVerse] = useState(0);
    const [song, setSong] = useState<any>(s);
    const [screenSize, setScreenSize] = useState({
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
    });

    useEffect(() => {
        const updateScreenSize = () => {
            setScreenSize({
                width: Dimensions.get("screen").width,
                height: Dimensions.get("screen").height,
            });
        };

        const dimensionListener = Dimensions.addEventListener(
            "change",
            updateScreenSize
        );
        return () => {
            if (dimensionListener) dimensionListener.remove();
        };
    }, []);

    useEffect(() => {
        if (!song && id) {
            (async () => {
                const loadedSong = await getSongById(id);
                setSong(loadedSong);
            })();
        }
    }, [id, song, getSongById]);

    const removeChords = (lyrics: string) =>
        lyrics ? lyrics.replace(/\[.*?\]/g, "").trim() : "";

    const processLyrics = () => {
        const lyrics = removeChords(song.lyrics).split("\r\n\r\n");
        const order = song.order.split(" ");
        const songVersesArray = order.map((section: string) => {
            return (
                lyrics.find((verse) =>
                    verse.startsWith(section.split("x")[0])
                ) || ""
            );
        });
        songVersesArray.push("");
        setLyricsArray(songVersesArray);
    };

    const lockOrientation = async (
        orientation: ScreenOrientation.OrientationLock
    ) => {
        await ScreenOrientation.lockAsync(orientation);
    };

    useEffect(() => {
        const lockOrientationToLandscape = async () => {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
            );
        };

        const lockOrientationToPortrait = async () => {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT
            );
        };

        lockOrientationToLandscape();

        return () => {
            lockOrientationToPortrait();
        };
    }, []);

    useEffect(() => {
        if (song && song.lyrics && song.order) {
            processLyrics();
        }
    }, [song]);

    useEffect(() => {
        if (!song || !song.lyrics) {
            navigation.goBack();
        }
    }, [song, navigation]);

    const goBackWithPortrait = async () => {
        await lockOrientation(ScreenOrientation.OrientationLock.PORTRAIT);

        setTimeout(() => {
            navigation.goBack();
        }, 150);
    };

    return (
        <View style={styles.container}>
            {lyricsArray.length > 0 && lyricsArray[currentVerse] !== "" && (
                <View style={styles.textContainer}>
                    <View style={styles.sectionLabel}>
                        <Text color="grey" bold fontSize={18}>
                            {lyricsArray[currentVerse].split("\r")[0]}:
                        </Text>
                    </View>
                    <Text
                        color="white"
                        fontSize={
                            countLines(lyricsArray[currentVerse]) > 6 ? 26 : 34
                        }>
                        {lyricsArray[currentVerse]
                            .split("\r")
                            .slice(1)
                            .join("")
                            .trim()}
                    </Text>
                </View>
            )}

            <View style={styles.buttonContainer}>
                <AnimatedTouchable
                    style={styles.button}
                    onPress={() =>
                        setCurrentVerse(Math.max(currentVerse - 1, 0))
                    }>
                    <EIcons name="chevron-left" size={24} color="white" />
                </AnimatedTouchable>
                <AnimatedTouchable
                    style={styles.button}
                    onPress={() => {
                        if (currentVerse < lyricsArray.length - 1) {
                            setCurrentVerse(currentVerse + 1);
                        } else {
                            goBackWithPortrait();
                        }
                    }}>
                    <EIcons name="chevron-right" size={24} color="white" />
                </AnimatedTouchable>
                <AnimatedTouchable
                    style={styles.button}
                    onPress={() => {
                        const newRotation = rotation === 0 ? 180 : 0;
                        setRotation(newRotation);
                        lockOrientation(
                            newRotation === 0
                                ? ScreenOrientation.OrientationLock
                                      .LANDSCAPE_RIGHT
                                : ScreenOrientation.OrientationLock
                                      .LANDSCAPE_LEFT
                        );
                    }}>
                    <MCIcons name="rotate-right" size={24} color="white" />
                </AnimatedTouchable>
                <AnimatedTouchable
                    style={styles.button}
                    onPress={goBackWithPortrait}>
                    <MIcons
                        name="cancel-presentation"
                        size={24}
                        color="white"
                    />
                </AnimatedTouchable>
            </View>

            <View
                style={[
                    styles.touchableAreaContainer,
                    { width: screenSize.width, height: screenSize.height },
                ]}>
                <TouchableWithoutFeedback
                    onPress={() =>
                        setCurrentVerse(Math.max(currentVerse - 1, 0))
                    }
                    style={[
                        styles.touchableLeft,
                        {
                            width: screenSize.width / 2,
                            height: screenSize.height,
                        },
                    ]}
                />
                <TouchableWithoutFeedback
                    onPress={() => {
                        if (currentVerse < lyricsArray.length - 1) {
                            setCurrentVerse(currentVerse + 1);
                        } else {
                            goBackWithPortrait();
                        }
                    }}
                    style={[
                        styles.touchableRight,
                        {
                            width: screenSize.width / 2,
                            height: screenSize.height,
                        },
                    ]}
                />
            </View>
        </View>
    );
};

export default Slideshow;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
    },
    textContainer: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        width: 650,
        flexDirection: "row",
    },
    sectionLabel: {
        height: "100%",
        marginRight: 10,
        marginTop: 23,
    },
    buttonContainer: {
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        bottom: 10,
        right: 20,
        zIndex: 100,
    },
    button: {
        marginRight: 20,
    },
    touchableAreaContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row",
    },
    touchableLeft: {
        // backgroundColor: "rgba(255,0,0,0.2)",
    },
    touchableRight: {
        // backgroundColor: "rgba(0,0,255,0.2)",
    },
});
