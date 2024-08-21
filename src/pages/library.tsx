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
import { AlbumType, DataContext, SongType } from "../context/data";
import { RefreshContext } from "../context/refresh";
import { ThemeContext } from "../context/theme";
import Loading from "./loading";

const Library = ({ navigation }: { navigation: any }) => {
    const { theme } = useContext(ThemeContext);
    const { refresh } = useContext(RefreshContext);
    const {
        loading,
        getRandomSongs,
        getFavoriteSongsAlbum,
        getFavoriteAlbums,
    } = useContext(DataContext);

    const [sortBy, setSortBy] = useState<"date" | "name">("date");
    const [display, setDisplay] = useState<"grid" | "list">("grid");
    const [albums, setAlbums] = useState<AlbumType[] | null>(null);

    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [currentData, setCurrentData] = useState<SongType | AlbumType | null>(
        null
    );

    useEffect(() => {
        if (!loading) {
            const load = async () => {
                const favoriteAlbum = await getFavoriteSongsAlbum();
                const albums = await getFavoriteAlbums();

                if (favoriteAlbum.songs.length > 0)
                    setAlbums([favoriteAlbum, ...albums]);
                else setAlbums(albums);

                setSortBy("date");
            };

            load();
        }
    }, [loading, refresh]);

    useEffect(() => {
        if (currentData) setBottomSheetOpen(true);
    }, [currentData]);

    useEffect(() => {
        const sort = async () => {
            if (albums) {
                const favorite = albums.find((album) => album.id === "F");

                if (favorite) {
                    const rest = albums.filter((album) => album.id !== "F");

                    if (sortBy === "date") {
                        // rest.sort((a, b) => {
                        //     return b.date - a.date;
                        // });
                    } else
                        rest.sort((a, b) => {
                            return a.title.localeCompare(b.title);
                        });

                    setAlbums([favorite, ...rest]);
                } else {
                    if (sortBy === "date") {
                        // albums.sort((a, b) => {
                        //     return b.date - a.date;
                        // });
                    } else
                        albums.sort((a, b) => {
                            return a.title.localeCompare(b.title);
                        });

                    setAlbums(albums);
                }
            }
        };

        sort();
    }, [sortBy]);

    return (
        <StackPage
            title={t`Your library`}
            back={false}
            icon={"cog"}
            action={() => {
                navigation.navigate("SettingsPage");
            }}>
            <View>
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
                        <View
                            style={[
                                styles.container,
                                {
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                },
                            ]}>
                            <View style={{}}>
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
                                                                (index - 1) %
                                                                    3 ==
                                                                0
                                                                    ? 8
                                                                    : 0,
                                                        },
                                                    ]}>
                                                    <AlbumCover
                                                        key={data.id}
                                                        album={data}
                                                        navigation={navigation}
                                                        vertical
                                                        onLongPress={() => {
                                                            setCurrentData(
                                                                data
                                                            );
                                                        }}
                                                    />
                                                </View>
                                            );
                                        }
                                    )}
                                </SV>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.container}>
                            <ScrollView bottom={20} showScroll={false}>
                                {albums.map((data: AlbumType) => {
                                    return (
                                        <View
                                            key={data.id}
                                            style={{ marginBottom: 15 }}>
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
                                                    if (data.id !== "F")
                                                        setCurrentData(data);
                                                }}
                                                action={() => {
                                                    if (data.id !== "F")
                                                        setCurrentData(data);
                                                }}
                                            />
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
        marginHorizontal: 10,
    },
    container: {
        display: "flex",
        flexDirection: "row",
        marginHorizontal: 20,
        marginBottom: 70,
    },
    grid: {
        flexWrap: "wrap",
        flexDirection: "row",
        width: "100%",
        paddingBottom: 40,
        justifyContent: "flex-start",
    },
    item: {
        marginBottom: 15,
    },
});
