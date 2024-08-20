import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AlbumCover from "../components/items/albumCover";
import SongCover from "../components/items/songCover";
import Background from "../components/wrapers/background";
import DataBottomSheet from "../components/wrapers/dataBottomSheet";
import ScrollView from "../components/wrapers/scrollView";
import Text from "../components/wrapers/text";
import { AlbumType, DataContext, isSong, SongType } from "../context/data";
import { RecentContext } from "../context/recent";
import { RefreshContext } from "../context/refresh";

const Home = ({ navigation }: { navigation: any }) => {
    const { recent } = useContext(RecentContext);
    const {
        loading,
        getRandomSongs,
        getFavoriteSongsAlbum,
        getFavoriteAlbums,
    } = useContext(DataContext);
    const { refresh } = useContext(RefreshContext);

    const [randomSongs, setRandomSongs] = useState<SongType[]>([]);
    const [favoriteAlbums, setFavoriteAlbums] = useState<AlbumType[]>([]);

    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [currentData, setCurrentData] = useState<SongType | AlbumType | null>(
        null
    );

    useEffect(() => {
        if (!loading) {
            const load = async () => {
                const songs = await getRandomSongs(6);
                setRandomSongs(songs);
            };

            load();
        }
    }, [loading]);

    useEffect(() => {
        if (!loading) {
            const load = async () => {
                const favoriteAlbum = await getFavoriteSongsAlbum();
                const albums = await getFavoriteAlbums();

                const combined = [favoriteAlbum, ...albums];

                setFavoriteAlbums(combined);
            };

            load();
        }
    }, [loading, refresh]);

    if (loading) return <></>;

    return (
        <Background noPadding>
            <View style={styles.recent}>
                {recent.map((data: SongType | AlbumType, index: number) => {
                    if (index % 2 !== 0) return null;

                    const data2 = recent[index + 1];

                    return (
                        <View key={index} style={styles.row}>
                            <View>
                                {isSong(data) ? (
                                    <SongCover
                                        song={data}
                                        navigation={navigation}
                                        onLongPress={() => {
                                            setCurrentData(data);
                                            setBottomSheetOpen(true);
                                        }}
                                    />
                                ) : (
                                    <AlbumCover
                                        album={data}
                                        navigation={navigation}
                                        onLongPress={() => {
                                            setCurrentData(data);
                                            setBottomSheetOpen(true);
                                        }}
                                    />
                                )}
                            </View>
                            <View style={{ width: 10 }} />
                            {data2 && (
                                <View key={index + 1}>
                                    {isSong(data2) ? (
                                        <SongCover
                                            song={data2}
                                            navigation={navigation}
                                            onLongPress={() => {
                                                setCurrentData(data2);
                                                setBottomSheetOpen(true);
                                            }}
                                        />
                                    ) : (
                                        <AlbumCover
                                            album={data2}
                                            navigation={navigation}
                                            onLongPress={() => {
                                                setCurrentData(data2);
                                                setBottomSheetOpen(true);
                                            }}
                                        />
                                    )}
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>

            <View style={styles.container}>
                <Text size={20} bold style={{ marginLeft: 20 }}>
                    Suggested for you
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
                                style={{ marginHorizontal: 7.5 }}>
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
            <View style={styles.container}>
                <Text size={20} bold style={{ marginLeft: 20 }}>
                    Favorite
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
                                style={{ marginHorizontal: 7.5 }}>
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
            <DataBottomSheet
                data={currentData}
                isOpen={isBottomSheetOpen}
                onClose={() => {
                    setBottomSheetOpen(false);
                }}
            />
        </Background>
    );
};

export default Home;

const styles = StyleSheet.create({
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
        marginBottom: 5,
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
});
