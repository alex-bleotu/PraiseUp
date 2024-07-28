import React, { useContext } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { HistoryContext } from "../../context/history";
import { RecentContext } from "../../context/recent";
import { getSongById } from "../../utils/data";
import { getTheme } from "../../utils/theme";
import AnimatedTouchable from "../wrapers/animatedTouchable";
import Text from "../wrapers/text";

interface AlbumCoverProps {
    id: string;
    navigation: any;
    fullWidth?: boolean;
    wasSearched?: boolean;
}

const AlbumCover = ({
    id,
    navigation,
    fullWidth,
    wasSearched,
}: AlbumCoverProps) => {
    const { addSongToHistory } = useContext(HistoryContext);
    const { addSongToRecent } = useContext(RecentContext);

    const album = getSongById(id);

    const theme = getTheme();
    const width: any = fullWidth
        ? "100%"
        : Dimensions.get("screen").width / 2 - 25;

    if (!album) return null;

    return (
        <AnimatedTouchable
            onPress={() => {
                navigation.navigate("Album Page", { id });
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
                <View
                    style={[
                        styles.textContainer,
                        { width: !fullWidth ? width - 80 : "auto" },
                    ]}>
                    <Text bold size={14}>
                        {album.name}
                    </Text>
                </View>
            </View>
        </AnimatedTouchable>
    );
};

export default AlbumCover;

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
