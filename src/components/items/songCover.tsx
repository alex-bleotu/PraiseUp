import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import { t } from "@lingui/macro";
import React, { useContext, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { DataContext, SongType } from "../../context/data";
import { HistoryContext } from "../../context/history";
import { RecentContext } from "../../context/recent";
import { ThemeContext } from "../../context/theme";
import AnimatedTouchable from "../wrapers/animatedTouchable";
import Text from "../wrapers/text";
import SongImage from "./songImage";

interface SongCoverProps {
    song: SongType;
    navigation: any;
    fullWidth?: boolean;
    wasSearched?: boolean;
    artist?: boolean;
    vertical?: boolean;
    icon?: keyof typeof MCIcons.glyphMap;
    action?: () => void;
    onLongPress?: () => void;
    disabled?: boolean;
}

const SongCover = ({
    song,
    navigation,
    fullWidth,
    wasSearched,
    artist = true,
    vertical = false,
    icon,
    disabled,
    action,
    onLongPress,
}: SongCoverProps) => {
    const { addToHistory } = useContext(HistoryContext);
    const { addToRecent } = useContext(RecentContext);
    const { updateDate } = useContext(DataContext);
    const { theme } = useContext(ThemeContext);

    const width = useMemo(
        () => (fullWidth ? "100%" : Dimensions.get("screen").width / 2 - 25),
        [fullWidth]
    );
    const verticalWidth = useMemo(
        () => Math.min((Dimensions.get("screen").width - 55) / 3, 160),
        []
    );

    if (song === null) return null;

    const songImage = useMemo(
        () => (
            <SongImage
                vertical={vertical}
                cover={song.cover}
                title={song.title}
                id={song.id}
                width={vertical ? verticalWidth : 70}
            />
        ),
        [song.cover, song.title, song.id, vertical, verticalWidth]
    );

    const textContent = useMemo(() => {
        if (vertical) {
            return (
                <View
                    style={[
                        styles.textContainer,
                        { marginTop: 5, width: verticalWidth },
                    ]}>
                    <Text
                        bold
                        fontSize={13}
                        center={vertical}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {song.title}
                    </Text>
                </View>
            );
        }
        return (
            <View
                style={[
                    styles.textContainer,
                    { marginLeft: 10, marginRight: 40 },
                ]}>
                <Text
                    bold
                    fontSize={16}
                    center={vertical}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {song.title}
                </Text>
                <Text
                    fontSize={14}
                    center={vertical}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {song.artist ? song.artist : t`Unknown Artist`}
                </Text>
            </View>
        );
    }, [song.title, song.artist, artist, vertical, verticalWidth]);

    return (
        <AnimatedTouchable
            disabledWithoutOpacity={disabled}
            onLongPress={onLongPress}
            onPress={() => {
                if (disabled) return;

                navigation.navigate("Song", { song });

                addToRecent(song);

                updateDate(song.id);

                if (wasSearched) addToHistory(song);
            }}>
            <View
                style={[
                    vertical ? styles.containerVertical : styles.container,
                    {
                        width: vertical ? "100%" : width,
                        backgroundColor: vertical
                            ? "transparent"
                            : theme.colors.paper,
                    },
                ]}>
                {songImage}
                {textContent}
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

export default SongCover;

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        display: "flex",
        flexDirection: "row",
        paddingRight: 8,
    },
    containerVertical: {
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: 8,
    },
    textContainer: {
        flexDirection: "column",
        justifyContent: "center",
        flexShrink: 1,
    },
});
