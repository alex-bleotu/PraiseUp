import {
    FontAwesome6 as FIcon,
    MaterialIcons as MIcon,
} from "@expo/vector-icons";
import { t } from "@lingui/macro";
import React, { useContext, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
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

const chordChanger = (text: string, steps: number): string => {
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

    const match = text.match(/^\[([A-G]#?[a-zA-Z0-9]*)\]$/);
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

    return `[${newChord}]`;
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

        if (hasChords && showChords) {
            const parts = line.split(/(\[.*?\])/g);

            let chordsLine = "";
            let lyricsLine = "";

            parts.forEach((part) => {
                if (part.startsWith("[") && part.endsWith("]")) {
                    const updatedChord = chordChanger(part, steps);
                    chordsLine += updatedChord.padEnd(
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
                    <Text
                        style={[
                            styles.chordsLine,
                            {
                                marginBottom: -21 + fontSize,
                                marginTop: -19 + fontSize,
                            },
                        ]}
                        bold
                        color={theme.colors.danger}
                        fontSize={fontSize}>
                        {chordsLine}
                    </Text>
                    <Text style={styles.lyricsLine} fontSize={fontSize}>
                        {lyricsLine}
                    </Text>
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

const data = [
    { key: "1", value: "C" },
    { key: "2", value: "C#" },
    { key: "3", value: "D" },
    { key: "4", value: "Eb" },
    { key: "5", value: "E" },
    { key: "6", value: "F" },
    { key: "7", value: "F#" },
    { key: "8", value: "G" },
    { key: "9", value: "G#" },
    { key: "10", value: "A" },
    { key: "11", value: "Bb" },
    { key: "12", value: "B" },
];

const Song = ({ route, navigation }: SongProps) => {
    const { song } = route.params;

    const { theme } = useContext(ThemeContext);
    const { lyricsSize, setLyricsSize } = useContext(ConstantsContext);

    const [value, setValue] = useState("lyrics");
    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [steps, setSteps] = useState(0);
    const [selectedChord, setSelectedChord] = useState([]);

    const buttonWidth = Dimensions.get("screen").width / 2 - 25;
    const buttonsContainerWidth = buttonWidth * 2 + 25;

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
                        {/* <SelectList
                            setSelected={setSelectedChord}
                            data={data}
                            save="value"
                            search={false}
                            // @ts-ignore
                            defaultOption={
                                data.find(
                                    (item) => item.value === song.initialChord
                                ) || {}
                            }
                            onSelect={() => {
                                const selectedChordValue =
                                    typeof selectedChord === "string"
                                        ? selectedChord
                                        : "";

                                const initialChordIndex = data.findIndex(
                                    (item) => item.value === song.initialChord
                                );
                                const selectedChordIndex = data.findIndex(
                                    (item) => item.value === selectedChordValue
                                );

                                if (
                                    initialChordIndex !== -1 &&
                                    selectedChordIndex !== -1
                                ) {
                                    const calculatedSteps =
                                        (selectedChordIndex -
                                            initialChordIndex +
                                            data.length) %
                                        data.length;
                                    setSteps(calculatedSteps);
                                } else setSteps(0);
                            }}
                            boxStyles={{
                                borderWidth: 0,
                            }}
                            inputStyles={{
                                fontWeight: "bold",
                                fontSize: 18,
                            }}
                            dropdownTextStyles={{
                                fontWeight: "bold",
                                fontSize: 16,
                            }}
                            dropdownStyles={{}}
                        /> */}
                    </View>
                )}

                <View
                    style={{
                        width: "100%",
                    }}>
                    {value === "lyrics" && song.lyrics && (
                        <ScrollView style={styles.lyrics} bottom={40} top={7}>
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
            <DataBottomSheet
                data={song}
                isOpen={isBottomSheetOpen}
                zoom={(zoomIn: boolean) => {
                    if (zoomIn) setLyricsSize(lyricsSize + 1);
                    else setLyricsSize(lyricsSize - 1);
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
});
