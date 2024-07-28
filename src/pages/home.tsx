import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import AlbumCover from "../components/items/albumCover";
import SongCover from "../components/items/songCover";
import Background from "../components/wrapers/background";
import { RecentContext } from "../context/recent";
import { getSongById } from "../utils/data";

const Home = ({ navigation }: { navigation: any }) => {
    const { recent } = useContext(RecentContext);

    return (
        <Background>
            {recent.length > 1 && (
                <View style={styles.songRow}>
                    {getSongById(recent[0])?.type === "song" ? (
                        <SongCover id={recent[0]} navigation={navigation} />
                    ) : (
                        <AlbumCover id={recent[0]} navigation={navigation} />
                    )}
                    <View style={{ width: 10 }} />
                    {getSongById(recent[1])?.type === "song" ? (
                        <SongCover id={recent[1]} navigation={navigation} />
                    ) : (
                        <AlbumCover id={recent[1]} navigation={navigation} />
                    )}
                </View>
            )}
            {recent.length > 3 && (
                <View style={styles.songRow}>
                    {getSongById(recent[2])?.type === "song" ? (
                        <SongCover id={recent[2]} navigation={navigation} />
                    ) : (
                        <AlbumCover id={recent[2]} navigation={navigation} />
                    )}
                    <View style={{ width: 10 }} />
                    {getSongById(recent[3])?.type === "song" ? (
                        <SongCover id={recent[3]} navigation={navigation} />
                    ) : (
                        <AlbumCover id={recent[3]} navigation={navigation} />
                    )}
                </View>
            )}
            {recent.length > 5 && (
                <View style={styles.songRow}>
                    {getSongById(recent[4])?.type === "song" ? (
                        <SongCover id={recent[4]} navigation={navigation} />
                    ) : (
                        <AlbumCover id={recent[4]} navigation={navigation} />
                    )}
                    <View style={{ width: 10 }} />
                    {getSongById(recent[5])?.type === "song" ? (
                        <SongCover id={recent[5]} navigation={navigation} />
                    ) : (
                        <AlbumCover id={recent[5]} navigation={navigation} />
                    )}
                </View>
            )}
        </Background>
    );
};

export default Home;

const styles = StyleSheet.create({
    songRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
        marginBottom: 5,
        width: "100%",
    },
});
