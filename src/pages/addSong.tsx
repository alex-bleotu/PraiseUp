import { t } from "@lingui/macro";
import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Searchbar as SearchBar } from "react-native-paper";
import SongCover from "../components/items/songCover";
import ScrollView from "../components/wrapers/scrollView";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { AlbumType, DataContext, SongType } from "../context/data";
import { RecentContext } from "../context/recent";
import { RefreshContext } from "../context/refresh";
import { ThemeContext } from "../context/theme";

const AddSong = ({ navigation, route }: { navigation: any; route: any }) => {
    const { album: a } = route.params;
    const { theme } = useContext(ThemeContext);
    const { filterSongsNotInAlbum, addSongToPersonalAlbum, updateDate } =
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

            const filtered = await filterSongsNotInAlbum(album, searchQuery);
            setSongs(filtered);
            setLoading(false);
        };

        loadSongs();

        return () => {
            searchRef.current++;
        };
    }, [searchQuery]);

    const removeSongFromList = (song: SongType) => {
        if (!songs) return;

        // Immediately remove the song from the list without awaiting the promise
        const newSongs = songs.filter((s) => s.id !== song.id);
        setSongs(newSongs);
    };

    const handleAddSong = async (song: SongType) => {
        // Remove song from list immediately
        removeSongFromList(song);

        try {
            // Add song to the personal album asynchronously
            const newAlbum = await addSongToPersonalAlbum(album, song);

            // Update the album and refresh the date
            updateDate(song.id);
            setAlbum(newAlbum);
            updateRefresh();
            updateRecent();
        } catch (error) {
            // Handle error if needed
            console.error("Error adding song:", error);
        }
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
                        songs.length > 0 ? (
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
                                                action={() =>
                                                    handleAddSong(data)
                                                } // Optimized function
                                            />
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        ) : (
                            <View style={styles.placeholder}>
                                <Text fontSize={20} bold center>
                                    {t`No more songs`}
                                </Text>
                                <Text center fontSize={16}>
                                    {t`You've added all the available songs`}
                                </Text>
                            </View>
                        )
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
    placeholder: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -100,
        marginHorizontal: 25,
    },
});

export default AddSong;
