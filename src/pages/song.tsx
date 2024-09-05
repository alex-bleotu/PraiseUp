import {
    FontAwesome6 as FIcon,
    MaterialIcons as MIcon,
} from "@expo/vector-icons";
import { t } from "@lingui/macro";
import React, { useContext, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import AnimatedTouchable from "../components/wrapers/animatedTouchable";
import BottomSheetModal from "../components/wrapers/bottomSheetModal";
import Button from "../components/wrapers/button";
import DataBottomSheet from "../components/wrapers/dataBottomSheet";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { ConstantsContext } from "../context/constants";
import { ThemeContext } from "../context/theme";
import Loading from "./loading";

interface SongProps {
    route: any;
    navigation: any;
}

const chords = [
    "C",
    "C#",
    "D",
    "Eb",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "Bb",
    "B",
];

const chordChanger = (
    text: string,
    steps: number,
    useBrackets: boolean = true
): string => {
    if (text === null) return "C";

    const regex = useBrackets
        ? /^\[([A-G]#?[a-zA-Z0-9]*)\]$/
        : /^([A-G]#?[a-zA-Z0-9]*)$/;
    const match = text.match(regex);
    if (!match) return text;

    const chord = match[1];

    const rootMatch = chord.match(/^([A-G]#?)(.*)$/);
    if (!rootMatch) return text;

    const root = rootMatch[1];
    const suffix = rootMatch[2];

    const rootIndex = chords.indexOf(root);
    if (rootIndex === -1) return text;

    const newIndex = (rootIndex + steps + chords.length) % chords.length;
    const newChord = chords[newIndex] + suffix;

    return newChord;
};

const getStepsFromC = (chord: string) => {
    const steps = chords.indexOf(chord);
    return steps !== -1 ? steps : null;
};

const renderLyrics = (
    lyrics: string,
    showChords: boolean,
    theme: any,
    fontSize: number = 16,
    steps: number = 0
) => {
    const lines = lyrics.split("\n");

    return lines.map((line, index) => {
        const hasChords = line.match(/\[.*?\]/);
        const isEmptyLine = line.trim() === "";

        if (isEmptyLine && showChords) {
            console.log("empty line");
            return <View style={styles.emptyLine} />;
        }

        if (hasChords && showChords) {
            const parts = line.split(/(\[.*?\])/g);

            let chordsLine: string[] = ["."];
            let lyricsLine: string[] = [];

            parts.forEach((part) => {
                if (part.startsWith("[") && part.endsWith("]")) {
                    const updatedChord = chordChanger(part, steps);
                    chordsLine.push(updatedChord);
                } else lyricsLine.push(part);
            });

            return (
                <View key={index} style={styles.line}>
                    <View style={styles.chordsSegmentsLine}>
                        {lyricsLine.map((lyric, index) => {
                            return (
                                <View key={index}>
                                    <View
                                        style={
                                            chordsLine[index] !== "."
                                                ? [
                                                      styles.chord,
                                                      {
                                                          backgroundColor:
                                                              theme.colors
                                                                  .primary,
                                                      },
                                                  ]
                                                : {
                                                      alignSelf: "flex-start",
                                                  }
                                        }>
                                        <Text
                                            style={styles.lyricsLine}
                                            bold
                                            color={
                                                chordsLine[index] !== "."
                                                    ? theme.colors.textInverted
                                                    : theme.colors.background
                                            }
                                            fontSize={fontSize}>
                                            {chordsLine[index]}
                                        </Text>
                                    </View>
                                    <Text
                                        style={[
                                            styles.lyricsLine,
                                            {
                                                marginTop: "auto",
                                            },
                                        ]}
                                        fontSize={fontSize}>
                                        {lyric}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            );
        } else {
            const cleanedLine = line.replace(/\[.*?\]/g, "");
            return (
                <Text key={index} style={styles.lyricsLine} fontSize={fontSize}>
                    {cleanedLine}
                </Text>
            );
        }
    });
};

const Song = ({ route, navigation }: SongProps) => {
    const { song } = route.params;

    const { theme } = useContext(ThemeContext);
    const { lyricsSize, setLyricsSize } = useContext(ConstantsContext);

    const [value, setValue] = useState("lyrics");
    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [isChordBottomSheetOpen, setChordBottomSheetOpen] = useState(false);
    const [steps, setSteps] = useState(0);

    const buttonWidth = Dimensions.get("screen").width / 2 - 45;
    const buttonsContainerWidth = buttonWidth * 2 + 65;

    const initialSteps = getStepsFromC(song.initialChord) || 0;

    if (song === null || song === undefined) return <Loading />;

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
                            bold
                            mode={value === "lyrics" ? "contained" : "none"}
                            onPress={() => setValue("lyrics")}
                            text={t`Lyrics`}
                            style={{ ...styles.button, width: buttonWidth }}
                            fontSize={15}
                            color={
                                value === "lyrics"
                                    ? theme.colors.textInverted
                                    : theme.colors.text
                            }
                            icon={
                                <MIcon
                                    name="lyrics"
                                    size={18}
                                    color={
                                        value === "lyrics"
                                            ? theme.colors.textInverted
                                            : theme.colors.text
                                    }
                                />
                            }
                        />
                        <View style={{ width: 10 }} />
                        <Button
                            bold
                            mode={value === "chords" ? "contained" : "none"}
                            onPress={() => setValue("chords")}
                            style={{
                                width: buttonWidth,
                                ...styles.button,
                            }}
                            fontSize={15}
                            text={t`Chords`}
                            color={
                                value === "chords"
                                    ? theme.colors.textInverted
                                    : theme.colors.text
                            }
                            icon={
                                <FIcon
                                    name="itunes-note"
                                    size={18}
                                    color={
                                        value === "chords"
                                            ? theme.colors.textInverted
                                            : theme.colors.text
                                    }
                                />
                            }
                        />
                        <AnimatedTouchable
                            style={[
                                styles.chordButton,
                                {
                                    width: 40,
                                },
                            ]}
                            onPress={() => {
                                setChordBottomSheetOpen(true);
                            }}>
                            <Text
                                bold
                                fontSize={20}
                                style={{
                                    marginTop: -1,
                                }}>
                                {chordChanger(song.initialChord, steps, false)}
                            </Text>
                        </AnimatedTouchable>
                    </View>
                )}

                <View
                    style={{
                        width: "100%",
                    }}>
                    {value === "lyrics" && song.lyrics && (
                        <ScrollView
                            style={styles.lyrics}
                            bottom={hasChords ? 40 : 5}
                            top={7}>
                            {renderLyrics(
                                song.lyrics,
                                false,
                                theme,
                                lyricsSize
                            )}
                        </ScrollView>
                    )}
                    {value === "chords" && song.lyrics && (
                        <ScrollView style={styles.lyrics} bottom={37} top={10}>
                            {renderLyrics(
                                song.lyrics,
                                true,
                                theme,
                                lyricsSize,
                                steps
                            )}
                        </ScrollView>
                    )}
                </View>
            </View>
            <BottomSheetModal
                isOpen={isChordBottomSheetOpen}
                onClose={() => {
                    setChordBottomSheetOpen(false);
                }}
                height={175}>
                <View style={styles.chordButtonsLine}>
                    <TouchableOpacity
                        activeOpacity={theme.activeOpacity}
                        style={[
                            styles.chordButton,
                            {
                                backgroundColor:
                                    steps + initialSteps === 0
                                        ? theme.colors.primary
                                        : "transparent",
                            },
                        ]}
                        onPress={() => {
                            setSteps(0 - initialSteps);
                        }}>
                        <Text
                            bold
                            fontSize={20}
                            color={
                                steps + initialSteps === 0
                                    ? theme.colors.textInverted
                                    : theme.colors.text
                            }>
                            C
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={theme.activeOpacity}
                        style={[
                            styles.chordButton,
                            {
                                backgroundColor:
                                    steps + initialSteps === 1
                                        ? theme.colors.primary
                                        : "transparent",
                            },
                        ]}
                        onPress={() => {
                            setSteps(1 - initialSteps);
                        }}>
                        <Text
                            bold
                            fontSize={20}
                            color={
                                steps + initialSteps === 1
                                    ? theme.colors.textInverted
                                    : theme.colors.text
                            }>
                            C#
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={theme.activeOpacity}
                        style={[
                            styles.chordButton,
                            {
                                backgroundColor:
                                    steps + initialSteps === 2
                                        ? theme.colors.primary
                                        : "transparent",
                            },
                        ]}
                        onPress={() => {
                            setSteps(2 - initialSteps);
                        }}>
                        <Text
                            bold
                            fontSize={20}
                            color={
                                steps + initialSteps === 2
                                    ? theme.colors.textInverted
                                    : theme.colors.text
                            }>
                            D
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={theme.activeOpacity}
                        style={[
                            styles.chordButton,
                            {
                                backgroundColor:
                                    steps + initialSteps === 3
                                        ? theme.colors.primary
                                        : "transparent",
                            },
                        ]}
                        onPress={() => {
                            setSteps(3 - initialSteps);
                        }}>
                        <Text
                            bold
                            fontSize={20}
                            color={
                                steps + initialSteps === 3
                                    ? theme.colors.textInverted
                                    : theme.colors.text
                            }>
                            Eb
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={theme.activeOpacity}
                        style={[
                            styles.chordButton,
                            {
                                backgroundColor:
                                    steps + initialSteps === 4
                                        ? theme.colors.primary
                                        : "transparent",
                            },
                        ]}
                        onPress={() => {
                            setSteps(4 - initialSteps);
                        }}>
                        <Text
                            bold
                            fontSize={20}
                            color={
                                steps + initialSteps === 4
                                    ? theme.colors.textInverted
                                    : theme.colors.text
                            }>
                            E
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={theme.activeOpacity}
                        style={[
                            styles.chordButton,
                            {
                                backgroundColor:
                                    steps + initialSteps === 5
                                        ? theme.colors.primary
                                        : "transparent",
                            },
                        ]}
                        onPress={() => {
                            setSteps(5 - initialSteps);
                        }}>
                        <Text
                            bold
                            fontSize={20}
                            color={
                                steps + initialSteps === 5
                                    ? theme.colors.textInverted
                                    : theme.colors.text
                            }>
                            F
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.chordButtonsLine}>
                    <TouchableOpacity
                        activeOpacity={theme.activeOpacity}
                        style={[
                            styles.chordButton,
                            {
                                backgroundColor:
                                    steps + initialSteps === 6
                                        ? theme.colors.primary
                                        : "transparent",
                            },
                        ]}
                        onPress={() => {
                            setSteps(6 - initialSteps);
                        }}>
                        <Text
                            bold
                            fontSize={20}
                            color={
                                steps + initialSteps === 6
                                    ? theme.colors.textInverted
                                    : theme.colors.text
                            }>
                            F#
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={theme.activeOpacity}
                        style={[
                            styles.chordButton,
                            {
                                backgroundColor:
                                    steps + initialSteps === 7
                                        ? theme.colors.primary
                                        : "transparent",
                            },
                        ]}
                        onPress={() => {
                            setSteps(7 - initialSteps);
                        }}>
                        <Text
                            bold
                            fontSize={20}
                            color={
                                steps + initialSteps === 7
                                    ? theme.colors.textInverted
                                    : theme.colors.text
                            }>
                            G
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={theme.activeOpacity}
                        style={[
                            styles.chordButton,
                            {
                                backgroundColor:
                                    steps + initialSteps === 8
                                        ? theme.colors.primary
                                        : "transparent",
                            },
                        ]}
                        onPress={() => {
                            setSteps(8 - initialSteps);
                        }}>
                        <Text
                            bold
                            fontSize={20}
                            color={
                                steps + initialSteps === 8
                                    ? theme.colors.textInverted
                                    : theme.colors.text
                            }>
                            G#
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={theme.activeOpacity}
                        style={[
                            styles.chordButton,
                            {
                                backgroundColor:
                                    steps + initialSteps === 9
                                        ? theme.colors.primary
                                        : "transparent",
                            },
                        ]}
                        onPress={() => {
                            setSteps(9 - initialSteps);
                        }}>
                        <Text
                            bold
                            fontSize={20}
                            color={
                                steps + initialSteps === 9
                                    ? theme.colors.textInverted
                                    : theme.colors.text
                            }>
                            A
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={theme.activeOpacity}
                        style={[
                            styles.chordButton,
                            {
                                backgroundColor:
                                    steps + initialSteps === 10
                                        ? theme.colors.primary
                                        : "transparent",
                            },
                        ]}
                        onPress={() => {
                            setSteps(10 - initialSteps);
                        }}>
                        <Text
                            bold
                            fontSize={20}
                            color={
                                steps + initialSteps === 10
                                    ? theme.colors.textInverted
                                    : theme.colors.text
                            }>
                            Bb
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={theme.activeOpacity}
                        style={[
                            styles.chordButton,
                            {
                                backgroundColor:
                                    steps + initialSteps === 11
                                        ? theme.colors.primary
                                        : "transparent",
                            },
                        ]}
                        onPress={() => {
                            setSteps(11 - initialSteps);
                        }}>
                        <Text
                            bold
                            fontSize={20}
                            color={
                                steps + initialSteps === 11
                                    ? theme.colors.textInverted
                                    : theme.colors.text
                            }>
                            B
                        </Text>
                    </TouchableOpacity>
                </View>
            </BottomSheetModal>
            <DataBottomSheet
                data={song}
                isOpen={isBottomSheetOpen}
                zoom={(zoomIn: boolean) => {
                    if (zoomIn && lyricsSize < 21)
                        setLyricsSize(lyricsSize + 1);
                    else if (!zoomIn && lyricsSize > 12)
                        setLyricsSize(lyricsSize - 1);
                }}
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
        borderRadius: 18,
        paddingVertical: 7,
        paddingHorizontal: 8,
    },
    button: {
        paddingVertical: 8,
        borderRadius: 12,
    },
    lyrics: {
        width: "100%",
        paddingLeft: 30,
        paddingRight: 30,
    },

    line: {
        flexDirection: "column",
        marginBottom: 5,
    },
    chordsLine: {
        flexDirection: "row",
        flexWrap: "wrap",
        lineHeight: 24,
        fontWeight: "bold",
    },
    lyricsLine: {
        flexDirection: "row",
        flexWrap: "wrap",
        lineHeight: 24,
    },
    chordButton: {
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        width: 45,
        marginLeft: 3,
        marginRight: 3,
        height: 40,
    },
    chordButtonsLine: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
    },
    chordsSegmentsLine: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    chord: {
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
        borderTopLeftRadius: 6,
        paddingHorizontal: 6,
        alignSelf: "flex-start",
    },
    emptyLine: {
        marginTop: 50,
    },
});
