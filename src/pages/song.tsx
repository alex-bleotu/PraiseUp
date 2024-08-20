import {
    FontAwesome6 as FIcon,
    MaterialIcons as MIcon,
} from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
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

const renderLyrics = (lyrics: string, showChords: boolean) => {
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
                    <Text style={styles.chordsLine}>{chordsLine}</Text>
                    <Text style={styles.lyricsLine}>{lyricsLine}</Text>
                </View>
            );
        } else {
            const cleanedLine = line.replace(/\[.*?\]/g, "");
            return (
                <Text key={index} style={styles.lyricsLine}>
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
                            text="Lyrics"
                            style={{ ...styles.button, width: buttonWidth }}
                            fontSize={15}
                            icon={<MIcon name="lyrics" size={18} />}
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
                                    text="Chords"
                                    icon={
                                        <FIcon name="itunes-note" size={18} />
                                    }
                                />
                                <View style={{ width: 10 }} />
                            </>
                        )}
                    </View>
                )}
                {value === "lyrics" && song.lyrics && (
                    <ScrollView style={styles.lyrics} bottom={10} top={10}>
                        {renderLyrics(song.lyrics, false)}
                    </ScrollView>
                )}
                {value === "chords" && song.lyrics && (
                    <ScrollView style={styles.lyrics} bottom={7} top={10}>
                        {renderLyrics(song.lyrics, true)}
                    </ScrollView>
                )}
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
        color: "red",
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
