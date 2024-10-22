import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import { t } from "@lingui/macro";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AlbumCover from "../components/items/albumCover";
import SongCover from "../components/items/songCover";
import AnimatedTouchable from "../components/wrapers/animatedTouchable";
import Background from "../components/wrapers/background";
import DataBottomSheet from "../components/wrapers/dataBottomSheet";
import ScrollView from "../components/wrapers/scrollView";
import Text from "../components/wrapers/text";
import { AlbumType, DataContext, SongType } from "../context/data";
import { RecentContext } from "../context/recent";
import { RefreshContext } from "../context/refresh";
import { ThemeContext } from "../context/theme";
import { UserContext } from "../context/user";
import Loading from "./loading";

const Home = ({ navigation }: { navigation: any }) => {
    const { recent } = useContext(RecentContext);
    const {
        getRandomSongs,
        getFavoriteSongsAlbum,
        getFavoriteAlbums,
        getAlbumById,
        getSongById,
    } = useContext(DataContext);
    const { refresh } = useContext(RefreshContext);
    const { user } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);

    const [randomSongs, setRandomSongs] = useState<SongType[] | null>(null);
    const [favoriteAlbums, setFavoriteAlbums] = useState<AlbumType[] | null>(
        null
    );

    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [currentData, setCurrentData] = useState<SongType | AlbumType | null>(
        null
    );

    const [bbsoSongs, setBbsoSongs] = useState<SongType[] | null>(null);
    const [tabaraSongs, setTabaraSongs] = useState<SongType[] | null>(null);

    useEffect(() => {
        const load = async () => {
            const favoriteAlbum = await getFavoriteSongsAlbum();
            const albums = await getFavoriteAlbums();

            if (favoriteAlbum && favoriteAlbum.songs.length > 0)
                setFavoriteAlbums([favoriteAlbum, ...albums]);
            else if (albums.length > 0) setFavoriteAlbums(albums);
            else setFavoriteAlbums([]);

            const songs = await getRandomSongs(10);

            if (songs) setRandomSongs(songs);
            else setRandomSongs([]);

            const bbso = await getAlbumById(
                "A5e7720ae-ccfe-4188-9820-e3290075bd2b"
            );
            if (bbso) {
                let songsList: SongType[] = [];
                for (let i = 0; i < bbso.songs.length; i++) {
                    console.log(bbso.songs[i]);
                    const songData = await getSongById(bbso.songs[i]);
                    if (songData) songsList = [...songsList, songData];
                }
                setBbsoSongs(songsList);
            }

            const tabara = await getAlbumById(
                "A6d43abad-ae19-466a-aa76-003a77e92590"
            );
            if (tabara) {
                let songsList: SongType[] = [];
                for (let i = 0; i < tabara.songs.length; i++) {
                    const songData = await getSongById(tabara.songs[i]);
                    if (songData) songsList = [...songsList, songData];
                }
                setTabaraSongs(songsList);
            }
        };

        load();
    }, []);

    useEffect(() => {
        const load = async () => {
            const favoriteAlbum = await getFavoriteSongsAlbum();
            const albums = await getFavoriteAlbums();

            if (favoriteAlbum && favoriteAlbum.songs.length > 0)
                setFavoriteAlbums([favoriteAlbum, ...albums]);
            else if (albums.length > 0) setFavoriteAlbums(albums);
            else setFavoriteAlbums([]);
        };

        load();
    }, [refresh]);

    if (
        !favoriteAlbums ||
        !randomSongs ||
        !recent ||
        recent.length === 0 ||
        bbsoSongs === null ||
        tabaraSongs === null
    )
        return <Loading text={t`Finishing things`} />;

    return (
        <Background noPadding>
            <View style={styles.topBar}>
                <Text fontSize={26} bold style={{ marginLeft: 5 }}>
                    {user.displayName ? user.displayName : t`Guest`}
                </Text>
                <AnimatedTouchable
                    onPress={() => {
                        navigation.navigate("Settings");
                    }}>
                    <MCIcons name={"cog"} size={30} color={theme.colors.text} />
                </AnimatedTouchable>
            </View>
            <ScrollView bottom={15} showScroll={false}>
                <View style={styles.recent}>
                    {recent.map((data: SongType | AlbumType, index: number) => {
                        if (index > 2) return null;

                        return (
                            <View key={index} style={styles.row}>
                                <View>
                                    {data.type === "song" ? (
                                        <SongCover
                                            song={data}
                                            fullWidth
                                            navigation={navigation}
                                            onLongPress={() => {
                                                setCurrentData(data);
                                                setBottomSheetOpen(true);
                                            }}
                                        />
                                    ) : (
                                        <AlbumCover
                                            album={data}
                                            fullWidth
                                            navigation={navigation}
                                            onLongPress={() => {
                                                setCurrentData(data);
                                                setBottomSheetOpen(true);
                                            }}
                                        />
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>

                {randomSongs.length !== 0 && (
                    <View style={styles.container}>
                        <Text fontSize={20} bold style={{ marginLeft: 20 }}>
                            {t`Suggested for you`}
                        </Text>
                        <View style={styles.songsContainer}>
                            <ScrollView
                                horizontal
                                showScroll={false}
                                top={10}
                                bottom={10}>
                                {randomSongs.map((song: SongType) => (
                                    <View
                                        key={song.id}
                                        style={{ marginHorizontal: 5 }}>
                                        <SongCover
                                            song={song}
                                            navigation={navigation}
                                            artist={false}
                                            vertical
                                            onLongPress={() => {
                                                setCurrentData(song);
                                                setBottomSheetOpen(true);
                                            }}
                                        />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                )}

                {favoriteAlbums.length !== 0 && (
                    <View style={styles.container}>
                        <Text fontSize={20} bold style={{ marginLeft: 20 }}>
                            {t`Favorite albums`}
                        </Text>
                        <View style={styles.songsContainer}>
                            <ScrollView
                                horizontal
                                showScroll={false}
                                top={10}
                                bottom={10}>
                                {favoriteAlbums.map((album: AlbumType) => (
                                    <View
                                        key={album.id}
                                        style={{ marginHorizontal: 5 }}>
                                        <AlbumCover
                                            album={album}
                                            navigation={navigation}
                                            vertical
                                            onLongPress={() => {
                                                setCurrentData(album);
                                                setBottomSheetOpen(true);
                                            }}
                                        />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                )}

                {bbsoSongs.length !== 0 && (
                    <View style={styles.container}>
                        <Text fontSize={20} bold style={{ marginLeft: 20 }}>
                            BBSO
                        </Text>
                        <View style={styles.songsContainer}>
                            <ScrollView
                                horizontal
                                showScroll={false}
                                top={10}
                                bottom={10}>
                                {bbsoSongs.map((song: SongType) => (
                                    <View
                                        key={song.id}
                                        style={{ marginHorizontal: 5 }}>
                                        <SongCover
                                            song={song}
                                            navigation={navigation}
                                            vertical
                                            onLongPress={() => {
                                                setCurrentData(song);
                                                setBottomSheetOpen(true);
                                            }}
                                        />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                )}

                {tabaraSongs.length !== 0 && (
                    <View style={styles.container}>
                        <Text fontSize={20} bold style={{ marginLeft: 20 }}>
                            Tabăra 447
                        </Text>
                        <View style={styles.songsContainer}>
                            <ScrollView
                                horizontal
                                showScroll={false}
                                top={10}
                                bottom={10}>
                                {tabaraSongs.map((song: SongType) => (
                                    <View
                                        key={song.id}
                                        style={{ marginHorizontal: 5 }}>
                                        <SongCover
                                            song={song}
                                            navigation={navigation}
                                            vertical
                                            onLongPress={() => {
                                                setCurrentData(song);
                                                setBottomSheetOpen(true);
                                            }}
                                        />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                )}
            </ScrollView>
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
        </Background>
    );
};

export default Home;

const styles = StyleSheet.create({
    row: {
        display: "flex",
        marginVertical: 5,
        width: "100%",
    },
    songsContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
        marginHorizontal: -7.5,
    },
    container: {
        marginTop: 20,
    },
    recent: {
        marginHorizontal: 20,
    },
    topBar: {
        paddingBottom: 20,
        paddingHorizontal: 20,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});
