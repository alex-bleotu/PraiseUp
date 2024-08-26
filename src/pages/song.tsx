import {
    FontAwesome6 as FIcon,
    MaterialIcons as MIcon,
} from "@expo/vector-icons";
import { t } from "@lingui/macro";
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Button from "../components/wrapers/button";
import DataBottomSheet from "../components/wrapers/dataBottomSheet";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { ConstantsContext } from "../context/constants";
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
    fontSize: number = 16
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

const Song = ({ route, navigation }: SongProps) => {
    const { id } = route.params;

    const { theme } = useContext(ThemeContext);
    const { getSongById } = useContext(DataContext);
    const { lyricsSize, setLyricsSize } = useContext(ConstantsContext);

    const [value, setValue] = useState("lyrics");
    const [song, setSong] = useState<SongType | null>(null);
    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);

    const buttonWidth = Dimensions.get("screen").width / 2 - 25;
    const buttonsContainerWidth = buttonWidth * 2 + 25;

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
                            {renderLyrics(song.lyrics, true, theme, lyricsSize)}
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
