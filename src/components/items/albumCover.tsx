import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { AlbumType, DataContext, SongType } from "../../context/data";
import { HistoryContext } from "../../context/history";
import { LanguageContext } from "../../context/language";
import { RecentContext } from "../../context/recent";
import { ThemeContext } from "../../context/theme";
import { getImage } from "../../utils/images";
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
    const { language } = useContext(LanguageContext);
    const { updateDate, getSongById } = useContext(DataContext);

    const [songs, setSongs] = useState<SongType[] | null>(null);

    const width: any = fullWidth
        ? "100%"
        : Dimensions.get("screen").width / 2 - 25;

    useEffect(() => {
        const load = async () => {
            const songList = album.songs.slice(0, 4);

            const songArray: SongType[] = [];

            for (let i = 0; i < songList.length; i++) {
                const song = await getSongById(songList[i]);

                songArray.push(song);
            }

            setSongs(songArray);
        };

        load();
    }, []);

    if (album === null || songs === null) return null;

    return (
        <AnimatedTouchable
            onLongPress={onLongPress}
            onPress={() => {
                navigation.navigate("AlbumPage", { id: album.id });

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
                {(album.cover === null || album.cover === "none") &&
                songs.length > 2 ? (
                    <View
                        style={{
                            marginRight: vertical ? 0 : 8,
                        }}>
                        <View style={styles.row}>
                            <Image
                                source={getImage(songs[0].cover)}
                                style={[
                                    vertical
                                        ? styles.smallImageVertical
                                        : styles.smallImage,
                                    {
                                        borderTopLeftRadius: 12,
                                    },
                                ]}
                            />
                            <Image
                                source={getImage(songs[1].cover)}
                                style={[
                                    vertical
                                        ? styles.smallImageVertical
                                        : styles.smallImage,
                                    {
                                        borderTopRightRadius: 12,
                                    },
                                ]}
                            />
                        </View>
                        <View style={styles.row}>
                            <Image
                                source={getImage(songs[2].cover)}
                                style={[
                                    vertical
                                        ? styles.smallImageVertical
                                        : styles.smallImage,
                                    {
                                        borderBottomLeftRadius: 12,
                                    },
                                ]}
                            />
                            <Image
                                source={getImage(songs[3].cover)}
                                style={[
                                    vertical
                                        ? styles.smallImageVertical
                                        : styles.smallImage,
                                    {
                                        borderBottomRightRadius: 12,
                                    },
                                ]}
                            />
                        </View>
                    </View>
                ) : (
                    <Image
                        source={
                            album.cover === "none" || album.cover === null
                                ? getImage(songs[0].cover)
                                : getImage(album.cover)
                        }
                        style={vertical ? styles.imageVertical : styles.image}
                    />
                )}
                <View
                    style={[
                        styles.textContainer,
                        {
                            width: !fullWidth ? width - 80 : "auto",
                            marginTop: vertical ? 5 : 0,
                        },
                    ]}>
                    <Text bold size={14} center={vertical}>
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
    imageVertical: {
        width: 95,
        height: 95,
        borderRadius: 12,
    },
    image: { width: 70, height: 70, borderRadius: 15 },

    smallImageVertical: {
        width: 47.5,
        height: 47.5,
    },
    smallImage: { width: 35, height: 35 },
    row: {
        display: "flex",
        flexDirection: "row",
    },
});
