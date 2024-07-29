import React, { useContext, useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { AlbumType, DataContext } from "../../context/data";
import { HistoryContext } from "../../context/history";
import { RecentContext } from "../../context/recent";
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
    const { getById } = useContext(DataContext);

    const [album, setAlbum] = useState<AlbumType | null>(null);

    const theme = getTheme();
    const width: any = fullWidth
        ? "100%"
        : Dimensions.get("screen").width / 2 - 25;

    useEffect(() => {
        const load = async () => {
            const song = await getById(id);

            setAlbum(song);
        };

        load();
    }, []);

    if (album === null) return null;

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
