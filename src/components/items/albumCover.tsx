import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { AlbumType, DataContext } from "../../context/data";
import { HistoryContext } from "../../context/history";
import { LanguageContext } from "../../context/language";
import { RecentContext } from "../../context/recent";
import { ThemeContext } from "../../context/theme";
import AnimatedTouchable from "../wrapers/animatedTouchable";
import Text from "../wrapers/text";
import AlbumImage from "./albumImage";

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
    const { language } = useContext(LanguageContext);
    const { updateDate } = useContext(DataContext);

    const width: any = fullWidth
        ? "100%"
        : Dimensions.get("screen").width / 2 - 25;

    if (album === null) return null;

    return (
        <AnimatedTouchable
            onLongPress={onLongPress}
            onPress={() => {
                navigation.navigate("Album", { id: album.id });

                if (album.id !== "F") addToRecent(album);

                updateDate(album.id);

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
                <AlbumImage vertical={vertical} cover={album.cover} />
                <View
                    style={[
                        styles.textContainer,
                        {
                            width: !fullWidth ? width - 80 : "auto",
                            marginTop: vertical ? 5 : 0,
                        },
                    ]}>
                    <Text bold fontSize={14} center={vertical}>
                        {album.id !== "F"
                            ? album.title
                            : language === "en"
                            ? album.title
                            : "Cântece favorite"}
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
        paddingBottom: 8,
    },
    textContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
});
