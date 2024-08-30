import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import { t } from "@lingui/macro";
import * as Linking from "expo-linking";
import React, { useContext, useEffect, useState } from "react";
import { Image, Share, StyleSheet, TouchableOpacity, View } from "react-native";
import { AlbumType, DataContext, isSong, SongType } from "../../context/data";
import { RecentContext } from "../../context/recent";
import { RefreshContext } from "../../context/refresh";
import { ThemeContext } from "../../context/theme";
import { getImage } from "../../utils/covers";
import AlbumImage from "../items/albumImage";
import BottomSheetModal from "./bottomSheetModal";
import Input from "./input";
import Modal from "./modal";
import Text from "./text";

interface DataBottomSheetProps {
    data: SongType | AlbumType | null;
    isOpen: boolean;
    zoom?: (zoom: boolean) => void;
    onClose: () => void;
    extraActions?: () => void;
    extraData?: any;
    extraActions2?: () => void;
    removeSong?: boolean;
    updateData?: any;
}

const DataBottomSheet = ({
    data: d,
    isOpen,
    zoom,
    onClose,
    extraActions,
    extraActions2,
    removeSong,
    extraData,
    updateData,
}: DataBottomSheetProps) => {
    const { theme } = useContext(ThemeContext);
    const {
        setFavorite,
        getById,
        deletePersonalAlbum,
        updatePersonalAlbum,
        removeSongFromPersonalAlbum,
    } = useContext(DataContext);
    const { updateRefresh } = useContext(RefreshContext);
    const { updateRecent } = useContext(RecentContext);

    const [data, setData] = useState<SongType | AlbumType | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editAlbum, setEditAlbum] = useState(false);
    const [name, setName] = useState("");

    useEffect(() => {
        const load = async () => {
            if (d !== null) {
                setData(await getById(d.id));
                setName(d.title);
            }
        };

        load();
    }, [d]);

    if (data === null) return <></>;

    return (
        <>
            <BottomSheetModal
                isOpen={isOpen && !editAlbum}
                onClose={onClose}
                numberOfButtons={
                    data.id.startsWith("P") || isSong(data)
                        ? zoom || removeSong
                            ? 4
                            : 3
                        : 2
                }>
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
                            <Text bold fontSize={18}>
                                {data.title}
                            </Text>
                            {isSong(data) && (
                                <Text fontSize={15}>{data.artist}</Text>
                            )}
                        </View>
                    </View>
                    <View
                        style={[
                            styles.line,
                            { backgroundColor: theme.colors.lightGrey },
                        ]}
                    />
                    <View style={styles.buttons}>
                        {zoom && (
                            <View>
                                <View style={styles.button}>
                                    <MCIcons
                                        name={"magnify"}
                                        size={30}
                                        color={theme.colors.text}
                                    />
                                    <Text fontSize={17} style={styles.text}>
                                        {t`Zoom`}
                                    </Text>
                                    <View style={styles.zoomButtons}>
                                        <TouchableOpacity
                                            activeOpacity={theme.activeOpacity}
                                            style={{ marginRight: 10 }}
                                            onPress={() => {
                                                zoom(true);
                                            }}>
                                            <MCIcons
                                                name={"plus-circle-outline"}
                                                size={30}
                                                color={theme.colors.text}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={theme.activeOpacity}
                                            onPress={() => {
                                                zoom(false);
                                            }}>
                                            <MCIcons
                                                name={"minus-circle-outline"}
                                                size={30}
                                                color={theme.colors.text}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}

                        {!data.id.startsWith("P") ? (
                            <TouchableOpacity
                                activeOpacity={theme.activeOpacity}
                                onPress={async () => {
                                    if (data !== null) {
                                        await setFavorite(
                                            data.id,
                                            !data.favorite
                                        );
                                        setData(await getById(data.id));

                                        updateRefresh();
                                    }
                                }}>
                                <View style={styles.button}>
                                    <MCIcons
                                        name={
                                            data.favorite
                                                ? "heart"
                                                : "heart-outline"
                                        }
                                        size={30}
                                        color={theme.colors.text}
                                    />
                                    <Text fontSize={17} style={styles.text}>
                                        {t`Favorite`}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <>
                                <TouchableOpacity
                                    activeOpacity={theme.activeOpacity}
                                    onPress={async () => {
                                        if (data !== null) {
                                            setEditAlbum(true);
                                        }
                                    }}>
                                    <View style={styles.button}>
                                        <MCIcons
                                            name={"pencil-outline"}
                                            size={30}
                                            color={theme.colors.text}
                                        />
                                        <Text fontSize={17} style={styles.text}>
                                            {t`Edit album`}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={theme.activeOpacity}
                                    onPress={async () => {
                                        setIsDeleteModalOpen(true);
                                    }}>
                                    <View style={styles.button}>
                                        <MCIcons
                                            name={"delete-empty-outline"}
                                            size={30}
                                            color={theme.colors.text}
                                        />
                                        <Text fontSize={17} style={styles.text}>
                                            {t`Delete album`}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </>
                        )}
                        {isSong(data) && (
                            <>
                                <TouchableOpacity
                                    activeOpacity={theme.activeOpacity}
                                    onPress={() => {
                                        extraActions2 && extraActions2();
                                    }}>
                                    <View style={styles.button}>
                                        <MCIcons
                                            name="plus-circle-outline"
                                            size={30}
                                            color={theme.colors.text}
                                        />
                                        <Text fontSize={17} style={styles.text}>
                                            {removeSong
                                                ? t`Add to other playlist`
                                                : t`Add to album`}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {removeSong && (
                                    <TouchableOpacity
                                        activeOpacity={theme.activeOpacity}
                                        onPress={() => {
                                            removeSongFromPersonalAlbum(
                                                extraData,
                                                data
                                            ).then((newAlbum: AlbumType) => {
                                                updateRefresh();
                                                updateRecent();
                                                onClose();
                                                updateData &&
                                                    updateData(newAlbum);
                                            });
                                        }}>
                                        <View style={styles.button}>
                                            <MCIcons
                                                name="minus-circle-outline"
                                                size={30}
                                                color={theme.colors.text}
                                            />
                                            <Text
                                                fontSize={17}
                                                style={styles.text}>
                                                {t`Remove from this album`}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </>
                        )}
                        <TouchableOpacity
                            activeOpacity={theme.activeOpacity}
                            onPress={async () => {
                                let url;

                                if (isSong(data))
                                    url = Linking.createURL(`song/${data.id}`);
                                else
                                    url = Linking.createURL(`album/${data.id}`);

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
                                <Text fontSize={17} style={styles.text}>
                                    {t`Share`}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal
                    visible={isDeleteModalOpen}
                    onClose={() => {}}
                    setVisible={setIsDeleteModalOpen}>
                    <View>
                        <View
                            style={{
                                width: "100%",
                                alignItems: "center",
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                            }}>
                            <Text
                                fontSize={18}
                                color={theme.colors.textVariant}
                                center
                                style={{
                                    width: 250,
                                }}>{t`Are you sure you want to delete this album?`}</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 30,
                        }}>
                        <View style={{ width: "47%" }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setIsDeleteModalOpen(false);
                                }}
                                activeOpacity={theme.activeOpacity}
                                style={[
                                    styles.buttonModal,
                                    {
                                        backgroundColor: theme.colors.darkPaper,
                                    },
                                ]}>
                                <Text fontSize={14} bold upper center>
                                    {t`Cancel`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: "47%" }}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (data !== null) {
                                        deletePersonalAlbum(data.id).then(
                                            () => {
                                                updateRecent();
                                                updateRefresh();
                                                onClose();
                                                setIsDeleteModalOpen(false);
                                                extraActions && extraActions();
                                            }
                                        );
                                    }
                                }}
                                activeOpacity={theme.activeOpacity}
                                style={[
                                    styles.buttonModal,
                                    {
                                        backgroundColor: theme.colors.danger,
                                    },
                                ]}>
                                <Text
                                    fontSize={14}
                                    bold
                                    upper
                                    center
                                    color={theme.colors.white}>
                                    {t`Delete`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </BottomSheetModal>
            <BottomSheetModal
                isOpen={editAlbum}
                onClose={() => {
                    setEditAlbum(false);
                }}
                height={225}>
                <View
                    style={{
                        marginHorizontal: 20,
                    }}>
                    <Text bold fontSize={20}>
                        {t`Edit your album`}
                    </Text>
                    <Input
                        placeholder={t`Album Name`}
                        value={name}
                        onChange={setName}
                        style={{ marginTop: 20 }}
                        maxLength={32}
                        autoCapitalize
                    />
                    <View style={styles.buttonContainer}>
                        <View style={{ width: "47%" }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setEditAlbum(false);
                                    setName(data.title);
                                }}
                                activeOpacity={theme.activeOpacity}
                                style={[
                                    styles.buttonModal,
                                    {
                                        backgroundColor: theme.colors.darkPaper,
                                    },
                                ]}>
                                <Text fontSize={14} bold upper center>
                                    {t`Cancel`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: "47%" }}>
                            <TouchableOpacity
                                onPress={() => {
                                    updatePersonalAlbum(data, name).then(
                                        (newAlbum: AlbumType) => {
                                            setData(newAlbum);
                                            setEditAlbum(false);
                                            updateRefresh();
                                            updateRecent();
                                            updateData && updateData(newAlbum);
                                        }
                                    );
                                }}
                                activeOpacity={theme.activeOpacity}
                                disabled={name.length === 0}
                                style={[
                                    styles.buttonModal,
                                    {
                                        backgroundColor: theme.colors.primary,
                                        opacity: name.length > 0 ? 1 : 0.5,
                                    },
                                ]}>
                                <Text
                                    fontSize={14}
                                    bold
                                    upper
                                    center
                                    color={theme.colors.textInverted}>
                                    {t`Save`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </BottomSheetModal>
        </>
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
    zoomButtons: {
        display: "flex",
        flexDirection: "row",
        marginLeft: "auto",
    },
    buttonModal: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 12,
        justifyContent: "center",
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
});
