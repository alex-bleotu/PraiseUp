import { FontAwesome6 as FAIcons } from "@expo/vector-icons";
import { t } from "@lingui/macro";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    ScrollView as SV,
    TouchableOpacity,
    View,
} from "react-native";
import AlbumCover from "../components/items/albumCover";
import SkeletonCover from "../components/items/skeletonCover";
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
import { Searchbar as SearchBar } from "react-native-paper";

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

    const [searchVisible, setSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const slideAnim = useRef(new Animated.Value(0)).current;

    const buttonWidth = useMemo(() => {
        return Math.min((Dimensions.get("screen").width - 55) / 3, 160);
    }, []);

    const horizontalMargin = useMemo(() => {
        return Dimensions.get("screen").width > 400
            ? (Dimensions.get("screen").width - buttonWidth * 3 - 120) / 2
            : (Dimensions.get("screen").width - buttonWidth * 3 - 32) / 2;
    }, [buttonWidth]);

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
                    creatorName: "",
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
        const favorite = albumsList.find((album) => album?.type === "favorite");
        const button = albumsList.find((album) => album?.type === "extra");
        const rest = albumsList.filter(
            (album) => album?.type !== "favorite" && album?.type !== "extra"
        );

        const normalizeString = (str: string) =>
            str
                .toLowerCase()
                .replace(/ă/g, "a")
                .replace(/â/g, "a")
                .replace(/î/g, "i")
                .replace(/ș/g, "s")
                .replace(/ț/g, "t");

        const filtered = searchQuery
            ? rest.filter((album) =>
                  normalizeString(album.title).includes(
                      normalizeString(searchQuery)
                  )
              )
            : rest;

        if (sortBy === "date") {
            filtered.sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            );
        } else {
            filtered.sort((a, b) =>
                normalizeString(a.title).localeCompare(normalizeString(b.title))
            );
        }

        return favorite
            ? [favorite, ...filtered, button]
            : [...filtered, button];
    };

    const sortedAlbums = useMemo(() => {
        if (albums) {
            return sortAlbums(albums);
        }
        return albums;
    }, [albums, sortBy, searchQuery]);

    return (
        <StackPage
            title={t`Your library`}
            back={false}
            icon={"cog"}
            action={() => {
                navigation.navigate("Settings");
            }}>
            <View style={styles.container}>
                {searchVisible && (
                    <Animated.View
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1,
                            marginHorizontal: 15,
                            transform: [
                                {
                                    translateY: slideAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-50, 0],
                                    }),
                                },
                            ],
                            opacity: slideAnim,
                        }}>
                        <SearchBar
                            style={{
                                backgroundColor: theme.colors.paper,
                                borderRadius: 12,
                            }}
                            placeholderTextColor={theme.colors.text}
                            iconColor={theme.colors.text}
                            inputStyle={{ color: theme.colors.text }}
                            placeholder={t`Search`}
                            onChangeText={(query) => setSearchQuery(query)}
                            value={searchQuery}
                        />
                    </Animated.View>
                )}
                <Animated.View
                    style={{
                        flex: 1,
                        transform: [
                            {
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 50],
                                }),
                            },
                        ],
                    }}>
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
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                marginRight: 10,
                            }}>
                            <AnimatedTouchable
                                onPress={() => {
                                    setDisplay(
                                        display === "grid" ? "list" : "grid"
                                    );
                                }}
                                style={{ marginRight: 20 }}>
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
                            <AnimatedTouchable
                                style={{ marginRight: 5 }}
                                onPress={() => {
                                    if (!searchVisible) {
                                        setSearchVisible(true);
                                        Animated.timing(slideAnim, {
                                            toValue: 1,
                                            duration: 300,
                                            useNativeDriver: true,
                                        }).start();
                                    } else {
                                        Animated.timing(slideAnim, {
                                            toValue: 0,
                                            duration: 300,
                                            useNativeDriver: true,
                                        }).start(() => setSearchVisible(false));
                                        setSearchQuery("");
                                    }
                                }}>
                                <FAIcons
                                    name={
                                        searchVisible ? "x" : "magnifying-glass"
                                    }
                                    size={20}
                                    color={theme.colors.text}
                                    style={{
                                        marginHorizontal: searchVisible
                                            ? 2.5
                                            : 0,
                                    }}
                                />
                            </AnimatedTouchable>
                        </View>
                    </View>
                    {sortedAlbums !== null ? (
                        display === "grid" ? (
                            <View
                                style={[
                                    styles.scrollContainer,
                                    {
                                        marginLeft:
                                            Dimensions.get("screen").width > 400
                                                ? 15
                                                : 0,
                                    },
                                ]}>
                                <SV
                                    contentContainerStyle={styles.grid}
                                    showsVerticalScrollIndicator={false}>
                                    <View style={styles.gridContent}>
                                        {sortedAlbums.map(
                                            (
                                                data: AlbumType,
                                                index: number
                                            ) => {
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
                                                        {data?.type ===
                                                        "extra" ? (
                                                            <AnimatedTouchable
                                                                onPress={() => {
                                                                    setIsCreateBottomSheetOpen(
                                                                        true
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
                                    {sortedAlbums.map((data: AlbumType) => {
                                        return (
                                            <View
                                                key={data.id}
                                                style={{ marginBottom: 10 }}>
                                                {data?.type === "extra" ? (
                                                    <AnimatedTouchable
                                                        onPress={() => {
                                                            setIsCreateBottomSheetOpen(
                                                                true
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
                                                            if (
                                                                data.id !== "F"
                                                            ) {
                                                                setCurrentData(
                                                                    data
                                                                );
                                                                setBottomSheetOpen(
                                                                    true
                                                                );
                                                            }
                                                        }}
                                                        action={() => {
                                                            if (
                                                                data.id !== "F"
                                                            ) {
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
                    ) : display === "grid" ? (
                        <View
                            style={[
                                styles.scrollContainer,
                                {
                                    marginLeft:
                                        Dimensions.get("screen").width > 400
                                            ? 15
                                            : 0,
                                },
                            ]}>
                            <SV
                                contentContainerStyle={styles.grid}
                                showsVerticalScrollIndicator={false}>
                                <View style={styles.gridContent}>
                                    {Array.from({ length: 4 }).map(
                                        (_, index) => (
                                            <View
                                                key={`skeleton-grid-${index}`}
                                                style={[
                                                    styles.item,
                                                    {
                                                        marginHorizontal:
                                                            (index - 1) % 3 == 0
                                                                ? horizontalMargin
                                                                : 0,
                                                    },
                                                ]}>
                                                <SkeletonCover vertical />
                                            </View>
                                        )
                                    )}
                                </View>
                            </SV>
                        </View>
                    ) : (
                        <View style={styles.container}>
                            <ScrollView bottom={5} showScroll={false}>
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <View
                                        key={`skeleton-list-${index}`}
                                        style={{ marginBottom: 10 }}>
                                        <SkeletonCover fullWidth />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </Animated.View>
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
                }}>
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
                                    color={theme.colors.textOnPrimary}>
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
        marginBottom: 10,
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
