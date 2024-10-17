import { useContext } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { ThemeContext } from "../../context/theme";
import AnimatedTouchable from "./animatedTouchable";
import Text from "./text";

interface IconButtonProps {
    src: any;
    bgcolor?: string;
    color?: string;
    text: string;
    style?: any;
    onPress?: any;
    disabled?: boolean;
    loading?: boolean;
}

const ImageButton = ({
    src,
    bgcolor,
    color,
    text,
    style,
    disabled,
    onPress,
    loading,
}: IconButtonProps) => {
    const { theme } = useContext(ThemeContext);

    return (
        <AnimatedTouchable
            disabled={disabled}
            onPress={onPress}
            style={{
                width: "100%",
            }}>
            <View
                style={[{ backgroundColor: bgcolor }, styles.container, style]}>
                {loading ? (
                    <ActivityIndicator
                        animating={true}
                        size={22}
                        color={theme.colors.grey}
                        style={styles.image}
                    />
                ) : (
                    <Image style={styles.image} source={src} />
                )}
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

export default ImageButton;
