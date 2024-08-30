import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { DataContext, SongType } from "../../context/data";
import { HistoryContext } from "../../context/history";
import { RecentContext } from "../../context/recent";
import { ThemeContext } from "../../context/theme";
import { getImage } from "../../utils/covers";
import AnimatedTouchable from "../wrapers/animatedTouchable";
import Text from "../wrapers/text";

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

    const width = fullWidth ? "100%" : Dimensions.get("screen").width / 2 - 25;

    if (song === null) return null;

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
                        backgroundColor: theme.colors.paper,
                    },
                ]}>
                <Image
                    source={getImage(song.cover)}
                    style={vertical ? styles.imageVertical : styles.image}
                />
                {
                    <View
                        style={[
                            styles.textContainer,
                            { marginTop: vertical ? 5 : 0 },
                        ]}>
                        <Text bold fontSize={14} center={vertical}>
                            {song.title}
                        </Text>
                        {artist && (
                            <Text fontSize={12} center={vertical}>
                                {song.artist}
                            </Text>
                        )}
                    </View>
                }
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
    },
    containerVertical: {
        borderRadius: 12,
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
    imageVertical: {
        width: 95,
        height: 95,
        borderRadius: 12,
    },
    image: { width: 70, height: 70, borderRadius: 15, marginRight: 8 },
});
