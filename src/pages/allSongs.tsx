import { t } from "@lingui/macro";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
    ScrollView as RNScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import SkeletonCover from "../components/items/skeletonCover";
import SongCover from "../components/items/songCover";
import StackPage from "../components/wrapers/stackPage";
import Text from "../components/wrapers/text";
import { DataContext, SongType } from "../context/data";
import { ThemeContext } from "../context/theme";

const alphabet = "ABCDEFGHIÎJKLMNOPQRSȘTȚUVWXYZ";

const groupSongsByLetter = (songs: SongType[]) => {
    const groupedSongs: { [key: string]: SongType[] } = {};

    for (const letter of alphabet) groupedSongs[letter] = [];

    songs.forEach((song) => {
        let firstLetter = song.title.charAt(0).toUpperCase();

        if (!alphabet.includes(firstLetter)) {
            firstLetter = "#";
        }

        if (!groupedSongs[firstLetter]) {
            groupedSongs[firstLetter] = [];
        }
        groupedSongs[firstLetter].push(song);
    });

    for (const letter in groupedSongs)
        if (groupedSongs[letter].length === 0) delete groupedSongs[letter];

    return groupedSongs;
};

const AllSongs = ({ navigation }: { navigation: any }) => {
    const { theme } = useContext(ThemeContext);
    const { getAllSongsOrdered } = useContext(DataContext);

    const [songs, setSongs] = useState<SongType[]>([]);
    const [groupedSongs, setGroupedSongs] = useState<{
        [key: string]: SongType[];
    }>({});
    const sectionRefs = useRef<{ [key: string]: any }>({});
    const scrollViewRef = useRef<RNScrollView>(null);

    const alphabetSplit = alphabet.split("");

    useEffect(() => {
        const getSongs = async () => {
            const allSongs = await getAllSongsOrdered();
            const grouped = groupSongsByLetter(allSongs);
            setGroupedSongs(grouped);
            setSongs(allSongs);
        };
        getSongs();
    }, []);

    const handleScrollToSection = (letter: string) => {
        sectionRefs.current[letter]?.measureLayout(
            scrollViewRef.current,
            (x: number, y: number, width: number, height: number) => {
                scrollViewRef.current?.scrollTo({ y, animated: true });
            }
        );
    };

    return (
        <StackPage navigation={navigation} title={t`Songs`} noBottom>
            {songs.length > 0 ? (
                <View style={styles.container}>
                    <View style={styles.alphabetContainer}>
                        {alphabetSplit.map((letter) => (
                            <TouchableOpacity
                                key={letter}
                                onPress={() => handleScrollToSection(letter)}>
                                <Text
                                    style={styles.alphabetLetter}
                                    bold
                                    fontSize={15}>
                                    {letter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <RNScrollView
                        ref={scrollViewRef}
                        style={{
                            paddingRight: 35,
                        }}>
                        {Object.keys(groupedSongs).map((letter) => (
                            <View
                                key={letter}
                                ref={(ref) =>
                                    (sectionRefs.current[letter] = ref)
                                }
                                style={styles.section}>
                                <Text
                                    style={styles.sectionTitle}
                                    bold
                                    fontSize={20}>
                                    {letter}
                                </Text>
                                {groupedSongs[letter].map((data, index) => (
                                    <View
                                        style={{ marginBottom: 10 }}
                                        key={index}>
                                        <SongCover
                                            key={index}
                                            song={data}
                                            navigation={navigation}
                                            fullWidth
                                        />
                                    </View>
                                ))}
                            </View>
                        ))}
                    </RNScrollView>
                </View>
            ) : (
                <View style={styles.container}>
                    <View style={styles.alphabetContainer}>
                        {alphabetSplit.map((letter) => (
                            <TouchableOpacity
                                key={letter}
                                onPress={() => handleScrollToSection(letter)}>
                                <Text
                                    style={styles.alphabetLetter}
                                    bold
                                    fontSize={15}>
                                    {letter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle} bold fontSize={20}>
                            {"A"}
                        </Text>
                        <RNScrollView
                            ref={scrollViewRef}
                            style={{
                                paddingRight: 35,
                            }}>
                            {Array.from({ length: 20 }).map((_, index) => (
                                <View style={{ marginBottom: 10 }} key={index}>
                                    <SkeletonCover fullWidth />
                                </View>
                            ))}
                        </RNScrollView>
                    </View>
                </View>
            )}
        </StackPage>
    );
};

export default AllSongs;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flex: 1,
        paddingLeft: 20,
    },
    alphabetContainer: {
        position: "absolute",
        right: 0,
        top: 0,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 5,
        zIndex: 1000,
        height: "100%",
    },
    alphabetLetter: {
        paddingVertical: 1,
        paddingHorizontal: 5,
    },
    section: {
        marginBottom: 15,
        flex: 1,
    },
    sectionTitle: {
        marginBottom: 10,
        marginLeft: 10,
    },
    loader: {
        marginTop: -50,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
