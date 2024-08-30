import { t } from "@lingui/macro";
import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Searchbar as SearchBar } from "react-native-paper";
import SongCover from "../components/items/songCover";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import { AlbumType, DataContext, SongType } from "../context/data";
import { RecentContext } from "../context/recent";
import { RefreshContext } from "../context/refresh";
import { ThemeContext } from "../context/theme";

const AddSong = ({ navigation, route }: { navigation: any; route: any }) => {
    const { album: a } = route.params;
    const { theme } = useContext(ThemeContext);
    const { filterSongsNotInAlbum, addSongToPersonalAlbum, updateSongDate } =
        useContext(DataContext);
    const { updateRecent } = useContext(RecentContext);
    const { updateRefresh } = useContext(RefreshContext);

    const [searchQuery, setSearchQuery] = useState("");
    const [songs, setSongs] = useState<SongType[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [album, setAlbum] = useState<AlbumType>(a);

    const searchRef = useRef(0);

    useEffect(() => {
        const currentSearch = ++searchRef.current;

        const loadSongs = async () => {
            setLoading(true);

            if (currentSearch !== searchRef.current) return;

            if (searchQuery.length === 0) {
                const filtered = await filterSongsNotInAlbum(album, "");
                setSongs(filtered);
                setLoading(false);
                return;
            }

            const filtered = await filterSongsNotInAlbum(album, searchQuery);
            setSongs(filtered);

            setLoading(false);
        };

        loadSongs();

        return () => {
            searchRef.current++;
        };
    }, [searchQuery]);

    const removeSongFromList = async (song: SongType) => {
        if (!songs) return;

        const newSongs = songs.filter((s) => s.id !== song.id);
        setSongs(newSongs);
    };

    return (
        <StackPage title={t`Add songs`} navigation={navigation} noBottom>
            <View style={styles.container}>
                <View style={{ width: "100%" }}>
                    <SearchBar
                        style={{
                            backgroundColor: theme.colors.paper,
                            borderRadius: 12,
                            marginHorizontal: 20,
                        }}
                        placeholderTextColor={theme.colors.text}
                        iconColor={theme.colors.text}
                        inputStyle={{ color: theme.colors.text }}
                        placeholder={t`Search`}
                        onChangeText={(query) => setSearchQuery(query)}
                        value={searchQuery}
                    />
                </View>

                <View style={styles.scrollContainer}>
                    {!loading && songs ? (
                        <ScrollView bottom={10}>
                            {songs.map((data: SongType, index: any) => {
                                return (
                                    <View key={index} style={styles.songs}>
                                        <SongCover
                                            key={index}
                                            song={data}
                                            disabled
                                            navigation={navigation}
                                            fullWidth
                                            icon="plus-circle-outline"
                                            action={() => {
                                                addSongToPersonalAlbum(
                                                    album,
                                                    data
                                                ).then(
                                                    (newAlbum: AlbumType) => {
                                                        updateSongDate(data);
                                                        setAlbum(newAlbum);
                                                        updateRefresh();
                                                        updateRecent();
                                                    }
                                                );
                                                removeSongFromList(data);
                                            }}
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

export default AddSong;
