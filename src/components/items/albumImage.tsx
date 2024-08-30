import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { getImage } from "../../utils/covers";

interface AlbumImageProps {
    cover: string | null | string[];
    vertical?: boolean;
}

const AlbumImage = ({ vertical = false, cover }: AlbumImageProps) => {
    if (!Array.isArray(cover) || cover.length < 3)
        return (
            <Image
                source={
                    !Array.isArray(cover) ? getImage(cover) : getImage(null)
                }
                style={vertical ? styles.imageVertical : styles.image}
            />
        );

    return (
        <View
            style={{
                marginRight: vertical ? 0 : 8,
            }}>
            <View style={styles.row}>
                <Image
                    source={getImage(cover[0])}
                    style={[
                        vertical
                            ? styles.smallImageVertical
                            : styles.smallImage,
                        {
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
    image: { width: 70, height: 70, borderRadius: 15, marginRight: 8 },

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
