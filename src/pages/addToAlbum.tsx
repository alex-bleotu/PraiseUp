import { t } from "@lingui/macro";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import AlbumCover from "../components/items/albumCover";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { AlbumType, DataContext } from "../context/data";
import { RecentContext } from "../context/recent";
import { RefreshContext } from "../context/refresh";
import { ThemeContext } from "../context/theme";

const AddToAlbum = ({ navigation, route }: { navigation: any; route: any }) => {
    const { currentData: song } = route.params;
    const { theme } = useContext(ThemeContext);

    const {
        getPersonalAlbumsBySong,
        removeSongFromPersonalAlbum,
        addSongToPersonalAlbum,
    } = useContext(DataContext);
    const { updateRecent } = useContext(RecentContext);
    const { updateRefresh } = useContext(RefreshContext);

    const [albumsWithSong, setAlbumsWithSong] = useState<AlbumType[] | null>(
        null
    );
    const [albumsWithoutSong, setAlbumsWithoutSong] = useState<
        AlbumType[] | null
    >(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAlbums = async () => {
            setLoading(true);

            const albums = await getPersonalAlbumsBySong(song);

            setAlbumsWithSong(albums["albumsThatContainSong"]);
            setAlbumsWithoutSong(albums["albumsThatDontContainSong"]);

            setLoading(false);
        };

        loadAlbums();
    }, []);

    const removeFromFirstAddToSecond = (album: AlbumType) => {
        if (!albumsWithSong || !albumsWithoutSong) return;

        const newAlbumsWithSong = albumsWithSong.filter(
            (a) => a.id !== album.id
        );

        const newAlbumsWithoutSong = [album, ...albumsWithoutSong];

        setAlbumsWithSong(newAlbumsWithSong);
        setAlbumsWithoutSong(newAlbumsWithoutSong);
    };

    const removeFromSecondAddToFirst = (album: AlbumType) => {
        if (!albumsWithSong || !albumsWithoutSong) return;

        const newAlbumsWithoutSong = albumsWithoutSong.filter(
            (a) => a.id !== album.id
        );

        const newAlbumsWithSong = [album, ...albumsWithSong];

        setAlbumsWithSong(newAlbumsWithSong);
        setAlbumsWithoutSong(newAlbumsWithoutSong);
    };

    return (
        <StackPage title={t`Add to album`} navigation={navigation} noBottom>
            <View style={styles.container}>
                <ScrollView bottom={10}>
                    <View
                        style={{
                            width: "100%",
                            display: "flex",
                            flex: 1,
                        }}>
                        {!loading && (
                            <>
                                {albumsWithSong &&
                                albumsWithoutSong &&
                                (albumsWithSong.length > 0 ||
                                    albumsWithoutSong.length > 0) ? (
                                    <View>
                                        {albumsWithSong.length > 0 && (
                                            <>
                                                <View style={styles.title}>
                                                    <Text fontSize={20} bold>
                                                        {t`Saved in`}
                                                    </Text>
                                                </View>
                                                <View>
                                                    {albumsWithSong.map(
                                                        (
                                                            data: AlbumType,
                                                            index: any
                                                        ) => {
                                                            return (
                                                                <View
                                                                    key={index}
                                                                    style={
                                                                        styles.albums
                                                                    }>
                                                                    <AlbumCover
                                                                        key={
                                                                            index
                                                                        }
                                                                        album={
                                                                            data
                                                                        }
                                                                        disabled
                                                                        navigation={
                                                                            navigation
                                                                        }
                                                                        fullWidth
                                                                        icon="plus-circle"
                                                                        action={() => {
                                                                            removeSongFromPersonalAlbum(
                                                                                data,
                                                                                song
                                                                            ).then(
                                                                                (
                                                                                    newAlbum: AlbumType
                                                                                ) => {
                                                                                    updateRefresh();
                                                                                    updateRecent();
                                                                                    removeFromFirstAddToSecond(
                                                                                        newAlbum
                                                                                    );
                                                                                }
                                                                            );
                                                                        }}
                                                                    />
                                                                </View>
                                                            );
                                                        }
                                                    )}
                                                </View>
                                            </>
                                        )}
                                        {albumsWithoutSong.length > 0 && (
                                            <>
                                                <View style={styles.title}>
                                                    <Text fontSize={20} bold>
                                                        {t`Add to`}
                                                    </Text>
                                                </View>
                                                <View>
                                                    {albumsWithoutSong.map(
                                                        (
                                                            data: AlbumType,
                                                            index: any
                                                        ) => {
                                                            return (
                                                                <View
                                                                    key={index}
                                                                    style={
                                                                        styles.albums
                                                                    }>
                                                                    <AlbumCover
                                                                        key={
                                                                            index
                                                                        }
                                                                        album={
                                                                            data
                                                                        }
                                                                        disabled
                                                                        navigation={
                                                                            navigation
                                                                        }
                                                                        fullWidth
                                                                        icon="plus-circle-outline"
                                                                        action={() => {
                                                                            addSongToPersonalAlbum(
                                                                                data,
                                                                                song
                                                                            ).then(
                                                                                (
                                                                                    newAlbum: AlbumType
                                                                                ) => {
                                                                                    updateRefresh();
                                                                                    updateRecent();
                                                                                    removeFromSecondAddToFirst(
                                                                                        newAlbum
                                                                                    );
                                                                                }
                                                                            );
                                                                        }}
                                                                    />
                                                                </View>
                                                            );
                                                        }
                                                    )}
                                                </View>
                                            </>
                                        )}
                                    </View>
                                ) : (
                                    <View style={styles.placeHolderContainer}>
                                        <Text fontSize={20} bold center>
                                            {t`You don't have any albums`}
                                        </Text>
                                        <Text
                                            fontSize={16}
                                            style={{ marginTop: 10 }}
                                            center>
                                            {t`Create one to add songs to it.`}
                                        </Text>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                    {(loading || !albumsWithSong || !albumsWithoutSong) && (
                        <View
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                marginTop: -75,
                                flex: 1,
                            }}>
                            <ActivityIndicator
                                size="large"
                                color={theme.colors.primary}
                            />
                        </View>
                    )}
                </ScrollView>
            </View>
        </StackPage>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
    },
    albums: { marginTop: 15, paddingHorizontal: 20 },
    title: {
        marginTop: 15,
        paddingHorizontal: 20,
    },
    placeHolderContainer: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -100,
        marginHorizontal: 25,
    },
});

export default AddToAlbum;
