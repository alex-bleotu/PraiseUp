import React from "react";
import { StyleSheet, View } from "react-native";
import SongCover from "../components/items/songCover";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { AlbumType } from "../context/data";
import { getById } from "../utils/data";

interface AlbumProps {
    route: any;
    navigation: any;
}

const Album = ({ route, navigation }: AlbumProps) => {
    const { id } = route.params;
    const album = getById(id);

    if (!album || !(album as AlbumType))
        return (
            <StackPage navigation={navigation} title="Album">
                <Text>Not found</Text>
            </StackPage>
        );

    return (
        <StackPage navigation={navigation} title={album.title}>
            <View style={styles.container}>
                <ScrollView bottom={10}>
                    {album.songs.map((id: string, index: any) => {
                        const song = getById(id);

                        if (!song) return null;

                        return (
                            <View key={index} style={styles.songs}>
                                <SongCover
                                    key={index}
                                    id={song.id}
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
