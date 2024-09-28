import React, { useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { getImage } from "../../utils/covers";
import { getColorFromId } from "../../utils/util";
import Text from "../wrapers/text";

interface AlbumImageProps {
    cover: string | null | string[];
    vertical?: boolean;
    width?: number;
    title: string;
    id: string;
}

const AlbumImage = ({
    vertical = false,
    cover,
    width = 70,
    title,
    id,
}: AlbumImageProps) => {
    const calculatedDimensions = useMemo(() => {
        const adjustedWidth = Math.floor(width);

        let leftWidth = Math.floor(adjustedWidth / 2);
        let rightWidth = adjustedWidth - leftWidth;
        let leftHeight = leftWidth;
        let rightHeight = rightWidth;

        if (adjustedWidth % 2 === 1) leftHeight++;

        return { leftWidth, rightWidth, leftHeight, rightHeight };
    }, [width]);

    const renderCover = useMemo(() => {
        if (!cover || (typeof cover !== "string" && !Array.isArray(cover))) {
            return (
                <View
                    style={[
                        vertical ? styles.imageVertical : styles.image,
                        {
                            backgroundColor: getColorFromId(id.slice(1)),
                            justifyContent: "center",
                            alignItems: "center",
                            width,
                            height: width,
                            borderRadius: 12,
                        },
                    ]}>
                    <Text bold fontSize={vertical ? 50 : 30} color="#FFF">
                        {title[0].toUpperCase()}
                    </Text>
                </View>
            );
        }

        if (!Array.isArray(cover) || cover.length < 3) {
            return cover?.includes("file") || cover === "favorites" ? (
                <Image
                    source={
                        !Array.isArray(cover) ? getImage(cover) : getImage(null)
                    }
                    style={[
                        vertical ? styles.imageVertical : styles.image,
                        {
                            width,
                            height: width,
                        },
                    ]}
                />
            ) : (
                <View
                    style={[
                        vertical ? styles.imageVertical : styles.image,
                        {
                            backgroundColor: getColorFromId(
                                typeof cover === "string"
                                    ? cover.slice(1)
                                    : cover[0].slice(1)
                            ),
                            justifyContent: "center",
                            alignItems: "center",
                            width,
                            height: width,
                            borderRadius: 12,
                        },
                    ]}>
                    <Text bold fontSize={vertical ? 50 : 30} color="#FFF">
                        {typeof cover === "string"
                            ? cover[0].toUpperCase()
                            : cover[0].toUpperCase()}
                    </Text>
                </View>
            );
        }

        return null;
    }, [cover, id, title, vertical, width]);

    const renderMultiCover = useMemo(() => {
        if (!Array.isArray(cover) || cover.length < 3) return null;

        const { leftWidth, rightWidth, leftHeight, rightHeight } =
            calculatedDimensions;

        return (
            <View>
                <View style={styles.row}>
                    {cover[0].includes("file") ? (
                        <Image
                            source={getImage(cover[0])}
                            style={[
                                vertical
                                    ? styles.smallImageVertical
                                    : styles.smallImage,
                                {
                                    width: leftWidth,
                                    height: leftHeight,
                                    borderTopLeftRadius: 12,
                                },
                            ]}
                        />
                    ) : (
                        <View
                            style={[
                                vertical
                                    ? styles.smallImageVertical
                                    : styles.smallImage,
                                {
                                    backgroundColor: getColorFromId(
                                        cover[0].slice(1)
                                    ),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: leftWidth,
                                    height: leftHeight,
                                    borderTopLeftRadius: 12,
                                },
                            ]}>
                            <Text
                                bold
                                fontSize={vertical ? 35 : 20}
                                color="#FFF">
                                {cover[0][0].toUpperCase()}
                            </Text>
                        </View>
                    )}
                    {cover[1].includes("file") ? (
                        <Image
                            source={getImage(cover[1])}
                            style={[
                                vertical
                                    ? styles.smallImageVertical
                                    : styles.smallImage,
                                {
                                    borderTopRightRadius: 12,
                                    width: rightWidth,
                                    height: rightHeight,
                                },
                            ]}
                        />
                    ) : (
                        <View
                            style={[
                                vertical
                                    ? styles.smallImageVertical
                                    : styles.smallImage,
                                {
                                    backgroundColor: getColorFromId(
                                        cover[1].slice(1)
                                    ),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: rightWidth,
                                    height: rightHeight,
                                    borderTopRightRadius: 12,
                                },
                            ]}>
                            <Text
                                bold
                                fontSize={vertical ? 35 : 20}
                                color="#FFF">
                                {cover[1][0].toUpperCase()}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={styles.row}>
                    {cover[2].includes("file") ? (
                        <Image
                            source={getImage(cover[2])}
                            style={[
                                vertical
                                    ? styles.smallImageVertical
                                    : styles.smallImage,
                                {
                                    borderBottomLeftRadius: 12,
                                    width: leftWidth,
                                    height: leftHeight,
                                },
                            ]}
                        />
                    ) : (
                        <View
                            style={[
                                vertical
                                    ? styles.smallImageVertical
                                    : styles.smallImage,
                                {
                                    backgroundColor: getColorFromId(
                                        cover[2].slice(1)
                                    ),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: leftWidth,
                                    height: leftHeight,
                                    borderBottomLeftRadius: 12,
                                },
                            ]}>
                            <Text
                                bold
                                fontSize={vertical ? 35 : 20}
                                color="#FFF">
                                {cover[2][0].toUpperCase()}
                            </Text>
                        </View>
                    )}
                    {cover[3].includes("file") ? (
                        <Image
                            source={getImage(cover[3])}
                            style={[
                                vertical
                                    ? styles.smallImageVertical
                                    : styles.smallImage,
                                {
                                    borderBottomRightRadius: 12,
                                    width: rightWidth,
                                    height: rightHeight,
                                },
                            ]}
                        />
                    ) : (
                        <View
                            style={[
                                vertical
                                    ? styles.smallImageVertical
                                    : styles.smallImage,
                                {
                                    backgroundColor: getColorFromId(
                                        cover[3].slice(1)
                                    ),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: rightWidth,
                                    height: rightHeight,
                                    borderBottomRightRadius: 12,
                                },
                            ]}>
                            <Text
                                bold
                                fontSize={vertical ? 35 : 20}
                                color="#FFF">
                                {cover[3][0].toUpperCase()}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        );
    }, [cover, calculatedDimensions, vertical]);

    return <View>{renderCover || renderMultiCover}</View>;
};

export default AlbumImage;

const styles = StyleSheet.create({
    imageVertical: {
        width: 95,
        height: 95,
        borderRadius: 12,
    },
    image: { width: 70, height: 70, borderRadius: 12 },

    smallImageVertical: {
        width: 48,
        height: 48,
    },
    smallImage: { width: 35, height: 35 },
    row: {
        display: "flex",
        flexDirection: "row",
    },
});
