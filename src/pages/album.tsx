import React from "react";
import { StyleSheet, Text } from "react-native";
import StackPage from "../components/wrapers/stackPage";
import { getSongById } from "../utils/data";

interface AlbumProps {
    route: any;
    navigation: any;
}

const Album = ({ route, navigation }: AlbumProps) => {
    const { id } = route.params;

    const song = getSongById(id);

    if (!song)
        return (
            <StackPage navigation={navigation} title="Album">
                <Text>Not found</Text>
            </StackPage>
        );

    return (
        <StackPage navigation={navigation} title={song.name}>
            <Text>Album</Text>
        </StackPage>
    );
};

export default Album;

const styles = StyleSheet.create({});
