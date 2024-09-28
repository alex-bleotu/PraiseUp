import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { getImage } from "../../utils/covers";
import { getColorFromId } from "../../utils/util";
import Text from "../wrapers/text";

interface SongImageProps {
    cover: string | null;
    vertical?: boolean;
    width?: any;
    title: string;
    id: string;
}

const SongImage = ({
    vertical = false,
    cover,
    width,
    title,
    id,
}: SongImageProps) => {
    if (cover)
        return (
            <Image
                source={getImage(cover)}
                style={[
                    vertical ? styles.imageVertical : styles.image,
                    {
                        width: width,
                        height: width,
                    },
                ]}
            />
        );

    return (
        <View
            style={[
                vertical ? [styles.imageVertical] : styles.image,
                {
                    backgroundColor: getColorFromId(id.slice(1)),
                    justifyContent: "center",
                    alignItems: "center",
                    width: width,
                    height: width,
                },
            ]}>
            <Text bold fontSize={vertical ? 50 : 30} color="#FFF">
                {title.charAt(0).toUpperCase()}
            </Text>
        </View>
    );
};

export default SongImage;

const styles = StyleSheet.create({
    imageVertical: {
        borderRadius: 10,
    },
    image: { borderRadius: 12 },
});
