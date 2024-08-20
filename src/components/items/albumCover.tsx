import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { AlbumType } from "../../context/data";
import { HistoryContext } from "../../context/history";
import { RecentContext } from "../../context/recent";
import { ThemeContext } from "../../context/theme";
import AnimatedTouchable from "../wrapers/animatedTouchable";
import Text from "../wrapers/text";

interface AlbumCoverProps {
    album: AlbumType;
    navigation: any;
    fullWidth?: boolean;
    wasSearched?: boolean;
    vertical?: boolean;
    icon?: keyof typeof MCIcons.glyphMap;
    action?: () => void;
    onLongPress?: () => void;
}

const AlbumCover = ({
    album,
    navigation,
    fullWidth,
    wasSearched,
    vertical = false,
    icon,
    action,
    onLongPress,
}: AlbumCoverProps) => {
    const { addToHistory } = useContext(HistoryContext);
    const { addToRecent } = useContext(RecentContext);
    const { theme } = useContext(ThemeContext);

    const width: any = fullWidth
        ? "100%"
        : Dimensions.get("screen").width / 2 - 25;

    if (album === null) return null;

    return (
        <AnimatedTouchable
            onLongPress={onLongPress}
            onPress={() => {
                navigation.navigate("AlbumPage", { id: album.id });
                addToRecent(album);

                if (wasSearched) addToHistory(album);
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
                    style={vertical ? styles.imageVertical : styles.image}
                />
                <View
                    style={[
                        styles.textContainer,
                        { width: !fullWidth ? width - 80 : "auto" },
                    ]}>
                    <Text bold size={14} center={vertical}>
                        {album.title}
                    </Text>
                </View>
            </View>
            {action && (
                <AnimatedTouchable
                    style={{ position: "absolute", right: 15, top: -46 }}
                    onPress={() => action()}>
                    <MCIcons name={icon} size={24} color={theme.colors.text} />
                </AnimatedTouchable>
            )}
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
    containerVertical: {
        borderRadius: 15,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 5,
        paddingBottom: 8,
    },
    textContainer: {
        display: "flex",
        flexDirection: "column",
        marginHorizontal: 8,
        justifyContent: "center",
    },
    imageVertical: {
        width: 90,
        height: 90,
        borderRadius: 15,
    },
    image: { width: 70, height: 70, borderRadius: 15 },
});
