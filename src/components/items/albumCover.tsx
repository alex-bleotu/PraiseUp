import React, { useContext } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { AlbumType } from "../../context/data";
import { HistoryContext } from "../../context/history";
import { RecentContext } from "../../context/recent";
import { getTheme } from "../../utils/theme";
import AnimatedTouchable from "../wrapers/animatedTouchable";
import Text from "../wrapers/text";

interface AlbumCoverProps {
    album: AlbumType;
    navigation: any;
    fullWidth?: boolean;
    wasSearched?: boolean;
}

const AlbumCover = ({
    album,
    navigation,
    fullWidth,
    wasSearched,
}: AlbumCoverProps) => {
    const { addToHistory } = useContext(HistoryContext);
    const { addToRecent } = useContext(RecentContext);

    const theme = getTheme();
    const width: any = fullWidth
        ? "100%"
        : Dimensions.get("screen").width / 2 - 25;

    if (album === null) return null;

    return (
        <AnimatedTouchable
            onPress={() => {
                navigation.navigate("Album Page", { album });
                addToRecent(album);

                if (wasSearched) addToHistory(album);
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
                        {album.title}
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
