import { FontAwesome6 as FAIcons } from "@expo/vector-icons";
import { t } from "@lingui/macro";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, ScrollView as SV, View } from "react-native";
import AlbumCover from "../components/items/albumCover";
import AnimatedTouchable from "../components/wrapers/animatedTouchable";
import DataBottomSheet from "../components/wrapers/dataBottomSheet";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { ConstantsContext } from "../context/constants";
import { AlbumType, DataContext, SongType } from "../context/data";
import { RefreshContext } from "../context/refresh";
import { ThemeContext } from "../context/theme";
import Loading from "./loading";

const Library = ({ navigation }: { navigation: any }) => {
    const { theme } = useContext(ThemeContext);
    const { refresh } = useContext(RefreshContext);
    const { loading, getFavoriteSongsAlbum, getFavoriteAlbums } =
        useContext(DataContext);
    const { sortBy, setSortBy, display, setDisplay } =
        useContext(ConstantsContext);

    const [albums, setAlbums] = useState<any>(null);

    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [currentData, setCurrentData] = useState<SongType | AlbumType | null>(
        null
    );

    useEffect(() => {
        if (!loading) {
            const loadAndSort = async () => {
                const favoriteAlbum = await getFavoriteSongsAlbum();
                const albums = await getFavoriteAlbums();

                const buttonAlbum = {
                    id: "B",
                    title: "",
                    songs: [],
                    favorite: false,
                };

                let combinedAlbums =
                    favoriteAlbum.songs.length > 0
                        ? [favoriteAlbum, ...albums, buttonAlbum]
                        : [...albums, buttonAlbum];

                combinedAlbums = sortAlbums(combinedAlbums);

                setAlbums(combinedAlbums);
            };

            loadAndSort();
        }
    }, [loading, refresh, sortBy]);

    const sortAlbums = (albumsList: AlbumType[]) => {
        const favorite = albumsList.find((album) => album.id === "F");
        const button = albumsList.find((album) => album.id === "B");
        const rest = albumsList.filter(
            (album) => album.id !== "F" && album.id !== "B"
        );

        if (sortBy === "date") {
            rest.sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            );
        } else rest.sort((a, b) => a.title.localeCompare(b.title));

        return favorite ? [favorite, ...rest, button] : [...rest, button];
    };

    useEffect(() => {
        if (albums) {
            const sortedAlbums = sortAlbums(albums);
            setAlbums(sortedAlbums);
        }
    }, [sortBy]);

    return (
        <StackPage
            title={t`Your library`}
            back={false}
            icon={"cog"}
            action={() => {
                navigation.navigate("Settings");
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
                {albums !== null ? (
                    display === "grid" ? (
                        <View style={styles.scrollContainer}>
                            <SV
                                contentContainerStyle={styles.grid}
                                showsVerticalScrollIndicator={false}>
                                {albums.map(
                                    (data: AlbumType, index: number) => {
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
                                                {data.id === "B" ? (
                                                    <AnimatedTouchable
                                                        onPress={() => {}}
                                                        style={[
                                                            styles.addGrid,
                                                            {
                                                                backgroundColor:
                                                                    theme.colors
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
                                                    <AlbumCover
                                                        key={data.id}
                                                        album={data}
                                                        navigation={navigation}
                                                        vertical
                                                        onLongPress={() => {
                                                            if (data.id === "F")
                                                                return;

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
                                {albums.map((data: AlbumType) => {
                                    return (
                                        <View
                                            key={data.id}
                                            style={{ marginBottom: 15 }}>
                                            {data.id === "B" ? (
                                                <AnimatedTouchable
                                                    onPress={() => {}}>
                                                    <View
                                                        style={[
                                                            styles.addList,
                                                            {
                                                                backgroundColor:
                                                                    theme.colors
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
                                                                    theme.colors
                                                                        .text
                                                                }
                                                            />
                                                            <Text
                                                                fontSize={14}
                                                                bold
                                                                style={{
                                                                    marginLeft: 28,
                                                                }}>
                                                                {t`Create album`}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </AnimatedTouchable>
                                            ) : (
                                                <AlbumCover
                                                    key={data.id}
                                                    album={data}
                                                    navigation={navigation}
                                                    fullWidth
                                                    icon={
                                                        data.id === "F"
                                                            ? "pin"
                                                            : "dots-vertical"
                                                    }
                                                    onLongPress={() => {
                                                        if (data.id !== "F") {
                                                            setCurrentData(
                                                                data
                                                            );
                                                            setBottomSheetOpen(
                                                                true
                                                            );
                                                        }
                                                    }}
                                                    action={() => {
                                                        if (data.id !== "F") {
                                                            setCurrentData(
                                                                data
                                                            );
                                                            setBottomSheetOpen(
                                                                true
                                                            );
                                                        }
                                                    }}
                                                />
                                            )}
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    )
                ) : (
                    <Loading background={false} />
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

export default Library;

const styles = StyleSheet.create({
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
    container: {
        flex: 1,
        marginHorizontal: 10,
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
    addGrid: {
        borderRadius: 15,
        width: 94,
        height: 125,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
});
