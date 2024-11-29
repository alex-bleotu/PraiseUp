import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import { t } from "@lingui/macro";
import React, { useContext, useEffect, useState } from "react";

import {
    Linking,
    Share,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { AlbumType, DataContext, SongType } from "../../context/data";
import { LanguageContext } from "../../context/language";
import { RecentContext } from "../../context/recent";
import { RefreshContext } from "../../context/refresh";
import { ThemeContext } from "../../context/theme";
import { UserContext } from "../../context/user";
import { getBibleLink, translateVerse } from "../../utils/util";
import AlbumImage from "../items/albumImage";
import SongImage from "../items/songImage";
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
    slideshow?: () => void;
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
    slideshow,
}: DataBottomSheetProps) => {
    const { theme } = useContext(ThemeContext);
    const {
        setFavorite,
        getById,
        deletePersonalAlbum,
        updatePersonalAlbum,
        removeSongFromPersonalAlbum,
        getFavoriteSongsAlbum,
        removePersonalAlbumFromUser,
    } = useContext(DataContext);
    const { refresh, updateRefresh } = useContext(RefreshContext);
    const { updateRecent } = useContext(RecentContext);
    const { user } = useContext(UserContext);
    const { language } = useContext(LanguageContext);

    const [data, setData] = useState<SongType | AlbumType | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [editAlbum, setEditAlbum] = useState(false);
    const [moreInfo, setMoreInfo] = useState(false);
    const [name, setName] = useState("");

    useEffect(() => {
        const load = async () => {
            if (d !== null) {
                setData(await getById(d.id));

                setName(d.title);
            }
        };

        load();
    }, [d, refresh]);

    if (data === null || data === undefined) return <></>;

    let numberOfButtons;

    if (data.type === "personal") {
        if (data.creator === user.uid) numberOfButtons = 3;
        else numberOfButtons = 2;
    } else if (data.type === "album") numberOfButtons = 2;
    else if (data.type === "song") {
        if (zoom) numberOfButtons = 6;
        else if (removeSong) numberOfButtons = 5;
        else numberOfButtons = 4;
    } else numberOfButtons = 3;

    return (
        <>
            <BottomSheetModal
                isOpen={isOpen && !editAlbum && !moreInfo}
                onClose={onClose}
                numberOfButtons={numberOfButtons}>
                <View>
                    <View style={styles.top}>
                        {data?.type === "song" ? (
                            <SongImage
                                cover={data.cover}
                                title={data.title}
                                id={data.id}
                                width={60}
                            />
                        ) : (
                            <AlbumImage
                                cover={data.cover}
                                width={60}
                                id={data.id}
                                title={data.title}
                            />
                        )}
                        <View
                            style={{
                                marginLeft: 10,
                                flexShrink: 1,
                            }}>
                            <Text
                                bold
                                fontSize={18}
                                numberOfLines={1}
                                ellipsizeMode="tail">
                                {data.title}
                            </Text>
                            {data?.type === "song" && (
                                <Text
                                    fontSize={15}
                                    numberOfLines={1}
                                    ellipsizeMode="tail">
                                    {data.artist
                                        ? data.artist
                                        : t`Unknown Artist`}
                                </Text>
                            )}
                            {(data?.type === "album" ||
                                data?.type === "personal") &&
                                data?.creatorName && (
                                    <Text
                                        fontSize={15}
                                        numberOfLines={1}
                                        ellipsizeMode="tail">
                                        {data.creatorName}
                                    </Text>
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
                        {slideshow && (
                            <TouchableOpacity
                                activeOpacity={theme.activeOpacity}
                                onPress={async () => {
                                    if (data !== null) {
                                        slideshow();
                                    }
                                }}>
                                <View style={styles.button}>
                                    <MCIcons
                                        name={"presentation"}
                                        size={30}
                                        color={theme.colors.text}
                                    />
                                    <Text fontSize={17} style={styles.text}>
                                        {t`Slideshow`}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        {data?.type !== "personal" ? (
                            <TouchableOpacity
                                activeOpacity={theme.activeOpacity}
                                onPress={async () => {
                                    if (data !== null) {
                                        const array = await setFavorite(
                                            data.id,
                                            !data.favorite
                                        );

                                        setData(await getById(data.id));

                                        updateRefresh();

                                        if (extraData?.type === "favorite") {
                                            let fav =
                                                await getFavoriteSongsAlbum();

                                            fav.songs = array;

                                            updateData && updateData(fav);
                                        }
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
                                {data.creator === user.uid ? (
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
                                                <Text
                                                    fontSize={17}
                                                    style={styles.text}>
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
                                                    name={
                                                        "delete-empty-outline"
                                                    }
                                                    size={30}
                                                    color={theme.colors.text}
                                                />
                                                <Text
                                                    fontSize={17}
                                                    style={styles.text}>
                                                    {t`Delete album`}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <TouchableOpacity
                                            activeOpacity={theme.activeOpacity}
                                            onPress={async () => {
                                                setIsRemoveModalOpen(true);
                                            }}>
                                            <View style={styles.button}>
                                                <MCIcons
                                                    name={
                                                        "heart-remove-outline"
                                                    }
                                                    size={30}
                                                    color={theme.colors.text}
                                                />
                                                <Text
                                                    fontSize={17}
                                                    style={styles.text}>
                                                    {t`Remove album`}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </>
                        )}
                        {data?.type === "song" && (
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
                                                ? t`Add to other album`
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
                                {data.extraData && (
                                    <TouchableOpacity
                                        activeOpacity={theme.activeOpacity}
                                        onPress={() => {
                                            if (data !== null) {
                                                setMoreInfo(true);
                                            }
                                        }}>
                                        <View style={styles.button}>
                                            <MCIcons
                                                name="information-outline"
                                                size={30}
                                                color={theme.colors.text}
                                            />
                                            <Text
                                                fontSize={17}
                                                style={styles.text}>
                                                {t`More info`}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </>
                        )}
                        <TouchableOpacity
                            activeOpacity={theme.activeOpacity}
                            onPress={async () => {
                                let url = "https://praiseup.alexbleotu.com/";

                                if (data?.type === "song")
                                    url = url + `song/${data.id}`;
                                else if (data?.type === "album")
                                    url = url + `album/${data.id}`;
                                else if (data?.type === "personal")
                                    url = url + `personal/${data.id}`;

                                try {
                                    await Share.share({
                                        message: `${
                                            t`Check this out on PraiseUp!` +
                                            "\n\n"
                                        }${url}`,
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
                                    width: 220,
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
                <Modal
                    visible={isRemoveModalOpen}
                    onClose={() => {}}
                    setVisible={setIsRemoveModalOpen}>
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
                                    width: 220,
                                }}>{t`Are you sure you want to remove this album from your library?`}</Text>
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
                                    setIsRemoveModalOpen(false);
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
                                        removePersonalAlbumFromUser(
                                            data.id
                                        ).then(() => {
                                            updateRecent();
                                            updateRefresh();
                                            onClose();
                                            setIsRemoveModalOpen(false);
                                            extraActions && extraActions();
                                        });
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
                                    {t`Remove`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </BottomSheetModal>
            {data.type === "personal" && (
                <BottomSheetModal
                    isOpen={editAlbum}
                    onClose={() => {
                        setEditAlbum(false);
                    }}>
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
                                            backgroundColor:
                                                theme.colors.darkPaper,
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
                                                updateData &&
                                                    updateData(newAlbum);
                                            }
                                        );
                                    }}
                                    activeOpacity={theme.activeOpacity}
                                    disabled={name.length === 0}
                                    style={[
                                        styles.buttonModal,
                                        {
                                            backgroundColor:
                                                theme.colors.primary,
                                            opacity: name.length > 0 ? 1 : 0.5,
                                        },
                                    ]}>
                                    <Text
                                        fontSize={14}
                                        bold
                                        upper
                                        center
                                        color={theme.colors.textOnPrimary}>
                                        {t`Save`}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </BottomSheetModal>
            )}
            {data.type === "song" && data.extraData && (
                <BottomSheetModal
                    isOpen={moreInfo}
                    onClose={() => {
                        setMoreInfo(false);
                    }}>
                    <View
                        style={{
                            marginHorizontal: 20,
                        }}>
                        <Text bold fontSize={22}>
                            {data.title}
                        </Text>

                        <View style={{ marginTop: 15 }} />
                        {data.extraData.year && (
                            <Text fontSize={16}>
                                {t`Created in` + " "}
                                <Text bold fontSize={16}>
                                    {data.extraData.year}
                                </Text>
                                {"."}
                            </Text>
                        )}
                        {data.extraData.originalTitle && (
                            <Text fontSize={16}>
                                {t`Original title is` + " "}
                                <Text bold fontSize={16}>
                                    {data.extraData.originalTitle}
                                </Text>
                                {"."}
                            </Text>
                        )}
                        {data.extraData.verses && (
                            <>
                                <View style={styles.verseContainer}>
                                    {data.extraData?.verses?.map(
                                        (verse, index) => (
                                            <TouchableOpacity
                                                activeOpacity={
                                                    theme.activeOpacity
                                                }
                                                onPress={() => {
                                                    if (
                                                        data.extraData?.verses
                                                    ) {
                                                        Linking.openURL(
                                                            getBibleLink(
                                                                verse,
                                                                language
                                                            )
                                                        );
                                                    }
                                                }}
                                                style={[
                                                    styles.verse,
                                                    {
                                                        backgroundColor:
                                                            theme.colors
                                                                .darkPaper,
                                                    },
                                                ]}
                                                key={index}>
                                                <Text
                                                    key={index}
                                                    bold
                                                    fontSize={15}>
                                                    {language === "en"
                                                        ? verse
                                                        : translateVerse(verse)}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    )}
                                </View>
                            </>
                        )}
                        {data.extraData.link && (
                            <TouchableOpacity
                                onPress={() => {
                                    if (data.extraData?.link) {
                                        Linking.openURL(data.extraData.link);
                                    }
                                }}
                                activeOpacity={theme.activeOpacity}
                                disabled={name.length === 0}
                                style={[
                                    styles.buttonModal,
                                    {
                                        backgroundColor: theme.colors.primary,
                                        opacity: name.length > 0 ? 1 : 0.5,
                                        marginTop: 25,
                                    },
                                ]}>
                                <Text
                                    fontSize={14}
                                    bold
                                    upper
                                    center
                                    color={theme.colors.textOnPrimary}>
                                    {t`Watch the video`}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </BottomSheetModal>
            )}
        </>
    );
};

export default DataBottomSheet;

const styles = StyleSheet.create({
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
    verseContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 15,
    },
    verse: {
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 8,
        marginRight: 10,
    },
});
