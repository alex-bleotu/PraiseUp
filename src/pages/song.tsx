import {
    FontAwesome6 as FIcon,
    MaterialIcons as MIcon,
} from "@expo/vector-icons";
import { t } from "@lingui/macro";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import AnimatedTouchable from "../components/wrapers/animatedTouchable";
import BottomSheetModal from "../components/wrapers/bottomSheetModal";
import Button from "../components/wrapers/button";
import DataBottomSheet from "../components/wrapers/dataBottomSheet";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { ConstantsContext } from "../context/constants";
import { DataContext } from "../context/data";
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

const chordCache: Record<string, string> = {};

const chordChanger = (
    text: string,
    steps: number,
    useBrackets: boolean = true
): string => {
    if (chordCache[text + steps]) {
        return chordCache[text + steps];
    }
    if (text === null || text === undefined) return "C";

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

    chordCache[text + steps] = newChord;
    return newChord;
};

const getStepsFromC = (chord: string) => {
    if (chord === null || chord === undefined) return null;

    const match = chord.match(/^([A-G]#?)(.*)$/);
    if (!match) return null;
    const steps = chords.indexOf(match[1]);
    return steps !== -1 ? steps : null;
};

export const renderLyrics = (
    lyrics: string,
    showChords: boolean,
    theme: any,
    fontSize: number = 16,
    steps: number = 0,
    chords: "split" | "combined" | "separated" = "combined"
) => {
    if (!lyrics) return null;

    const lines = lyrics.split("\n");

    const isSmallLyric = (lyric: string) => lyric.trim().length <= 3;

    return lines.map((line, index) => {
        const hasChords = line.match(/\[.*?\]/);
        const isEmptyLine = line.trim() === "";

        if (isEmptyLine && showChords) {
            return <View key={index} style={styles.emptyLine} />;
        }

        if (line.length < 4)
            return (
                <Text
                    key={index}
                    style={{
                        marginVertical: 5,
                    }}
                    fontSize={fontSize}
                    bold
                    color={theme.colors.grey}>
                    {line}
                </Text>
            );

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

            let combinedChords: string[] = [];
            let combinedLyrics: string[] = [];
            let tempChords: string[] = [];
            let tempLyrics = "";

            for (let i = 0; i < chordsLine.length; i++) {
                const currentChord = chordsLine[i];
                const currentLyric = lyricsLine[i] || "";

                if (
                    chords !== "split" &&
                    isSmallLyric(currentLyric) &&
                    currentChord !== "."
                ) {
                    tempChords.push(currentChord);
                    tempLyrics += currentLyric;
                } else {
                    if (tempChords.length > 0) {
                        combinedChords.push(tempChords.join("-"));
                        combinedLyrics.push(tempLyrics);
                        tempChords = [];
                        tempLyrics = "";
                    }
                    combinedChords.push(currentChord);
                    combinedLyrics.push(currentLyric);
                }
            }

            if (tempChords.length > 0) {
                combinedChords.push(tempChords.join("-"));
                combinedLyrics.push(tempLyrics);
            }

            return (
                <View key={index} style={styles.line}>
                    <View style={styles.chordsSegmentsLine}>
                        {combinedLyrics.map((lyric, idx) => {
                            let chordsToDisplay =
                                chords === "separated"
                                    ? combinedChords[idx].split("-")
                                    : [combinedChords[idx]];

                            return (
                                <View key={idx}>
                                    <View style={{ flexDirection: "row" }}>
                                        {chordsToDisplay.map(
                                            (chord, chordIdx) => (
                                                <View
                                                    key={chordIdx}
                                                    style={
                                                        chord !== "."
                                                            ? [
                                                                  styles.chord,
                                                                  {
                                                                      backgroundColor:
                                                                          theme
                                                                              .colors
                                                                              .primary,
                                                                  },
                                                              ]
                                                            : {
                                                                  alignSelf:
                                                                      "flex-start",
                                                                  paddingVertical: 2,
                                                              }
                                                    }>
                                                    <Text
                                                        style={
                                                            styles.lyricsLine
                                                        }
                                                        bold
                                                        color={
                                                            chord !== "."
                                                                ? theme.colors
                                                                      .textInverted
                                                                : theme.colors
                                                                      .background
                                                        }
                                                        fontSize={fontSize - 2}>
                                                        {chord}
                                                    </Text>
                                                </View>
                                            )
                                        )}
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
    const { song: s, id } = route.params;

    const { theme } = useContext(ThemeContext);
    const { lyricsSize, setLyricsSize, chords } = useContext(ConstantsContext);
    const { getSongById } = useContext(DataContext);

    const [song, setSong] = useState(s);
    const [value, setValue] = useState("lyrics");
    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [isChordBottomSheetOpen, setChordBottomSheetOpen] = useState(false);
    const [steps, setSteps] = useState(0);

    const buttonWidth = Dimensions.get("screen").width / 2 - 45;
    const buttonsContainerWidth = buttonWidth * 2 + 75;

    useEffect(() => {
        if (song) return;

        const load = async () => {
            if (id) {
                setSong(await getSongById(id));
            }
        };

        load();
    }, []);

    const initialSteps = getStepsFromC(song?.initialChord) || 0;

    const hasChords = song?.lyrics && song?.lyrics.match(/\[.*?\]/);

    const renderedLyrics = useMemo(() => {
        return renderLyrics(song?.lyrics, false, theme, lyricsSize, steps);
    }, [song?.lyrics, lyricsSize, steps, theme]);

    const renderedChords = useMemo(() => {
        return renderLyrics(
            song?.lyrics,
            true,
            theme,
            lyricsSize,
            steps,
            chords
        );
    }, [song?.lyrics, lyricsSize, steps, theme, chords]);

    if (song === null || song === undefined) return <Loading />;

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
                                    marginLeft: 5,
                                },
                            ]}
                            onPress={() => {
                                setChordBottomSheetOpen(true);
                            }}>
                            <Text
                                bold
                                fontSize={18}
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
                    <ScrollView
                        style={[
                            styles.lyrics,
                            {
                                display:
                                    value === "lyrics" && song.lyrics
                                        ? "flex"
                                        : "none",
                            },
                        ]}
                        bottom={hasChords ? 40 : 5}
                        top={7}>
                        {renderedLyrics}
                    </ScrollView>
                    <ScrollView
                        style={[
                            styles.lyrics,
                            {
                                display:
                                    value === "chords" && song.lyrics
                                        ? "flex"
                                        : "none",
                            },
                        ]}
                        bottom={37}
                        top={10}>
                        {renderedChords}
                    </ScrollView>
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
                extraActions2={() => {
                    setBottomSheetOpen(false);
                    navigation.navigate("AddToAlbum", { currentData: song });
                }}
                slideshow={() => {
                    setBottomSheetOpen(false);
                    navigation.navigate("Slideshow", { song });
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
        paddingHorizontal: 25,
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
        marginLeft: 5,
        marginRight: 5,
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
        paddingVertical: 2,
        alignSelf: "flex-start",
    },
    emptyLine: {
        marginTop: 50,
    },
});
