import {
    FontAwesome6 as FIcon,
    MaterialIcons as MIcon,
} from "@expo/vector-icons";
import { t } from "@lingui/macro";
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
    PinchGestureHandler,
    PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
    useAnimatedGestureHandler,
    useSharedValue,
} from "react-native-reanimated";
import Button from "../components/wrapers/button";
import DataBottomSheet from "../components/wrapers/dataBottomSheet";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import { DataContext, SongType } from "../context/data";
import { ThemeContext } from "../context/theme";
import Loading from "./loading";

interface SongProps {
    route: any;
    navigation: any;
}

const renderLyrics = (
    lyrics: string,
    showChords: boolean,
    theme: any,
    fontSize: Animated.SharedValue<number>
) => {
    const lines = lyrics.split("\n");

    return lines.map((line, index) => {
        const hasChords = line.match(/\[.*?\]/);

        if (hasChords && showChords) {
            const parts = line.split(/(\[.*?\])/g);

            let chordsLine = "";
            let lyricsLine = "";

            parts.forEach((part) => {
                if (part.startsWith("[") && part.endsWith("]")) {
                    chordsLine += part.padEnd(
                        part.length + part.length - 2,
                        " "
                    );
                } else {
                    chordsLine += " ".repeat(part.length);
                    lyricsLine += part;
                }
            });

            return (
                <View key={index} style={styles.line}>
                    <Animated.Text
                        style={[
                            styles.chordsLine,
                            { fontSize: fontSize, color: theme.colors.danger },
                        ]}>
                        {chordsLine}
                    </Animated.Text>
                    <Animated.Text
                        style={[styles.lyricsLine, { fontSize: fontSize }]}>
                        {lyricsLine}
                    </Animated.Text>
                </View>
            );
        } else {
            const cleanedLine = line.replace(/\[.*?\]/g, "");
            return (
                <Animated.Text
                    key={index}
                    style={[styles.lyricsLine, { fontSize: fontSize }]}>
                    {cleanedLine}
                </Animated.Text>
            );
        }
    });
};

const Song = ({ route, navigation }: SongProps) => {
    const { id } = route.params;

    const { theme } = useContext(ThemeContext);
    const { getSongById } = useContext(DataContext);

    const [value, setValue] = useState("lyrics");
    const [song, setSong] = useState<SongType | null>(null);
    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);

    const buttonWidth = Dimensions.get("screen").width / 2 - 25;
    const buttonsContainerWidth = buttonWidth * 2 + 25;

    const fontSize = useSharedValue(16);

    const pinchGestureHandler =
        useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
            onActive: (event) => {
                fontSize.value = Math.max(
                    10,
                    Math.min(40, fontSize.value * event.scale)
                );
            },
        });

    useEffect(() => {
        const load = async () => {
            const song = await getSongById(id);
            setSong(song);
        };

        load();
    }, []);

    if (song === null) return <Loading />;

    const hasChords = song.lyrics && song.lyrics.match(/\[.*?\]/);

    return (
        <StackPage
            navigation={navigation}
            title={song.title}
            icon={"dots-vertical"}
            action={() => setBottomSheetOpen(true)}>
            <View style={styles.container}>
                {song.lyrics && hasChords && (
                    <View
                        style={[
                            styles.selector,
                            {
                                backgroundColor: theme.colors.paper,
                                width: buttonsContainerWidth,
                            },
                        ]}>
                        <Button
                            mode={value === "lyrics" ? "contained" : "none"}
                            onPress={() => setValue("lyrics")}
                            text={t`Lyrics`}
                            style={{ ...styles.button, width: buttonWidth }}
                            fontSize={15}
                            icon={
                                <MIcon
                                    name="lyrics"
                                    size={18}
                                    color={theme.colors.text}
                                />
                            }
                        />
                        <View style={{ width: 10 }} />
                        {hasChords && (
                            <>
                                <Button
                                    mode={
                                        value === "chords"
                                            ? "contained"
                                            : "none"
                                    }
                                    onPress={() => setValue("chords")}
                                    style={{
                                        width: buttonWidth,
                                        ...styles.button,
                                    }}
                                    fontSize={15}
                                    text={t`Chords`}
                                    icon={
                                        <FIcon
                                            name="itunes-note"
                                            size={18}
                                            color={theme.colors.text}
                                        />
                                    }
                                />
                                <View style={{ width: 10 }} />
                            </>
                        )}
                    </View>
                )}
                <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
                    <Animated.View style={{ flex: 1 }}>
                        {value === "lyrics" && song.lyrics && (
                            <ScrollView
                                style={styles.lyrics}
                                bottom={10}
                                top={10}>
                                {renderLyrics(
                                    song.lyrics,
                                    false,
                                    theme,
                                    fontSize
                                )}
                            </ScrollView>
                        )}
                        {value === "chords" && song.lyrics && (
                            <ScrollView
                                style={styles.lyrics}
                                bottom={7}
                                top={10}>
                                {renderLyrics(
                                    song.lyrics,
                                    true,
                                    theme,
                                    fontSize
                                )}
                            </ScrollView>
                        )}
                    </Animated.View>
                </PinchGestureHandler>
            </View>
            <DataBottomSheet
                data={song}
                isOpen={isBottomSheetOpen}
                onClose={() => {
                    setBottomSheetOpen(false);
                }}
            />
        </StackPage>
    );
};

export default Song;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    selector: {
        flexDirection: "row",
        borderRadius: 20,
        paddingVertical: 7,
        paddingHorizontal: 8,
    },
    button: {
        paddingVertical: 8,
        borderRadius: 14,
    },
    lyrics: {
        width: "100%",
        paddingLeft: 40,
        paddingRight: 40,
    },
    line: {
        flexDirection: "column",
        marginBottom: 5,
    },
    chordsLine: {
        flexDirection: "row",
        flexWrap: "wrap",
        fontSize: 15,
        lineHeight: 24,
        fontWeight: "bold",
        marginBottom: -5,
        marginTop: -3,
    },
    lyricsLine: {
        flexDirection: "row",
        flexWrap: "wrap",
        fontSize: 16,
        lineHeight: 24,
    },
});
