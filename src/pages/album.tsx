import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import SongCover from "../components/items/songCover";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { DataContext, SongType } from "../context/data";

interface AlbumProps {
    route: any;
    navigation: any;
}

const Album = ({ route, navigation }: AlbumProps) => {
    const { album } = route.params;

    const [songs, setSongs] = useState<SongType[]>([]);

    const { getById } = useContext(DataContext);

    useEffect(() => {
        const load = async () => {
            let loaded: SongType[] = [];

            for (let i = 0; i < album.songs.length; i++) {
                const song = await getById(album.songs[i]);
                if (song) loaded.push(song as SongType);
            }

            setSongs(loaded);
        };

        load();
    }, []);

    if (!album)
        return (
            <StackPage navigation={navigation} title="Album">
                <Text>Not found</Text>
            </StackPage>
        );

    return (
        <StackPage navigation={navigation} title={album.title}>
            <View style={styles.container}>
                <ScrollView bottom={10}>
                    {songs.map((song: SongType, index: any) => {
                        if (!song) return null;

                        return (
                            <View key={index} style={styles.songs}>
                                <SongCover
                                    key={index}
                                    song={song}
                                    navigation={navigation}
                                    fullWidth
                                    artist={false}
                                />
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        </StackPage>
    );
};

export default Album;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        display: "flex",
        flex: 1,
        paddingLeft: 35,
    },
    songs: { marginTop: 15, paddingRight: 35 },
});
