import { FontAwesome6 as FAIcons } from "@expo/vector-icons";
import { t } from "@lingui/macro";
import React, { useContext, useEffect, useState } from "react";
import {
    StyleSheet,
    ScrollView as SV,
    TouchableOpacity,
    View,
} from "react-native";
import AlbumCover from "../components/items/albumCover";
import AnimatedTouchable from "../components/wrapers/animatedTouchable";
import BottomSheetModal from "../components/wrapers/bottomSheetModal";
import DataBottomSheet from "../components/wrapers/dataBottomSheet";
import Input from "../components/wrapers/input";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { ConstantsContext } from "../context/constants";
import { AlbumType, DataContext, SongType } from "../context/data";
import { RecentContext } from "../context/recent";
import { RefreshContext } from "../context/refresh";
import { ThemeContext } from "../context/theme";
import Loading from "./loading";

const Library = ({ navigation }: { navigation: any }) => {
    const { theme } = useContext(ThemeContext);
    const { refresh, updateRefresh } = useContext(RefreshContext);
    const {
        loading,
        getFavoriteSongsAlbum,
        getFavoriteAlbums,
        createPersonalAlbum,
        getPersonalAlbums,
    } = useContext(DataContext);
    const { sortBy, setSortBy, display, setDisplay } =
        useContext(ConstantsContext);
    const { addToRecent } = useContext(RecentContext);

    const [albums, setAlbums] = useState<any>(null);

    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [currentData, setCurrentData] = useState<SongType | AlbumType | null>(
        null
    );
    const [isCreateBottomSheetOpen, setIsCreateBottomSheetOpen] =
        useState(false);
    const [name, setName] = useState("");

    useEffect(() => {
        if (!loading) {
            const loadAndSort = async () => {
                const favoriteAlbum = await getFavoriteSongsAlbum();
                const albums = await getFavoriteAlbums();
                const personal = await getPersonalAlbums();

                const buttonAlbum: AlbumType = {
                    id: "B",
                    type: "extra",
                    title: "",
                    creator: "",
                    songs: [],
                    favorite: false,
                    date: "",
                    cover: null,
                };

                let combinedAlbums =
                    favoriteAlbum && favoriteAlbum.songs.length > 0
                        ? [favoriteAlbum, ...personal, ...albums, buttonAlbum]
                        : [...personal, ...albums, buttonAlbum];

                combinedAlbums = sortAlbums(combinedAlbums);

                setAlbums(combinedAlbums);
            };

            loadAndSort();
        }
    }, [loading, refresh, sortBy]);

    const sortAlbums = (albumsList: AlbumType[]) => {
        const favorite = albumsList.find((album) => album.type === "favorite");
        const button = albumsList.find((album) => album.type === "extra");
        const rest = albumsList.filter(
            (album) => album.type !== "favorite" && album.type !== "extra"
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
                                <View style={styles.gridContent}>
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
                                                                    ? 12
                                                                    : 0,
                                                        },
                                                    ]}>
                                                    {data.type === "extra" ? (
                                                        <AnimatedTouchable
                                                            onPress={() => {
                                                                setIsCreateBottomSheetOpen(
                                                                    true
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
                                                        <AlbumCover
                                                            key={data.id}
                                                            album={data}
                                                            navigation={
                                                                navigation
                                                            }
                                                            vertical
                                                            onLongPress={() => {
                                                                if (
                                                                    data.id ===
                                                                    "F"
                                                                )
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
                                </View>
                            </SV>
                        </View>
                    ) : (
                        <View style={styles.container}>
                            <ScrollView bottom={5} showScroll={false}>
                                {albums.map((data: AlbumType) => {
                                    return (
                                        <View
                                            key={data.id}
                                            style={{ marginBottom: 10 }}>
                                            {data.type === "extra" ? (
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
                extraActions2={() => {
                    setBottomSheetOpen(false);
                    navigation.navigate("AddToAlbum", { currentData });
                }}
            />
            <BottomSheetModal
                isOpen={isCreateBottomSheetOpen}
                onClose={() => {
                    setIsCreateBottomSheetOpen(false);
                    setName("");
                }}
                height={225}>
                <View style={styles.bottomSheet}>
                    <Text bold fontSize={20}>
                        {t`Give your album a name`}
                    </Text>
                    <Input
                        placeholder={t`Album Name`}
                        value={name}
                        onChange={setName}
                        style={{ marginTop: 20 }}
                        maxLength={32}
                        autoCapitalize
                    />
                    <View style={styles.buttonContainer}>
                        <View style={{ width: "47%" }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setIsCreateBottomSheetOpen(false);
                                    setName("");
                                }}
                                activeOpacity={theme.activeOpacity}
                                style={[
                                    styles.button,
                                    {
                                        backgroundColor: theme.colors.darkPaper,
                                    },
                                ]}>
                                <Text fontSize={14} bold upper center>
                                    {t`Cancel`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: "47%" }}>
                            <TouchableOpacity
                                onPress={() => {
                                    createPersonalAlbum(name.trim()).then(
                                        (newAlbum: AlbumType) => {
                                            navigation.navigate("Album", {
                                                album: newAlbum,
                                            });
                                            addToRecent(newAlbum);
                                            setIsCreateBottomSheetOpen(false);
                                            setName("");
                                            updateRefresh();
                                        }
                                    );
                                }}
                                activeOpacity={theme.activeOpacity}
                                disabled={name.length === 0}
                                style={[
                                    styles.button,
                                    {
                                        backgroundColor: theme.colors.primary,
                                        opacity: name.length > 0 ? 1 : 0.5,
                                    },
                                ]}>
                                <Text
                                    fontSize={14}
                                    bold
                                    upper
                                    center
                                    color={theme.colors.textInverted}>
                                    {t`Create`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </BottomSheetModal>
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
        paddingHorizontal: 10,
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
    addGrid: {
        borderRadius: 15,
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
    bottomSheet: {
        marginHorizontal: 20,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 12,
        justifyContent: "center",
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
});
