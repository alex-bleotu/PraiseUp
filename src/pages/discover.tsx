import { t } from "@lingui/macro";
import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Searchbar as SearchBar } from "react-native-paper";
import AlbumCover from "../components/items/albumCover";
import SongCover from "../components/items/songCover";
import Background from "../components/wrapers/background";
import Button from "../components/wrapers/button";
import DataBottomSheet from "../components/wrapers/dataBottomSheet";
import ScrollView from "../components/wrapers/scrollView";
import Text from "../components/wrapers/text";
import { AlbumType, DataContext, isSong, SongType } from "../context/data";
import { HistoryContext } from "../context/history";
import { ThemeContext } from "../context/theme";
import Loading from "./loading";

const Discover = ({ navigation }: { navigation: any }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState<any | null>(null);

    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [currentData, setCurrentData] = useState<SongType | AlbumType | null>(
        null
    );

    const searchRef = useRef(0);

    const { theme } = useContext(ThemeContext);
    const { history, deleteHistory, removeFromHistory } =
        useContext(HistoryContext);
    const { filter } = useContext(DataContext);

    useEffect(() => {
        const currentSearch = ++searchRef.current;

        const loadSongs = async () => {
            if (searchQuery.length === 0) {
                setFilteredData(null);
                setLoading(false);
                return;
            }

            setLoading(true);

            if (currentSearch !== searchRef.current) return;

            const filtered = await filter(searchQuery);
            setFilteredData(filtered);

            setLoading(false);
        };

        loadSongs();

        return () => {
            searchRef.current++;
        };
    }, [searchQuery]);

    if (history === null) return <Loading />;

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
                    placeholder={t`Search`}
                    onChangeText={(query) => setSearchQuery(query)}
                    value={searchQuery}
                />
            </View>
            {searchQuery.length === 0 ? (
                <>
                    {history.length !== 0 ? (
                        <View style={styles.container}>
                            <ScrollView bottom={15}>
                                <View style={{ marginTop: 15 }}>
                                    <Text fontSize={20} bold>
                                        {t`Recent Searches`}
                                    </Text>
                                </View>
                                {history.map(
                                    (
                                        data: SongType | AlbumType,
                                        index: any
                                    ) => {
                                        return (
                                            <View
                                                key={index}
                                                style={styles.songs}>
                                                {isSong(data) ? (
                                                    <SongCover
                                                        key={index}
                                                        song={data}
                                                        navigation={navigation}
                                                        fullWidth
                                                        icon="close"
                                                        action={() =>
                                                            removeFromHistory(
                                                                data
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <AlbumCover
                                                        key={index}
                                                        album={data}
                                                        navigation={navigation}
                                                        fullWidth
                                                        icon="close"
                                                        action={() =>
                                                            removeFromHistory(
                                                                data
                                                            )
                                                        }
                                                    />
                                                )}
                                            </View>
                                        );
                                    }
                                )}
                                <View
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginLeft: -35,
                                    }}>
                                    <Button
                                        style={{ marginTop: 20 }}
                                        text={t`Clear recent searches`}
                                        fontSize={14}
                                        mode="outlined"
                                        color={theme.colors.text}
                                        bold
                                        onPress={async () => {
                                            deleteHistory();
                                        }}
                                    />
                                </View>
                            </ScrollView>
                        </View>
                    ) : (
                        <View style={styles.placeHolderContainer}>
                            <Text fontSize={20} bold>
                                {t`No recent searches`}
                            </Text>
                            <Text fontSize={16} style={{ marginTop: 10 }}>
                                {t`Start searching for your favorite songs.`}
                            </Text>
                        </View>
                    )}
                </>
            ) : (
                <>
                    {filter === null || loading ? (
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
                            {filteredData?.length !== 0 ? (
                                <View style={styles.container}>
                                    <ScrollView bottom={15}>
                                        {filteredData?.map(
                                            (data: any, index: number) => (
                                                <View
                                                    key={index}
                                                    style={styles.songs}>
                                                    {isSong(data) ? (
                                                        <SongCover
                                                            key={index}
                                                            song={data}
                                                            navigation={
                                                                navigation
                                                            }
                                                            icon="dots-vertical"
                                                            action={() => {
                                                                setCurrentData(
                                                                    data
                                                                );
                                                                setBottomSheetOpen(
                                                                    true
                                                                );
                                                            }}
                                                            onLongPress={() => {
                                                                setCurrentData(
                                                                    data
                                                                );
                                                                setBottomSheetOpen(
                                                                    true
                                                                );
                                                            }}
                                                            fullWidth
                                                            wasSearched
                                                        />
                                                    ) : (
                                                        <AlbumCover
                                                            key={index}
                                                            album={data}
                                                            navigation={
                                                                navigation
                                                            }
                                                            icon="dots-vertical"
                                                            action={() => {
                                                                setCurrentData(
                                                                    data
                                                                );
                                                                setBottomSheetOpen(
                                                                    true
                                                                );
                                                            }}
                                                            onLongPress={() => {
                                                                setCurrentData(
                                                                    data
                                                                );
                                                                setBottomSheetOpen(
                                                                    true
                                                                );
                                                            }}
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
                                    <Text fontSize={20} bold center>
                                        {t`No search result`}
                                    </Text>
                                    <Text
                                        fontSize={16}
                                        style={{ marginTop: 10 }}
                                        center>
                                        {t`No song or album matches your search.`}
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
                </>
            )}
            <DataBottomSheet
                data={currentData}
                isOpen={isBottomSheetOpen}
                onClose={() => {
                    setBottomSheetOpen(false);
                }}
            />
        </Background>
    );
};

export default Discover;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        display: "flex",
        flex: 1,
        paddingLeft: 25,
    },
    songs: { marginTop: 15, paddingRight: 25 },
    placeHolderContainer: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -70,
        marginHorizontal: 25,
    },
    indicator: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70%",
    },
});
