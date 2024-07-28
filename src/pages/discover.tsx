import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Searchbar as SearchBar } from "react-native-paper";
import AlbumCover from "../components/items/albumCover";
import SongCover from "../components/items/songCover";
import AnimatedTouchable from "../components/wrapers/animatedTouchable";
import Background from "../components/wrapers/background";
import Button from "../components/wrapers/button";
import ScrollView from "../components/wrapers/scrollView";
import Text from "../components/wrapers/text";
import { HistoryContext } from "../context/history";
import { Data, filterSongs, getSongById } from "../utils/data";
import { getTheme } from "../utils/theme";

const Discover = ({ navigation }: { navigation: any }) => {
    const theme = getTheme();

    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [filteredSongs, setFilteredSongs] = useState<Data[] | null>(null);
    const searchRef = useRef(0);

    const { history, deleteHistory, removeSongFromHistory } =
        useContext(HistoryContext);

    useEffect(() => {
        const currentSearch = ++searchRef.current;

        const loadSongs = async () => {
            if (searchQuery.length === 0) {
                setFilteredSongs(null);
                setLoading(false);
                return;
            }

            setLoading(true);

            // Simulate delay
            // await new Promise((resolve) => setTimeout(resolve, 50));

            if (currentSearch !== searchRef.current) return;

            const filtered = filterSongs(searchQuery);
            setFilteredSongs(filtered);

            setLoading(false);
        };

        loadSongs();

        return () => {
            searchRef.current++;
        };
    }, [searchQuery]);

    return (
        <Background noPadding>
            <View style={{ paddingHorizontal: 10 }}>
                <SearchBar
                    style={{
                        backgroundColor: theme.colors.paper,
                    }}
                    placeholderTextColor={theme.colors.text}
                    iconColor={theme.colors.text}
                    inputStyle={{ color: theme.colors.text }}
                    placeholder="Search"
                    onChangeText={(query) => setSearchQuery(query)}
                    value={searchQuery}
                />
            </View>
            {searchQuery.length === 0 ? (
                <>
                    {history.length !== 0 ? (
                        <View style={styles.container}>
                            <ScrollView>
                                <View style={{ marginTop: 15 }}>
                                    <Text size={20} bold>
                                        Recent Searches
                                    </Text>
                                </View>
                                {history.map((id: string, index: any) => {
                                    const song = getSongById(id);

                                    if (!song) return null;

                                    return (
                                        <View key={index} style={styles.songs}>
                                            {song.type === "song" ? (
                                                <SongCover
                                                    key={index}
                                                    id={song.id}
                                                    navigation={navigation}
                                                    fullWidth
                                                />
                                            ) : (
                                                <AlbumCover
                                                    id={song.id}
                                                    key={index}
                                                    navigation={navigation}
                                                    fullWidth
                                                />
                                            )}
                                            <AnimatedTouchable
                                                style={{
                                                    position: "absolute",
                                                    right: 15,
                                                    top: -46,
                                                }}>
                                                <MCIcons
                                                    name="close"
                                                    size={24}
                                                    color={theme.colors.text}
                                                    onPress={() =>
                                                        removeSongFromHistory(
                                                            id
                                                        )
                                                    }
                                                />
                                            </AnimatedTouchable>
                                        </View>
                                    );
                                })}
                                <View
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginLeft: -35,
                                    }}>
                                    <Button
                                        style={{ marginTop: 20 }}
                                        text="Clear recent searches"
                                        fontSize={14}
                                        mode="outlined"
                                        bold
                                        onPress={() => {
                                            deleteHistory();
                                        }}
                                    />
                                </View>
                            </ScrollView>
                        </View>
                    ) : (
                        <View style={styles.placeHolderContainer}>
                            <Text size={20} bold>
                                No recent searches
                            </Text>
                            <Text size={16} style={{ marginTop: 10 }}>
                                Start searching for your favorite songs
                            </Text>
                        </View>
                    )}
                </>
            ) : (
                <>
                    {filterSongs === null || loading ? (
                        <View style={styles.indicator}>
                            <ActivityIndicator
                                animating={true}
                                size="large"
                                color={theme.colors.primary}
                                style={{ marginLeft: -20 }}
                            />
                        </View>
                    ) : (
                        <>
                            {filteredSongs?.length !== 0 ? (
                                <View style={styles.container}>
                                    <ScrollView>
                                        {filteredSongs?.map(
                                            (song: Data, index: number) => (
                                                <View
                                                    key={index}
                                                    style={styles.songs}>
                                                    {song.type === "song" ? (
                                                        <SongCover
                                                            key={index}
                                                            id={song.id}
                                                            navigation={
                                                                navigation
                                                            }
                                                            fullWidth
                                                            wasSearched
                                                        />
                                                    ) : (
                                                        <AlbumCover
                                                            id={song.id}
                                                            key={index}
                                                            navigation={
                                                                navigation
                                                            }
                                                            fullWidth
                                                            wasSearched
                                                        />
                                                    )}
                                                </View>
                                            )
                                        )}
                                    </ScrollView>
                                </View>
                            ) : (
                                <View style={styles.placeHolderContainer}>
                                    <Text size={20} bold>
                                        No search result
                                    </Text>
                                    <Text size={16} style={{ marginTop: 10 }}>
                                        No song or album matches your search
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
                </>
            )}
        </Background>
    );
};

export default Discover;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        display: "flex",
        flex: 1,
        paddingLeft: 35,
    },
    songs: { marginTop: 15, paddingRight: 35 },
    placeHolderContainer: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -70,
    },
    indicator: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70%",
    },
});
