import React, { useContext } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { HistoryContext } from "../../context/history";
import { RecentContext } from "../../context/recent";
import { getSongById } from "../../utils/data";
import { getTheme } from "../../utils/theme";
import AnimatedTouchable from "../wrapers/animatedTouchable";
import Text from "../wrapers/text";

interface SongCoverProps {
    id: string;
    navigation: any;
    fullWidth?: boolean;
    wasSearched?: boolean;
}

const SongCover = ({
    id,
    navigation,
    fullWidth,
    wasSearched,
}: SongCoverProps) => {
    const { addSongToHistory } = useContext(HistoryContext);
    const { addSongToRecent } = useContext(RecentContext);

    const song = getSongById(id);

    const theme = getTheme();
    const width = fullWidth ? "100%" : Dimensions.get("screen").width / 2 - 25;

    if (!song) return null;

    return (
        <AnimatedTouchable
            onPress={() => {
                navigation.navigate("Song Page", { id });
                addSongToRecent(id);

                if (wasSearched) addSongToHistory(id);
            }}>
            <View
                style={[
                    styles.container,
                    { width, backgroundColor: theme.colors.paper },
                ]}>
                <Image
                    source={require("../../../assets/images/songCover.png")}
                    style={{ width: 70, height: 70, borderRadius: 15 }}
                />
                <View style={styles.textContainer}>
                    <Text bold size={14}>
                        {song.name}
                    </Text>
                    <Text size={12}>{song.artist}</Text>
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
    textContainer: {
        display: "flex",
        flexDirection: "column",
        marginHorizontal: 8,
        justifyContent: "center",
    },
});
