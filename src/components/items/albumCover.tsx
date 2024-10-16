import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import { t } from "@lingui/macro";
import React, { useContext, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { DataContext } from "../../context/data";
import { HistoryContext } from "../../context/history";
import { RecentContext } from "../../context/recent";
import { ThemeContext } from "../../context/theme";
import AnimatedTouchable from "../wrapers/animatedTouchable";
import Text from "../wrapers/text";
import AlbumImage from "./albumImage";

interface AlbumCoverProps {
    album: any;
    navigation: any;
    fullWidth?: boolean;
    wasSearched?: boolean;
    vertical?: boolean;
    icon?: keyof typeof MCIcons.glyphMap;
    disabled?: boolean;
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
    disabled,
    action,
    onLongPress,
}: AlbumCoverProps) => {
    const { addToHistory } = useContext(HistoryContext);
    const { addToRecent } = useContext(RecentContext);
    const { theme } = useContext(ThemeContext);
    const { updateDate } = useContext(DataContext);

    const width = useMemo(() => {
        return fullWidth ? "100%" : Dimensions.get("screen").width / 2 - 25;
    }, [fullWidth]);

    const verticalWidth = useMemo(() => {
        return Math.min((Dimensions.get("screen").width - 55) / 3, 160);
    }, []);

    if (album === null) return null;

    const albumImage = useMemo(
        () => (
            <AlbumImage
                vertical={vertical}
                cover={album.cover}
                width={vertical ? verticalWidth : undefined}
                title={album.title}
                id={album.id}
            />
        ),
        [album.cover, album.title, album.id, vertical, verticalWidth]
    );

    const textContainer = useMemo(
        () => (
            <View
                style={[
                    styles.textContainer,
                    {
                        width: !fullWidth ? width : "auto",
                        marginTop: vertical ? 5 : 0,
                        marginLeft: vertical ? 0 : 8,
                    },
                ]}>
                <Text
                    bold
                    fontSize={vertical ? 13 : 16}
                    center={vertical}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {album.id !== "F" ? album.title : t`Favorite songs`}
                </Text>
                {album.creatorName && !vertical && (
                    <Text
                        fontSize={14}
                        center={vertical}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {album.creatorName}
                    </Text>
                )}
            </View>
        ),
        [album.title, album.creator, fullWidth, vertical, width]
    );

    return (
        <AnimatedTouchable
            disabledWithoutOpacity={disabled}
            onLongPress={onLongPress}
            onPress={() => {
                if (disabled) return;

                navigation.navigate("Album", { album });

                if (album.id !== "F") addToRecent(album);

                updateDate(album.id);

                if (wasSearched) addToHistory(album);
            }}>
            <View
                style={[
                    vertical ? styles.containerVertical : styles.container,
                    {
                        width: vertical ? verticalWidth : width,
                        backgroundColor: vertical
                            ? "transparent"
                            : theme.colors.paper,
                    },
                ]}>
                {albumImage}
                {textContainer}
            </View>

            {action && (
                <AnimatedTouchable
                    style={{ position: "absolute", right: 15, top: -46 }}
                    onPress={action}>
                    <MCIcons name={icon} size={24} color={theme.colors.text} />
                </AnimatedTouchable>
            )}
        </AnimatedTouchable>
    );
};

export default AlbumCover;

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
        marginLeft: 8,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
});
