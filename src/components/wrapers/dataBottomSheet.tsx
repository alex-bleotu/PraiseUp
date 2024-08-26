import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import { t } from "@lingui/macro";
import * as Linking from "expo-linking";
import React, { useContext, useEffect, useState } from "react";
import { Image, Share, StyleSheet, TouchableOpacity, View } from "react-native";
import { AlbumType, DataContext, isSong, SongType } from "../../context/data";
import { RefreshContext } from "../../context/refresh";
import { ThemeContext } from "../../context/theme";
import { getImage } from "../../utils/images";
import AlbumImage from "../items/albumImage";
import BottomSheetModal from "./bottomSheetModal";
import Text from "./text";

interface DataBottomSheetProps {
    data: SongType | AlbumType | null;
    isOpen: boolean;
    onClose: () => void;
}

const DataBottomSheet = ({
    data: d,
    isOpen,
    onClose,
}: DataBottomSheetProps) => {
    const { theme } = useContext(ThemeContext);
    const { setFavorite, getById } = useContext(DataContext);
    const { updateRefresh } = useContext(RefreshContext);

    const [data, setData] = useState<SongType | AlbumType | null>(null);

    useEffect(() => {
        const load = async () => {
            if (d !== null) setData(await getById(d.id));
        };

        load();
    }, [d]);

    if (data === null) return <></>;

    return (
        <BottomSheetModal
            isOpen={isOpen}
            onClose={onClose}
            numberOfButtons={isSong(data) ? 3 : 2}>
            <View>
                <View style={styles.top}>
                    {isSong(data) ? (
                        <Image
                            source={getImage(data.cover)}
                            style={styles.image}
                        />
                    ) : (
                        <AlbumImage cover={data.cover} />
                    )}
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
                        onPress={async () => {
                            if (data !== null) {
                                await setFavorite(data.id, !data.favorite);
                                setData(await getById(data.id));

                                updateRefresh();
                            }
                        }}>
                        <View style={styles.button}>
                            <MCIcons
                                name={data.favorite ? "heart" : "heart-outline"}
                                size={30}
                                color={theme.colors.text}
                            />
                            <Text size={17} style={styles.text}>
                                {t`Favorite`}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {isSong(data) && (
                        <TouchableOpacity
                            activeOpacity={theme.activeOpacity}
                            onPress={() => {}}>
                            <View style={styles.button}>
                                <MCIcons
                                    name="plus-circle-outline"
                                    size={30}
                                    color={theme.colors.text}
                                />
                                <Text size={17} style={styles.text}>
                                    {t`Add to playlist`}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        activeOpacity={theme.activeOpacity}
                        onPress={async () => {
                            let url;

                            if (isSong(data))
                                url = Linking.createURL(`song/${data.id}`);
                            else url = Linking.createURL(`album/${data.id}`);

                            try {
                                await Share.share({
                                    message: `${t`Check out this`} ${url}`,
                                });
                            } catch (error) {
                                console.log(error);
                            }
                        }}>
                        <View style={styles.button}>
                            <MCIcons
                                name="share-variant-outline"
                                size={30}
                                color={theme.colors.text}
                            />
                            <Text size={17} style={styles.text}>
                                {t`Share`}
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
