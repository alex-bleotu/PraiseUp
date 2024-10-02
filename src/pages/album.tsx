import { FontAwesome6 as FAIcons } from "@expo/vector-icons";
import { t } from "@lingui/macro";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    ScrollView as SV,
    View,
} from "react-native";
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
    const { album: a, id } = route.params;

    const { refresh, updateRefresh } = useContext(RefreshContext);
    const {
        getSongById,
        getPersonalAlbumById,
        getFavoriteSongsAlbum,
        getAlbumById,
        getNotOwnedPersonalAlbum,
    } = useContext(DataContext);
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

    const buttonWidth = Math.min(
        (Dimensions.get("screen").width - 55) / 3,
        160
    );
    const horizontalMargin =
        Dimensions.get("screen").width > 400
            ? (Dimensions.get("screen").width - buttonWidth * 3 - 120) / 2
            : (Dimensions.get("screen").width - buttonWidth * 3 - 32) / 2;

    useEffect(() => {
        if (album) return;

        if (id) {
            const load = async () => {
                let album;

                if (id.startsWith("P")) {
                    album = await getPersonalAlbumById(id);

                    if (album === null) {
                        album = await getNotOwnedPersonalAlbum(id);
                    }
                } else if (id.startsWith("A")) album = await getAlbumById(id);

                if (album) {
                    setAlbum(album);
                    updateRefresh();
                }
            };

            load();
        }
    }, []);

    useEffect(() => {
        const load = async () => {
            let loaded: SongType[] = [];

            if (album?.type === "personal") {
                const personalAlbum = await getPersonalAlbumById(album.id);
                setAlbum(personalAlbum);

                if (personalAlbum !== null)
                    for (let i = 0; i < personalAlbum.songs.length; i++) {
                        const song = await getSongById(personalAlbum.songs[i]);
                        if (song) loaded.push(song);
                    }
            } else if (album) {
                if (album?.type === "favorite") {
                    const favorite = await getFavoriteSongsAlbum();
                    if (favorite !== null)
                        for (let i = 0; i < favorite.songs.length; i++) {
                            const song = await getSongById(favorite.songs[i]);
                            if (song) loaded.push(song);
                        }
                } else {
                    for (let i = 0; i < album.songs.length; i++) {
                        const song = await getSongById(album.songs[i]);
                        if (song) loaded.push(song);
                    }
                }
            }

            const buttonSong: SongType = {
                id: "B",
                type: "extra",
                title: "",
                artist: "",
                cover: null,
                lyrics: "",
                favorite: false,
                date: "",
                order: null,
                initialChord: null,
            };

            setSongs([...loaded, buttonSong]);
        };

        load();
    }, [refresh]);

    const sortSongs = (songsList: SongType[]) => {
        const button = songsList.find((song) => song?.type === "extra");
        const rest = songsList.filter((song) => song?.type !== "extra");

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

    const sortedSongs = useMemo(() => {
        if (songs) {
            return sortSongs(songs);
        }
        return [];
    }, [songs, sortBy]);

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
                                    : t`Alphabetical`}
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
                    sortedSongs.length > 1 ? (
                        display === "grid" ? (
                            <View style={styles.scrollContainer}>
                                <SV
                                    contentContainerStyle={styles.grid}
                                    showsVerticalScrollIndicator={false}>
                                    <View style={styles.gridContent}>
                                        {sortedSongs.map(
                                            (data: any, index: number) => {
                                                if (
                                                    data.type === "extra" &&
                                                    album.type === "favorite"
                                                )
                                                    return null;

                                                return (
                                                    <View
                                                        key={data.id}
                                                        style={[
                                                            styles.item,
                                                            {
                                                                marginHorizontal:
                                                                    (index -
                                                                        1) %
                                                                        3 ==
                                                                    0
                                                                        ? horizontalMargin
                                                                        : 0,
                                                            },
                                                        ]}>
                                                        {data.type ===
                                                        "extra" ? (
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
                                                                        width: buttonWidth,
                                                                        height: buttonWidth,
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
                                                                        theme
                                                                            .colors
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
                                    </View>
                                </SV>
                            </View>
                        ) : (
                            <View style={styles.container}>
                                <ScrollView bottom={5} showScroll={false}>
                                    {sortedSongs.map((data: any) => {
                                        if (
                                            data.type === "extra" &&
                                            album.type === "favorite"
                                        )
                                            return null;

                                        return (
                                            <View
                                                key={data.id}
                                                style={{ marginBottom: 10 }}>
                                                {data.type === "extra" ? (
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
                                                                        15
                                                                    }
                                                                    color={
                                                                        theme
                                                                            .colors
                                                                            .text
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
                                                    <View key={data.id}>
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
                            {album.type === "personal" ? (
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
                                        color={theme.colors.textOnPrimary}
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
                            marginTop: -50,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flex: 1,
                        }}>
                        <ActivityIndicator
                            size="large"
                            color={theme.colors.primary}
                        />
                    </View>
                )}
            </View>
            <DataBottomSheet
                data={currentData}
                isOpen={isBottomSheetOpen}
                removeSong={album.type === "personal"}
                onClose={() => {
                    setBottomSheetOpen(false);
                    setCurrentData(null);
                }}
                extraActions={() => {
                    try {
                        navigation.goBack();
                    } catch {
                        navigation.navigate("Home");
                    }
                }}
                updateData={(newAlbum: AlbumType) => {
                    if (
                        newAlbum === null ||
                        (newAlbum.songs.length === 0 &&
                            newAlbum.type === "favorite")
                    )
                        try {
                            navigation.goBack();
                        } catch {
                            navigation.navigate("Home");
                        }

                    setAlbum(newAlbum);
                }}
                extraData={album}
                extraActions2={() => {
                    setBottomSheetOpen(false);
                    navigation.navigate("AddToAlbum", {
                        currentData,
                    });
                }}
            />
        </StackPage>
    );
};

export default Album;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    sortButton: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 5,
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
        paddingHorizontal: 5,
    },
    grid: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        paddingBottom: 10,
        alignSelf: "center",
    },
    gridContent: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        marginLeft: 10,
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
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 22,
        height: 70,
    },
    textContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: -3,
    },
    addGrid: {
        borderRadius: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
});
