import {
    Entypo as EIcons,
    MaterialCommunityIcons as MCIcons,
    MaterialIcons as MIcons,
} from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import AnimatedTouchable from "../components/wrapers/animatedTouchable";
import Text from "../components/wrapers/text";

const Slideshow = ({ route, navigation }: { route: any; navigation: any }) => {
    const { song } = route.params;

    const [rotation, setRotation] = useState<0 | 180>(0);
    const [lyricsArray, setLyricsArray] = useState<string[]>([]);
    const [currentVerse, setCurrentVerse] = useState(0);

    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

    const getTop = () => {
        switch (rotation) {
            case 0:
                return screenHeight / 2;
            case 180:
                return screenHeight / 2;
        }
    };
    const getLeft = () => {
        switch (rotation) {
            case 0:
                return screenWidth / 4 - 20;
            case 180:
                return screenWidth / 2 + screenWidth / 4 + 20;
        }
    };

    const getLeft2 = () => {
        switch (rotation) {
            case 0:
                return screenWidth / 2 + screenWidth / 4 + 20;
            case 180:
                return screenWidth / 4 - 20;
        }
    };

    const removeChords = (lyrics: string) => {
        return lyrics ? lyrics.replace(/\[.*?\]/g, "").trim() : "";
    };

    const processLyrics = () => {
        const lyrics = removeChords(song.lyrics).split("\r\n\r\n");
        const order = song.order.split(" ");

        const songVersesArray: string[] = [];

        order.forEach((section: string) => {
            let index = 0;

            for (let i = 0; i < lyrics.length; i++) {
                if (lyrics[i].split("\r")[0] === section.split("x")[0]) {
                    index = i;
                    break;
                }
            }

            songVersesArray.push(lyrics[index]);
        });

        songVersesArray.push("");

        setLyricsArray(songVersesArray);
    };

    const lockToLandscapeLeft = async () => {
        await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
        );
    };

    const lockToLandscapeRight = async () => {
        await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
        );
    };
    const lockToPortrait = async () => {
        await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT
        );
    };

    const goBackWithPortrait = async () => {
        setLyricsArray([]);

        await lockToPortrait();

        // delay 50 ms
        setTimeout(() => {
            navigation.goBack();
        }, 100);
    };

    useEffect(() => {
        lockToLandscapeRight();

        return () => {
            lockToPortrait();
        };
    }, []);

    useEffect(() => {
        if (song && song.lyrics && song.order) {
            processLyrics();
        }
    }, [song]);

    if (
        song === undefined ||
        song === null ||
        song.lyrics === null ||
        song.lyrics === ""
    )
        navigation.goBack();

    return (
        <View style={styles.container}>
            {lyricsArray.length > 0 && lyricsArray[currentVerse] !== "" && (
                <View style={styles.textContainer}>
                    <View
                        style={{
                            height: "100%",
                            marginRight: 20,
                            marginTop: 20,
                        }}>
                        <Text color="grey" bold fontSize={18}>
                            {lyricsArray[currentVerse].split("\r")[0]}:
                        </Text>
                    </View>
                    <Text color="white" fontSize={34}>
                        {lyricsArray[currentVerse]
                            .split("\r")
                            .slice(1)
                            .join("")
                            .trim()}
                    </Text>
                </View>
            )}

            <View style={[styles.buttonContainer]}>
                <AnimatedTouchable
                    style={{
                        marginRight: 20,
                    }}
                    onPress={() => {
                        if (currentVerse !== 0) {
                            setCurrentVerse(currentVerse - 1);
                        }
                    }}>
                    <EIcons name="chevron-left" size={24} color="white" />
                </AnimatedTouchable>
                <AnimatedTouchable
                    style={{
                        marginRight: 20,
                    }}
                    onPress={() => {
                        if (currentVerse !== lyricsArray.length - 1) {
                            setCurrentVerse(currentVerse + 1);
                        } else {
                            goBackWithPortrait(); // Call goBackWithPortrait to ensure portrait reset
                        }
                    }}>
                    <EIcons name="chevron-right" size={24} color="white" />
                </AnimatedTouchable>
                <AnimatedTouchable
                    style={{
                        marginRight: 20,
                    }}
                    onPress={() => {
                        setRotation(rotation === 0 ? 180 : 0);

                        if (rotation === 0) {
                            lockToLandscapeLeft();
                        } else {
                            lockToLandscapeRight();
                        }
                    }}>
                    <MCIcons name="rotate-right" size={24} color="white" />
                </AnimatedTouchable>
                <AnimatedTouchable
                    onPress={() => {
                        goBackWithPortrait(); // Call goBackWithPortrait when going back
                    }}>
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
                    {
                        transform: [{ rotate: `${rotation}deg` }],
                        width: screenWidth,
                        height: screenHeight,
                    },
                ]}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        if (currentVerse !== 0) {
                            setCurrentVerse(currentVerse - 1);
                        }
                    }}
                    style={[
                        styles.touchableLeft,
                        {
                            width: screenWidth,
                            height: screenHeight,
                            top: getTop(),
                            left: -getLeft(),
                        },
                    ]}
                />

                <TouchableWithoutFeedback
                    onPress={() => {
                        if (currentVerse !== lyricsArray.length - 1) {
                            setCurrentVerse(currentVerse + 1);
                        } else {
                            goBackWithPortrait(); // Call goBackWithPortrait
                        }
                    }}
                    style={[
                        styles.touchableRight,
                        {
                            width: screenWidth,
                            height: screenHeight,
                            top: getTop(),
                            left: getLeft2(),
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
        width: 1000,
        flexDirection: "row",
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
    touchableAreaContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row",
    },
    touchableLeft: {
        position: "absolute",
        left: 0,
    },
    touchableRight: {
        position: "absolute",
    },
});
