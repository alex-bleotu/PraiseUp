import { FontAwesome6 as FAIcons } from "@expo/vector-icons";
import { t } from "@lingui/macro";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, ScrollView as SV, View } from "react-native";
import SongCover from "../components/items/songCover";
import AnimatedTouchable from "../components/wrapers/animatedTouchable";
import DataBottomSheet from "../components/wrapers/dataBottomSheet";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { AlbumType, DataContext, SongType } from "../context/data";
import { LanguageContext } from "../context/language";
import { RefreshContext } from "../context/refresh";
import { ThemeContext } from "../context/theme";
import Loading from "./loading";

interface AlbumProps {
    route: any;
    navigation: any;
}

const Album = ({ route, navigation }: AlbumProps) => {
    const { id } = route.params;
    const { refresh } = useContext(RefreshContext);
    const { getSongById, getFavoriteSongsAlbum, getAlbumById } =
        useContext(DataContext);
    const { language } = useContext(LanguageContext);
    const { theme } = useContext(ThemeContext);

    const [songs, setSongs] = useState<any>(null);

    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [currentData, setCurrentData] = useState<AlbumType | SongType | null>(
        null
    );
    const [album, setAlbum] = useState<AlbumType | null>(null);
    const [sortBy, setSortBy] = useState<"date" | "name">("date");
    const [display, setDisplay] = useState<"grid" | "list">("grid");

    useEffect(() => {
        const load = async () => {
            let album;

            if (id === "F") album = await getFavoriteSongsAlbum();
            else album = await getAlbumById(id);

            setAlbum(album);

            let loaded: SongType[] = [];

            for (let i = 0; i < album.songs.length; i++) {
                const song = await getSongById(album.songs[i]);
                if (song) loaded.push(song);
            }

            const sortedSongs = sortSongs(loaded);
            setSongs(sortedSongs);
        };

        load();
    }, [refresh]);

    const sortSongs = (songsList: SongType[]) => {
        if (sortBy === "date") {
            songsList.sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            );
        } else {
            songsList.sort((a, b) => a.title.localeCompare(b.title));
        }

        return songsList;
    };

    useEffect(() => {
        if (songs) {
            const sortedSongs = sortSongs([...songs]);
            setSongs(sortedSongs);
        }
    }, [sortBy]);

    if (album === null || songs === null) return <Loading />;

    return (
        <StackPage
            navigation={navigation}
            title={
                album.id !== "F"
                    ? album.title
                    : language === "en"
                    ? album.title
                    : "Cântece favorite"
            }
            icon={album.id !== "F" ? "dots-vertical" : undefined}
            action={() => {
                setCurrentData(album);
                setBottomSheetOpen(true);
            }}>
            <View style={styles.container}>
                <View style={styles.top}>
                    <AnimatedTouchable
                        onPress={() => {
                            setSortBy(sortBy === "date" ? "name" : "date");
                        }}
                        style={styles.sortButton}>
                        <View style={styles.row}>
                            <FAIcons
                                name="sort"
                                size={20}
                                color={theme.colors.text}
                                style={{ marginRight: 10 }}
                            />
                            <Text bold>
                                {sortBy === "date"
                                    ? t`Recent`
                                    : t`Alphabetical
                            `}
                            </Text>
                        </View>
                    </AnimatedTouchable>
                    <AnimatedTouchable
                        onPress={() => {
                            setDisplay(display === "grid" ? "list" : "grid");
                        }}
                        style={styles.sortButton}>
                        {display === "grid" ? (
                            <FAIcons
                                name="border-all"
                                size={20}
                                color={theme.colors.text}
                            />
                        ) : (
                            <FAIcons
                                name="list"
                                size={20}
                                color={theme.colors.text}
                            />
                        )}
                    </AnimatedTouchable>
                </View>
                {/* <ScrollView bottom={10}>
                    {songs.map((song: SongType) => {
                        if (!song) return null;

                        return (
                            <View key={song.id} style={styles.songs}>
                                <SongCover
                                    key={song.id}
                                    song={song}
                                    navigation={navigation}
                                    fullWidth
                                    icon="dots-vertical"
                                    action={() => {
                                        setCurrentData(song);
                                        setBottomSheetOpen(true);
                                    }}
                                    onLongPress={() => {
                                        setCurrentData(song);
                                        setBottomSheetOpen(true);
                                    }}
                                />
                            </View>
                        );
                    })}
                </ScrollView> */}
                {display === "grid" ? (
                    <View style={styles.scrollContainer}>
                        <SV
                            contentContainerStyle={styles.grid}
                            showsVerticalScrollIndicator={false}>
                            {songs.map((data: SongType, index: number) => {
                                return (
                                    <View
                                        key={data.id}
                                        style={[
                                            styles.item,
                                            {
                                                marginHorizontal:
                                                    (index - 1) % 3 == 0
                                                        ? 15
                                                        : 0,
                                            },
                                        ]}>
                                        <SongCover
                                            key={data.id}
                                            song={data}
                                            navigation={navigation}
                                            vertical
                                            artist={false}
                                            onLongPress={() => {
                                                setCurrentData(data);
                                                setBottomSheetOpen(true);
                                            }}
                                        />
                                    </View>
                                );
                            })}
                        </SV>
                    </View>
                ) : (
                    <View style={styles.container}>
                        <ScrollView bottom={5} showScroll={false}>
                            {songs.map((data: SongType) => {
                                return (
                                    <View
                                        key={data.id}
                                        style={{ marginBottom: 15 }}>
                                        <SongCover
                                            key={data.id}
                                            song={data}
                                            navigation={navigation}
                                            fullWidth
                                            icon={"dots-vertical"}
                                            onLongPress={() => {
                                                setCurrentData(data);
                                                setBottomSheetOpen(true);
                                            }}
                                            action={() => {
                                                setCurrentData(data);
                                                setBottomSheetOpen(true);
                                            }}
                                        />
                                    </View>
                                );
                            })}
                        </ScrollView>
                    </View>
                )}
            </View>
            <DataBottomSheet
                data={currentData}
                isOpen={isBottomSheetOpen}
                onClose={() => {
                    setBottomSheetOpen(false);
                }}
            />
        </StackPage>
    );
};

export default Album;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        display: "flex",
        flex: 1,
        paddingHorizontal: 10,
    },
    songs: { marginTop: 15, paddingRight: 25 },
    sortButton: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        margin: 10,
        borderRadius: 10,
    },
    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    top: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    scrollContainer: {
        flex: 1,
        width: "100%",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        marginHorizontal: 10,
        paddingBottom: 10,
    },
    item: {
        marginBottom: 15,
        width: "30%",
    },
});
