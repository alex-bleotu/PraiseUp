import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AlbumCover from "../components/items/albumCover";
import SongCover from "../components/items/songCover";
import Background from "../components/wrapers/background";
import ScrollView from "../components/wrapers/scrollView";
import Text from "../components/wrapers/text";
import { AlbumType, DataContext, isSong, SongType } from "../context/data";
import { RecentContext } from "../context/recent";

const Home = ({ navigation }: { navigation: any }) => {
    const { recent } = useContext(RecentContext);
    const { getRandomSongs, getRandomAlbums } = useContext(DataContext);

    const [randomSongs, setRandomSongs] = useState<SongType[]>([]);
    const [createdAlbums, setCreatedAlbums] = useState<AlbumType[]>([]);

    useEffect(() => {
        const load = async () => {
            const songs = await getRandomSongs(6);
            setRandomSongs(songs);

            const albums = await getRandomAlbums(6);
            setCreatedAlbums(albums);
        };

        load();
    }, []);

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
                                    />
                                ) : (
                                    <AlbumCover
                                        album={data}
                                        navigation={navigation}
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
                                        />
                                    ) : (
                                        <AlbumCover
                                            album={data2}
                                            navigation={navigation}
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
                        {randomSongs.map((song: SongType, index: number) => (
                            <View key={index} style={{ marginHorizontal: 7.5 }}>
                                <SongCover
                                    song={song}
                                    navigation={navigation}
                                    artist={false}
                                    vertical
                                />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
            <View style={styles.container}>
                <Text size={20} bold style={{ marginLeft: 20 }}>
                    Your Albums
                </Text>
                <View style={styles.songsContainer}>
                    <ScrollView
                        horizontal
                        showScroll={false}
                        top={10}
                        bottom={10}>
                        {createdAlbums.map(
                            (album: AlbumType, index: number) => (
                                <View
                                    key={index}
                                    style={{ marginHorizontal: 7.5 }}>
                                    <AlbumCover
                                        album={album}
                                        navigation={navigation}
                                        vertical
                                    />
                                </View>
                            )
                        )}
                    </ScrollView>
                </View>
            </View>
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
