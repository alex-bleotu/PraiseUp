import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { AlbumType, isSong, SongType } from "../../context/data";
import { ThemeContext } from "../../context/theme";
import BottomSheetModal from "./bottomSheetModal";
import Text from "./text";

interface DataBottomSheetProps {
    data: SongType | AlbumType | null;
    isOpen: boolean;
    onClose: () => void;
}

const DataBottomSheet = ({ data, isOpen, onClose }: DataBottomSheetProps) => {
    const { theme } = useContext(ThemeContext);

    if (data === null) return <></>;

    return (
        <BottomSheetModal isOpen={isOpen} onClose={onClose}>
            <View>
                <View style={styles.top}>
                    <Image
                        source={require("../../../assets/images/songCover.png")}
                        style={styles.image}
                    />
                    <View>
                        <Text bold size={18}>
                            {data.title}
                        </Text>
                        {isSong(data) && <Text size={15}>{data.artist}</Text>}
                    </View>
                </View>
                <View
                    style={[
                        styles.line,
                        { backgroundColor: theme.colors.lightGrey },
                    ]}
                />
                <View style={styles.buttons}>
                    <TouchableOpacity
                        activeOpacity={theme.activeOpacity}
                        onPress={() => console.log("Favorite")}>
                        <View style={styles.button}>
                            <MCIcons
                                name="heart-outline"
                                size={30}
                                color={theme.colors.text}
                            />
                            <Text size={17} style={styles.text}>
                                Favorite
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={theme.activeOpacity}
                        onPress={() => console.log("Add to playlist")}>
                        <View style={styles.button}>
                            <MCIcons
                                name="plus-circle-outline"
                                size={30}
                                color={theme.colors.text}
                            />
                            <Text size={17} style={styles.text}>
                                Add to playlist
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={theme.activeOpacity}
                        onPress={() => console.log("Share")}>
                        <View style={styles.button}>
                            <MCIcons
                                name="share-variant-outline"
                                size={30}
                                color={theme.colors.text}
                            />
                            <Text size={17} style={styles.text}>
                                Share
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheetModal>
    );
};

export default DataBottomSheet;

const styles = StyleSheet.create({
    image: {
        width: 60,
        height: 60,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "black",
        marginRight: 15,
    },
    top: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: -5,
    },
    line: {
        height: 1,
        marginVertical: 15,
    },
    buttons: {
        display: "flex",
        marginHorizontal: 20,
        marginTop: -5,
    },
    button: {
        width: "100%",
        marginVertical: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        marginLeft: 15,
    },
});
