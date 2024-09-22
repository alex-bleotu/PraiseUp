import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { getImage } from "../../utils/covers";

interface AlbumImageProps {
    cover: string | null | string[];
    vertical?: boolean;
    width?: number;
}

const AlbumImage = ({ vertical = false, cover, width }: AlbumImageProps) => {
    if (!Array.isArray(cover) || cover.length < 3)
        return (
            <Image
                source={
                    !Array.isArray(cover) ? getImage(cover) : getImage(null)
                }
                style={[
                    vertical ? styles.imageVertical : styles.image,
                    {
                        width: width || 70,
                        height: width || 70,
                    },
                ]}
            />
        );

    width = Math.floor(width || 70);

    let leftWidth = 35;
    let rightWidth = 35;
    let leftHeight = 35;
    let rightHeight = 35;

    if (width && width % 2 == 1) {
        leftWidth = width / 2 + 1;
        rightWidth = leftWidth;
        leftHeight = leftWidth;
        rightHeight = rightWidth;
    } else if (width) {
        leftWidth = width / 2;
        rightWidth = leftWidth;
        leftHeight = leftWidth;
        rightHeight = rightWidth;
    }

    return (
        <View>
            <View style={styles.row}>
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
            </View>
            <View style={styles.row}>
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
            </View>
        </View>
    );
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
