import { t } from "@lingui/macro";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import AlbumCover from "../components/items/albumCover";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import { AlbumType, DataContext } from "../context/data";
import { ThemeContext } from "../context/theme";

const AddToAlbum = ({ navigation, route }: { navigation: any; route: any }) => {
    const { song } = route.params;
    const { theme } = useContext(ThemeContext);

    const { getPersonalAlbums } = useContext(DataContext);

    const [albums, setAlbums] = useState<AlbumType[] | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadAlbums = async () => {
            setLoading(true);
            const albums = await getPersonalAlbums();
            setAlbums(albums);
            setLoading(false);
        };

        loadAlbums();
    }, []);

    return (
        <StackPage title={t`Add to album`} navigation={navigation} noBottom>
            <View style={styles.container}>
                <View style={styles.scrollContainer}>
                    {!loading && albums ? (
                        <ScrollView bottom={10}>
                            {albums.map((data: AlbumType, index: any) => {
                                return (
                                    <View key={index} style={styles.songs}>
                                        <AlbumCover
                                            key={index}
                                            album={data}
                                            disabled
                                            navigation={navigation}
                                            fullWidth
                                            icon="plus-circle-outline"
                                            action={() => {}}
                                        />
                                    </View>
                                );
                            })}
                        </ScrollView>
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
                </View>
            </View>
        </StackPage>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
    },
    scrollContainer: {
        width: "100%",
        display: "flex",
        flex: 1,
    },
    songs: { marginTop: 15, paddingHorizontal: 20 },
});

export default AddToAlbum;
