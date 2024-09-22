import { t } from "@lingui/macro";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AlbumCover from "../components/items/albumCover";
import SongCover from "../components/items/songCover";
import Background from "../components/wrapers/background";
import DataBottomSheet from "../components/wrapers/dataBottomSheet";
import ScrollView from "../components/wrapers/scrollView";
import Text from "../components/wrapers/text";
import { AlbumType, DataContext, SongType } from "../context/data";
import { RecentContext } from "../context/recent";
import { RefreshContext } from "../context/refresh";

const Home = ({ navigation }: { navigation: any }) => {
    const { recent } = useContext(RecentContext);
    const { getRandomSongs, getFavoriteSongsAlbum, getFavoriteAlbums } =
        useContext(DataContext);
    const { refresh } = useContext(RefreshContext);

    const [randomSongs, setRandomSongs] = useState<SongType[]>([]);
    const [favoriteAlbums, setFavoriteAlbums] = useState<AlbumType[]>([]);

    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [currentData, setCurrentData] = useState<SongType | AlbumType | null>(
        null
    );

    useEffect(() => {
        const load = async () => {
            const favoriteAlbum = await getFavoriteSongsAlbum();
            const albums = await getFavoriteAlbums();

            if (favoriteAlbum.songs.length > 0)
                setFavoriteAlbums([favoriteAlbum, ...albums]);
            else setFavoriteAlbums(albums);

            const songs = await getRandomSongs(10);
            setRandomSongs(songs);
        };

        load();
    }, []);

    useEffect(() => {
        const load = async () => {
            const favoriteAlbum = await getFavoriteSongsAlbum();
            const albums = await getFavoriteAlbums();

            if (favoriteAlbum.songs.length > 0)
                setFavoriteAlbums([favoriteAlbum, ...albums]);
            else setFavoriteAlbums(albums);
        };

        load();
    }, [refresh]);

    return (
        <Background noPadding>
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
            </ScrollView>
            <DataBottomSheet
                data={currentData}
                isOpen={isBottomSheetOpen}
                onClose={() => {
                    setBottomSheetOpen(false);
                }}
                extraActions2={() => {
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
});
