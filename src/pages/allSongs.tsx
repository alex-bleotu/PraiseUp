import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import SongCover from "../components/items/songCover";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import { DataContext, SongType } from "../context/data";
import { ThemeContext } from "../context/theme";

const AllSongs = ({ navigation }: { navigation: any }) => {
    const { theme } = useContext(ThemeContext);
    const { getAllSongsOrdered } = useContext(DataContext);

    const [songs, setSongs] = useState<SongType[]>([]);

    useEffect(() => {
        const getSongs = async () => {
            const songs = await getAllSongsOrdered();
            setSongs(songs);
        };

        getSongs();
    }, []);

    return (
        <StackPage navigation={navigation} title={"All Songs"}>
            {songs.length > 0 ? (
                <View style={styles.container}>
                    <ScrollView bottom={15}>
                        {songs.map((data: SongType, index: any) => {
                            return (
                                <View key={index} style={styles.songs}>
                                    <SongCover
                                        key={index}
                                        song={data}
                                        navigation={navigation}
                                        fullWidth
                                    />
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            ) : (
                <View
                    style={{
                        marginTop: -50,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                    }}>
                    <ActivityIndicator
                        size="large"
                        color={theme.colors.primary}
                    />
                </View>
            )}
        </StackPage>
    );
};

export default AllSongs;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        display: "flex",
        flex: 1,
        paddingLeft: 15,
    },
    songs: { marginTop: 15, paddingRight: 15 },
});
