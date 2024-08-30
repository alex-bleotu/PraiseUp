import { FontAwesome6 as FAIcons } from "@expo/vector-icons";
import { t } from "@lingui/macro";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, ScrollView as SV, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import SongCover from "../components/items/songCover";
import AnimatedTouchable from "../components/wrapers/animatedTouchable";
import Button from "../components/wrapers/button";
import DataBottomSheet from "../components/wrapers/dataBottomSheet";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { ConstantsContext } from "../context/constants";
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
    const { album: a } = route.params;

    const { refresh, updateRefresh } = useContext(RefreshContext);
    const { getSongById } = useContext(DataContext);
    const { language } = useContext(LanguageContext);
    const { theme } = useContext(ThemeContext);
    const { sortBy, setSortBy, display, setDisplay } =
        useContext(ConstantsContext);

    const [songs, setSongs] = useState<any>(null);

    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [currentData, setCurrentData] = useState<AlbumType | SongType | null>(
        null
    );
    const [album, setAlbum] = useState<AlbumType | null>(a);

    useEffect(() => {
        const load = async () => {
            let loaded: SongType[] = [];

            if (album !== null)
                for (let i = 0; i < album.songs.length; i++) {
                    const song = await getSongById(album.songs[i]);
                    if (song) loaded.push(song);
                }

            const buttonSong: SongType = {
                id: "B",
                title: "",
                artist: "",
                cover: null,
                lyrics: "",
                favorite: false,
                date: "",
                initialChord: null,
            };

            const sortedSongs = sortSongs([...loaded, buttonSong]);

            setSongs(sortedSongs);
        };

        load();
    }, [refresh]);

    const sortSongs = (songsList: SongType[]) => {
        const button = songsList.find((song) => song.id === "B");
        const rest = songsList.filter((song) => song.id !== "B");

        if (sortBy === "date") {
            rest.sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            );
        } else {
            rest.sort((a, b) => a.title.localeCompare(b.title));
        }

        return [...rest, button];
    };

    useEffect(() => {
        if (songs) {
            const sortedSongs = sortSongs([...songs]);
            setSongs(sortedSongs);
        }
    }, [sortBy]);

    if (album === null || album === undefined) return <Loading />;

    return (
        <StackPage
            navigation={navigation}
            title={
                album.id === "F" && language === "ro"
                    ? "Cântece favorite"
                    : album.title
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
                {songs ? (
                    songs.length > 1 ? (
                        display === "grid" ? (
                            <View style={styles.scrollContainer}>
                                <SV
                                    contentContainerStyle={styles.grid}
                                    showsVerticalScrollIndicator={false}>
                                    {songs.map(
                                        (data: SongType, index: number) => {
                                            return (
                                                <View
                                                    key={data.id}
                                                    style={[
                                                        styles.item,
                                                        {
                                                            marginHorizontal:
                                                                (index - 1) %
                                                                    3 ==
                                                                0
                                                                    ? 15
                                                                    : 0,
                                                        },
                                                    ]}>
                                                    {data.id === "B" ? (
                                                        <AnimatedTouchable
                                                            onPress={() => {
                                                                navigation.navigate(
                                                                    "AddSong",
                                                                    {
                                                                        album,
                                                                    }
                                                                );
                                                            }}
                                                            style={[
                                                                styles.addGrid,
                                                                {
                                                                    backgroundColor:
                                                                        theme
                                                                            .colors
                                                                            .paper,
                                                                },
                                                            ]}>
                                                            <FAIcons
                                                                name="plus"
                                                                size={30}
                                                                color={
                                                                    theme.colors
                                                                        .text
                                                                }
                                                            />
                                                        </AnimatedTouchable>
                                                    ) : (
                                                        <SongCover
                                                            key={data.id}
                                                            song={data}
                                                            navigation={
                                                                navigation
                                                            }
                                                            vertical
                                                            artist={false}
                                                            onLongPress={() => {
                                                                setCurrentData(
                                                                    data
                                                                );
                                                                setBottomSheetOpen(
                                                                    true
                                                                );
                                                            }}
                                                        />
                                                    )}
                                                </View>
                                            );
                                        }
                                    )}
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
                                                {data.id === "B" ? (
                                                    <AnimatedTouchable
                                                        onPress={() => {
                                                            navigation.navigate(
                                                                "AddSong",
                                                                {
                                                                    album,
                                                                }
                                                            );
                                                        }}>
                                                        <View
                                                            style={[
                                                                styles.addList,
                                                                {
                                                                    backgroundColor:
                                                                        theme
                                                                            .colors
                                                                            .paper,
                                                                },
                                                            ]}>
                                                            <View
                                                                style={
                                                                    styles.textContainer
                                                                }>
                                                                <FAIcons
                                                                    name="plus"
                                                                    size={30}
                                                                    color={
                                                                        theme
                                                                            .colors
                                                                            .text
                                                                    }
                                                                />
                                                                <Text
                                                                    fontSize={
                                                                        14
                                                                    }
                                                                    bold
                                                                    style={{
                                                                        marginLeft: 28,
                                                                    }}>
                                                                    {t`Add songs`}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </AnimatedTouchable>
                                                ) : (
                                                    <View
                                                        key={data.id}
                                                        style={{
                                                            marginBottom: 15,
                                                        }}>
                                                        <SongCover
                                                            key={data.id}
                                                            song={data}
                                                            navigation={
                                                                navigation
                                                            }
                                                            fullWidth
                                                            icon={
                                                                "dots-vertical"
                                                            }
                                                            onLongPress={() => {
                                                                setCurrentData(
                                                                    data
                                                                );
                                                                setBottomSheetOpen(
                                                                    true
                                                                );
                                                            }}
                                                            action={() => {
                                                                setCurrentData(
                                                                    data
                                                                );
                                                                setBottomSheetOpen(
                                                                    true
                                                                );
                                                            }}
                                                        />
                                                    </View>
                                                )}
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        )
                    ) : (
                        <View style={styles.noSongs}>
                            {album.id.startsWith("P") ? (
                                <>
                                    <Text
                                        bold
                                        center>{t`Let's start building this ablum`}</Text>
                                    <Button
                                        mode="contained"
                                        fullWidth
                                        bold
                                        backgroundColor={theme.colors.primary}
                                        upper
                                        text={t`Add songs`}
                                        onPress={() => {
                                            navigation.navigate("AddSong", {
                                                album,
                                            });
                                        }}
                                        color={theme.colors.textInverted}
                                        fontSize={14}
                                        style={{
                                            marginBottom: 10,
                                            marginTop: 20,
                                        }}
                                    />
                                </>
                            ) : (
                                <Text
                                    bold
                                    center>{t`There are no songs in this album.`}</Text>
                            )}
                        </View>
                    )
                ) : (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <ActivityIndicator
                            animating={true}
                            color={theme.colors.primary}
                            size="large"
                            style={{ marginTop: -100 }}
                        />
                    </View>
                )}
            </View>
            <DataBottomSheet
                data={currentData}
                isOpen={isBottomSheetOpen}
                removeSong={album.id.startsWith("P")}
                onClose={() => {
                    setBottomSheetOpen(false);
                }}
                extraActions={() => {
                    navigation.goBack();
                }}
                updateData={(newAlbum: AlbumType) => {
                    setAlbum(newAlbum);
                }}
                extraData={album}
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
    noSongs: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -75,
    },
    addList: {
        borderRadius: 15,
        width: "100%",
        height: 70,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 22,
    },
    textContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: -3,
    },
    addGrid: {
        borderRadius: 15,
        width: 94,
        height: 125,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
});
