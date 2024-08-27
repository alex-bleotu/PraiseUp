import { Image, StyleSheet, View } from "react-native";
import AnimatedTouchable from "./animatedTouchable";
import Text from "./text";

interface IconButtonProps {
    src: any;
    bgcolor?: string;
    color?: string;
    text: string;
    style?: any;
    onPress?: any;
}

const IconButton = ({
    src,
    bgcolor,
    color,
    text,
    style,
    onPress,
}: IconButtonProps) => {
    return (
        <AnimatedTouchable
            onPress={onPress}
            style={{
                width: "100%",
            }}>
            <View
                style={[{ backgroundColor: bgcolor }, styles.container, style]}>
                <Image style={styles.image} source={src} />
                <Text
                    color={color}
                    fontSize={14}
                    bold
                    upper
                    style={{
                        marginLeft: 15,
                    }}>
                    {text}
                </Text>
            </View>
        </AnimatedTouchable>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        paddingVertical: 12,
        display: "flex",
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 25,
        height: 25,
        marginLeft: 3,
    },
});

export default IconButton;
