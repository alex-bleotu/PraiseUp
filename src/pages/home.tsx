import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import { t } from "@lingui/macro";
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import AlbumCover from "../components/items/albumCover";
import SkeletonCover from "../components/items/skeletonCover";
import SongCover from "../components/items/songCover";
import AnimatedTouchable from "../components/wrapers/animatedTouchable";
import Background from "../components/wrapers/background";
import Button from "../components/wrapers/button";
import DataBottomSheet from "../components/wrapers/dataBottomSheet";
import Modal from "../components/wrapers/modal";
import ScrollView from "../components/wrapers/scrollView";
import SkeletonText from "../components/wrapers/skeletonText";
import Text from "../components/wrapers/text";
import { AlbumType, DataContext, SongType, UpdateType } from "../context/data";
import { RecentContext } from "../context/recent";
import { RefreshContext } from "../context/refresh";
import { ThemeContext } from "../context/theme";
import { UserContext } from "../context/user";

const Home = ({ navigation }: { navigation: any }) => {
    const { recent } = useContext(RecentContext);
    const {
        getRandomSongs,
        getFavoriteSongsAlbum,
        getFavoriteAlbums,
        getSongById,
        updates,
        getFirstThreeAlbums,
    } = useContext(DataContext);
    const { refresh } = useContext(RefreshContext);
    const { user } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);

    const screenWidth = Dimensions.get("window").width;

    const [randomSongs, setRandomSongs] = useState<SongType[] | null>(null);
    const [favoriteAlbums, setFavoriteAlbums] = useState<AlbumType[] | null>(
        null
    );

    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [currentData, setCurrentData] = useState<SongType | AlbumType | null>(
        null
    );

    const [expended, setExpended] = useState(false);
    const [color, setColor] = useState(false);

    const [albumsList, setAlbumsList] = useState<AlbumType[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);

    useEffect(() => {
        const load = async () => {
            const favoriteAlbum = await getFavoriteSongsAlbum();
            const albums = await getFavoriteAlbums();

            if (favoriteAlbum && favoriteAlbum.songs.length > 0)
                setFavoriteAlbums([favoriteAlbum, ...albums]);
            else if (albums.length > 0) setFavoriteAlbums(albums);
            else setFavoriteAlbums([]);

            const songs = await getRandomSongs(10);

            if (songs) setRandomSongs(songs);
            else setRandomSongs([]);

            const albumsList = await getFirstThreeAlbums();

            if (albumsList.length === 0) return;

            for (let i = 0; i < albumsList.length; i++) {
                if (albumsList[i].songs.length > 0) {
                    let songsList: SongType[] = [];
                    for (let j = 0; j < albumsList[i].songs.length; j++) {
                        const songData = await getSongById(
                            albumsList[i].songs[j]
                        );
                        if (songData) songsList = [...songsList, songData];
                    }
                    albumsList[i].songs = songsList;
                }
            }

            setAlbumsList(albumsList);
        };

        load();
    }, []);

    useEffect(() => {
        const load = async () => {
            const favoriteAlbum = await getFavoriteSongsAlbum();
            const albums = await getFavoriteAlbums();

            if (favoriteAlbum && favoriteAlbum.songs.length > 0)
                setFavoriteAlbums([favoriteAlbum, ...albums]);
            else if (albums.length > 0) setFavoriteAlbums(albums);
            else setFavoriteAlbums([]);
        };

        load();
    }, [refresh]);

    useEffect(() => {
        if (updates && updates.length > 0 && !modalOpened) {
            setIsModalOpen(true), setModalOpened(true);
        }
    }, [updates]);

    const animatedStyle = useAnimatedStyle(() => {
        const animatedHeight = expended
            ? withTiming(120, { duration: 400 })
            : withTiming(0, { duration: 400 });

        return {
            height: animatedHeight,
        };
    });

    const fillStyle = useAnimatedStyle(() => {
        const animatedRadius = color
            ? withTiming(500, { duration: 1300 })
            : withTiming(0, { duration: 1300 });

        return {
            width: animatedRadius,
            height: animatedRadius,
            borderRadius: 80,
            backgroundColor: theme.colors.primary,
            position: "absolute",
            top: -70,
            left: -30,
        };
    });

    useEffect(() => {
        setColor(true);

        const timeout = setTimeout(() => {
            setExpended(true);
        }, 150);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <Background noPadding>
            <View style={styles.topBar}>
                <Text fontSize={26} bold style={{ marginLeft: 5 }}>
                    {user.displayName ? user.displayName : t`Guest`}
                </Text>
                <AnimatedTouchable
                    onPress={() => {
                        navigation.navigate("Settings");
                    }}>
                    <MCIcons name={"cog"} size={30} color={theme.colors.text} />
                </AnimatedTouchable>
            </View>
            <ScrollView
                bottom={5}
                showScroll={false}
                onScroll={() => {
                    setExpended(false);
                }}>
                <View style={styles.recent}>
                    {recent && recent.length > 0
                        ? recent.map(
                              (data: SongType | AlbumType, index: number) => {
                                  if (index > 2) return null;

                                  return (
                                      <View
                                          key={index + "R"}
                                          style={styles.row}>
                                          <View>
                                              {data.type === "song" ? (
                                                  <SongCover
                                                      song={data}
                                                      fullWidth
                                                      navigation={navigation}
                                                      onLongPress={() => {
                                                          setCurrentData(data);
                                                          setBottomSheetOpen(
                                                              true
                                                          );
                                                      }}
                                                  />
                                              ) : (
                                                  <AlbumCover
                                                      album={data}
                                                      fullWidth
                                                      navigation={navigation}
                                                      onLongPress={() => {
                                                          setCurrentData(data);
                                                          setBottomSheetOpen(
                                                              true
                                                          );
                                                      }}
                                                  />
                                              )}
                                          </View>
                                      </View>
                                  );
                              }
                          )
                        : Array.from({ length: 3 }).map((_, index) => (
                              <View
                                  key={`skeleton-${index}`}
                                  style={styles.row}>
                                  <SkeletonCover fullWidth />
                              </View>
                          ))}
                </View>

                <AnimatedTouchable
                    onPress={() => {
                        setExpended(true);
                    }}
                    style={{
                        borderRadius: 12,
                        marginHorizontal: 20,
                        marginTop: 20,
                        overflow: "hidden",
                    }}>
                    <Animated.View
                        style={[fillStyle, { position: "absolute" }]}
                    />
                    <View style={{ padding: 20 }}>
                        <Text
                            bold
                            color={theme.colors.textOnPrimary}
                            fontSize={20}>
                            {t`Looking for something else?`}
                        </Text>

                        <Animated.View
                            style={[animatedStyle, { position: "relative" }]}>
                            <View>
                                <Text
                                    bold
                                    color={theme.colors.textOnPrimary}
                                    fontSize={16}
                                    style={{
                                        marginTop: 5,
                                        width: "75%",
                                    }}>
                                    {t`Explore everything PraiseUp has to offer!`}
                                </Text>
                                <View
                                    style={{
                                        marginTop: 30,
                                        flexDirection: "row",
                                        width: "100%",
                                        justifyContent: "space-between",
                                    }}>
                                    <View style={{ width: "47%" }}>
                                        <Button
                                            text={t`Songs`}
                                            upper
                                            bold
                                            backgroundColor={theme.colors.paper}
                                            color={theme.colors.text}
                                            mode="contained"
                                            fullWidth
                                            onPress={() => {
                                                navigation.navigate("AllSongs");
                                            }}
                                            contentStyle={{
                                                paddingVertical: 10,
                                            }}
                                        />
                                    </View>
                                    <View style={{ width: "47%" }}>
                                        <Button
                                            text={t`Albums`}
                                            upper
                                            bold
                                            backgroundColor={theme.colors.paper}
                                            color={theme.colors.text}
                                            fullWidth
                                            mode="contained"
                                            onPress={() => {
                                                navigation.navigate(
                                                    "AllAlbums"
                                                );
                                            }}
                                            contentStyle={{
                                                paddingVertical: 10,
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </Animated.View>
                    </View>
                </AnimatedTouchable>

                {randomSongs && randomSongs.length !== 0 ? (
                    <View style={styles.container}>
                        <Text fontSize={20} bold style={{ marginLeft: 20 }}>
                            {t`Suggested for you`}
                        </Text>
                        <View style={styles.songsContainer}>
                            <ScrollView
                                horizontal
                                showScroll={false}
                                top={10}
                                bottom={10}>
                                {randomSongs.map((song: SongType) => (
                                    <View
                                        key={song.id + "S"}
                                        style={{ marginHorizontal: 5 }}>
                                        <SongCover
                                            song={song}
                                            navigation={navigation}
                                            artist={false}
                                            vertical
                                            onLongPress={() => {
                                                setCurrentData(song);
                                                setBottomSheetOpen(true);
                                            }}
                                        />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                ) : (
                    <View style={styles.container}>
                        <Text fontSize={20} bold style={{ marginLeft: 20 }}>
                            {t`Suggested for you`}
                        </Text>
                        <View style={styles.songsContainer}>
                            <ScrollView
                                horizontal
                                showScroll={false}
                                top={10}
                                bottom={10}>
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <View
                                        key={`skeleton-${index}`}
                                        style={{ marginHorizontal: 5 }}>
                                        <SkeletonCover vertical />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                )}

                {favoriteAlbums && favoriteAlbums.length !== 0 && (
                    <View style={styles.container}>
                        <Text fontSize={20} bold style={{ marginLeft: 20 }}>
                            {t`Favorite albums`}
                        </Text>
                        <View style={styles.songsContainer}>
                            <ScrollView
                                horizontal
                                showScroll={false}
                                top={10}
                                bottom={10}>
                                {favoriteAlbums.map((album: AlbumType) => (
                                    <View
                                        key={album.id + "F"}
                                        style={{ marginHorizontal: 5 }}>
                                        <AlbumCover
                                            album={album}
                                            navigation={navigation}
                                            vertical
                                            onLongPress={() => {
                                                setCurrentData(album);
                                                setBottomSheetOpen(true);
                                            }}
                                        />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                )}

                {albumsList && albumsList.length !== 0 ? (
                    <View style={styles.container}>
                        {albumsList.map((album: any, index: any) => (
                            <View key={index} style={{ marginBottom: 20 }}>
                                <Text
                                    fontSize={20}
                                    bold
                                    style={{ marginLeft: 20 }}>
                                    {album.title}
                                </Text>
                                <View style={styles.songsContainer}>
                                    {album.songs &&
                                    album.songs.length > 0 &&
                                    typeof album.songs[0] !== "string" ? (
                                        <ScrollView
                                            horizontal
                                            showScroll={false}
                                            top={10}
                                            bottom={10}>
                                            {album.songs.map(
                                                (
                                                    song: SongType,
                                                    index: any
                                                ) => (
                                                    <View
                                                        key={song.id + "index"}
                                                        style={{
                                                            marginHorizontal: 5,
                                                        }}>
                                                        <SongCover
                                                            song={song}
                                                            navigation={
                                                                navigation
                                                            }
                                                            vertical
                                                            onLongPress={() => {
                                                                setCurrentData(
                                                                    song
                                                                );
                                                                setBottomSheetOpen(
                                                                    true
                                                                );
                                                            }}
                                                        />
                                                    </View>
                                                )
                                            )}
                                        </ScrollView>
                                    ) : (
                                        <ScrollView
                                            horizontal
                                            showScroll={false}
                                            top={10}
                                            bottom={10}>
                                            {Array.from({ length: 10 }).map(
                                                (_, index) => (
                                                    <View
                                                        key={`tabara-skeleton-${index}`}
                                                        style={{
                                                            marginHorizontal: 5,
                                                        }}>
                                                        <SkeletonCover
                                                            vertical
                                                        />
                                                    </View>
                                                )
                                            )}
                                        </ScrollView>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.container}>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <View key={index} style={{ marginBottom: 20 }}>
                                <View style={{ marginLeft: 15 }}>
                                    <SkeletonText width={150} />
                                </View>
                                <View style={styles.songsContainer}>
                                    <ScrollView
                                        horizontal
                                        showScroll={false}
                                        top={10}
                                        bottom={10}>
                                        {Array.from({ length: 10 }).map(
                                            (_, index) => (
                                                <View
                                                    key={`tabara-skeleton-${index}`}
                                                    style={{
                                                        marginHorizontal: 5,
                                                    }}>
                                                    <SkeletonCover vertical />
                                                </View>
                                            )
                                        )}
                                    </ScrollView>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
            <DataBottomSheet
                data={currentData}
                isOpen={isBottomSheetOpen}
                onClose={() => {
                    setBottomSheetOpen(false);
                }}
                extraActions2={() => {
                    setBottomSheetOpen(false);
                    navigation.navigate("AddToAlbum", { currentData });
                }}
            />

            <Modal visible={isModalOpen} setVisible={setIsModalOpen}>
                <View
                    style={{
                        minHeight: 200,
                        width: screenWidth - 50,
                        overflow: "hidden",
                        position: "relative",
                    }}>
                    <TouchableOpacity
                        onPress={() => {
                            setIsModalOpen(false);
                        }}
                        activeOpacity={theme.activeOpacity}
                        style={{
                            position: "absolute",
                            right: -10,
                            top: -10,
                            zIndex: 1000,
                            padding: 10,
                        }}>
                        <MCIcons
                            name={"close"}
                            size={28}
                            color={theme.colors.textVariant}
                        />
                    </TouchableOpacity>
                    <View>
                        <View
                            style={{
                                width: "100%",
                                alignItems: "center",
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                marginBottom: 10,
                            }}>
                            <Text
                                fontSize={18}
                                color={theme.colors.textVariant}
                                center
                                bold
                                style={{
                                    width: 220,
                                    textAlign: "center",
                                }}>{t`Updates`}</Text>
                        </View>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <View>
                            {updates && updates.length > 0 ? (
                                updates
                                    .slice(0, 15)
                                    .map((update: UpdateType, index: any) => (
                                        <View
                                            key={`update-${index}`}
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                marginVertical: 3,
                                                paddingHorizontal: 5,
                                            }}>
                                            <Text
                                                bold
                                                style={{
                                                    fontSize: 12,
                                                    color: theme.colors
                                                        .textVariant,
                                                }}>
                                                {update.title.length > 19
                                                    ? update.title.substring(
                                                          0,
                                                          19
                                                      ) + "..."
                                                    : update.title}
                                            </Text>
                                            <Text
                                                bold
                                                style={{
                                                    fontSize: 12,
                                                    marginHorizontal: 10,
                                                }}>
                                                -
                                            </Text>
                                            <Text
                                                bold
                                                color={theme.colors.primary}
                                                style={{
                                                    fontSize: 12,
                                                }}>
                                                {update.updateType === "new"
                                                    ? t`New`
                                                    : update.updateType ===
                                                        "update"
                                                      ? t`Updated`
                                                      : t`Deleted`}
                                            </Text>
                                        </View>
                                    ))
                            ) : (
                                <Text
                                    fontSize={16}
                                    center
                                    style={{
                                        color: theme.colors.textVariant,
                                        marginVertical: 10,
                                    }}>
                                    {t`No updates available`}
                                </Text>
                            )}
                        </View>
                        {updates && updates.length > 15 && (
                            <Text
                                bold
                                color={theme.colors.textVariant}
                                style={{ marginLeft: 10 }}>
                                {t`And` +
                                    " " +
                                    (updates.length - 15) +
                                    " " +
                                    t`more`}
                            </Text>
                        )}
                    </View>
                </View>
            </Modal>
        </Background>
    );
};

export default Home;

const styles = StyleSheet.create({
    row: {
        display: "flex",
        marginVertical: 5,
        width: "100%",
    },
    songsContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
        marginHorizontal: -7.5,
    },
    container: {
        marginTop: 20,
    },
    recent: {
        marginHorizontal: 20,
    },
    topBar: {
        paddingBottom: 20,
        paddingHorizontal: 20,
        marginTop: -1.5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});
