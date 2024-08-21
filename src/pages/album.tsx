import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import SongCover from "../components/items/songCover";
import DataBottomSheet from "../components/wrapers/dataBottomSheet";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import { AlbumType, DataContext, SongType } from "../context/data";
import { LanguageContext } from "../context/language";
import { RefreshContext } from "../context/refresh";
import Loading from "./loading";

interface AlbumProps {
    route: any;
    navigation: any;
}

const Album = ({ route, navigation }: AlbumProps) => {
    const { id } = route.params;
    const { refresh } = useContext(RefreshContext);
    const { getSongById, getFavoriteSongsAlbum, getAlbumById } =
        useContext(DataContext);
    const { language } = useContext(LanguageContext);

    const [songs, setSongs] = useState<SongType[] | null>(null);

    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [currentData, setCurrentData] = useState<AlbumType | SongType | null>(
        null
    );
    const [album, setAlbum] = useState<AlbumType | null>(null);

    useEffect(() => {
        const load = async () => {
            let album;

            if (id === "F") album = await getFavoriteSongsAlbum();
            else album = await getAlbumById(id);

            setAlbum(album);

            let loaded: SongType[] = [];

            for (let i = 0; i < album.songs.length; i++) {
                const song = await getSongById(album.songs[i]);
                if (song) loaded.push(song);
            }

            setSongs(loaded);
        };

        load();
    }, [refresh]);

    useEffect(() => {
        if (currentData) setBottomSheetOpen(true);
    }, [currentData]);

    if (album === null || songs === null) return <Loading />;

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
            icon={"dots-vertical"}
            action={() => {
                setCurrentData(album);
            }}>
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
                                    icon="dots-vertical"
                                    action={() => {
                                        setCurrentData(song);
                                    }}
                                    onLongPress={() => {
                                        setCurrentData(song);
                                    }}
                                />
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
            <DataBottomSheet
                data={currentData}
                isOpen={isBottomSheetOpen}
                onClose={() => {
                    setBottomSheetOpen(false);
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
        paddingLeft: 35,
    },
    songs: { marginTop: 15, paddingRight: 35 },
});
