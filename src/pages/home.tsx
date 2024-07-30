import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import AlbumCover from "../components/items/albumCover";
import SongCover from "../components/items/songCover";
import Background from "../components/wrapers/background";
import Text from "../components/wrapers/text";
import { DataContext, isSong, SongType } from "../context/data";
import { RecentContext } from "../context/recent";

const Home = ({ navigation }: { navigation: any }) => {
    const { recent } = useContext(RecentContext);
    const { getRandomSongs } = useContext(DataContext);

    const [randomSongs, setRandomSongs] = useState<SongType[]>([]);

    // useEffect(() => {
    //     const load = async () => {
    //         const songs = await getRandomSongs(4);
    //         setRandomSongs(songs);
    //     };

    //     load();
    // }, []);

    return (
        <Background>
            {recent.length > 1 && (
                <View style={styles.row}>
                    {isSong(recent[0]) ? (
                        <SongCover song={recent[0]} navigation={navigation} />
                    ) : (
                        <AlbumCover album={recent[0]} navigation={navigation} />
                    )}
                    <View style={{ width: 10 }} />
                    {isSong(recent[1]) ? (
                        <SongCover song={recent[1]} navigation={navigation} />
                    ) : (
                        <AlbumCover album={recent[1]} navigation={navigation} />
                    )}
                </View>
            )}
            {recent.length > 3 && (
                <View style={styles.row}>
                    {isSong(recent[2]) ? (
                        <SongCover song={recent[2]} navigation={navigation} />
                    ) : (
                        <AlbumCover album={recent[2]} navigation={navigation} />
                    )}
                    <View style={{ width: 10 }} />
                    {isSong(recent[3]) ? (
                        <SongCover song={recent[3]} navigation={navigation} />
                    ) : (
                        <AlbumCover album={recent[3]} navigation={navigation} />
                    )}
                </View>
            )}
            {recent.length > 5 && (
                <View style={styles.row}>
                    {isSong(recent[4]) ? (
                        <SongCover song={recent[4]} navigation={navigation} />
                    ) : (
                        <AlbumCover album={recent[4]} navigation={navigation} />
                    )}
                    <View style={{ width: 10 }} />
                    {isSong(recent[5]) ? (
                        <SongCover song={recent[5]} navigation={navigation} />
                    ) : (
                        <AlbumCover album={recent[5]} navigation={navigation} />
                    )}
                </View>
            )}
            <View style={styles.container}>
                <Text size={20} bold>
                    Suggested for you
                </Text>
                <View style={styles.songsContainer}>
                    {/* {getRandomSongs(4).map((song: SongType, index: number) => (
                        <SongCover
                            key={index}
                            song={song}
                            navigation={navigation}
                            vertical
                        />
                    ))} */}
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
    },
    container: {
        marginTop: 20,
        // marginHorizontal: 5,
    },
});
