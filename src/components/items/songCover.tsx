import React, { useContext } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { SongType } from "../../context/data";
import { HistoryContext } from "../../context/history";
import { RecentContext } from "../../context/recent";
import { getTheme } from "../../utils/theme";
import AnimatedTouchable from "../wrapers/animatedTouchable";
import Text from "../wrapers/text";

interface SongCoverProps {
    song: SongType;
    navigation: any;
    fullWidth?: boolean;
    wasSearched?: boolean;
    artist?: boolean;
    vertical?: boolean;
}

const SongCover = ({
    song,
    navigation,
    fullWidth,
    wasSearched,
    artist = true,
    vertical = false,
}: SongCoverProps) => {
    const { addToHistory } = useContext(HistoryContext);
    const { addToRecent } = useContext(RecentContext);

    const theme = getTheme();
    const width = fullWidth ? "100%" : Dimensions.get("screen").width / 2 - 25;

    if (song === null) return null;

    return (
        <AnimatedTouchable
            onPress={() => {
                navigation.navigate("Song Page", { song });
                addToRecent(song);

                if (wasSearched) addToHistory(song);
            }}>
            <View
                style={[
                    vertical ? styles.containerVertical : styles.container,
                    {
                        width: vertical ? "100%" : width,
                        backgroundColor: theme.colors.paper,
                    },
                ]}>
                <Image
                    source={require("../../../assets/images/songCover.png")}
                    style={{ width: 70, height: 70, borderRadius: 15 }}
                />
                <View style={styles.textContainer}>
                    <Text bold size={14} center={vertical}>
                        {song.title}
                    </Text>
                    {artist && (
                        <Text size={12} center={vertical}>
                            {song.artist}
                        </Text>
                    )}
                </View>
            </View>
        </AnimatedTouchable>
    );
};

export default SongCover;

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        display: "flex",
        flexDirection: "row",
    },
    containerVertical: {
        borderRadius: 15,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 5,
    },
    textContainer: {
        display: "flex",
        flexDirection: "column",
        marginHorizontal: 8,
        justifyContent: "center",
    },
});
