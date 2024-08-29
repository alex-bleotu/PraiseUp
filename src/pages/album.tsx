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
    const { album } = route.params;

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

    useEffect(() => {
        const load = async () => {
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

    if (album === null || album === undefined) return <Loading />;

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
                {songs ? (
                    songs.length > 0 ? (
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
                                                    <SongCover
                                                        key={data.id}
                                                        song={data}
                                                        navigation={navigation}
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
                                                <SongCover
                                                    key={data.id}
                                                    song={data}
                                                    navigation={navigation}
                                                    fullWidth
                                                    icon={"dots-vertical"}
                                                    onLongPress={() => {
                                                        setCurrentData(data);
                                                        setBottomSheetOpen(
                                                            true
                                                        );
                                                    }}
                                                    action={() => {
                                                        setCurrentData(data);
                                                        setBottomSheetOpen(
                                                            true
                                                        );
                                                    }}
                                                />
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
                                        onPress={() => {}}
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
                onClose={() => {
                    setBottomSheetOpen(false);
                }}
                extraActions={() => {
                    updateRefresh();
                    navigation.goBack();
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
    noSongs: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -75,
    },
});
