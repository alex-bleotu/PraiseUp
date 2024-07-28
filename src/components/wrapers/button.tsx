import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { getTheme } from "../../utils/theme";
import AnimatedTouchable from "./animatedTouchable";
import Text from "./text";

interface ButtonProps {
    text: string;
    bold?: boolean;
    fontSize?: number;
    style?: ViewStyle;
    mode: "contained" | "outlined" | "none";
    icon?: ReactNode;
    onPress?: () => void;
}

const Button = ({
    text,
    style,
    bold,
    fontSize,
    mode,
    icon,
    onPress,
}: ButtonProps) => {
    const theme = getTheme();

    return (
        <AnimatedTouchable onPress={onPress}>
            <View
                style={[
                    styles.container,
                    style,
                    {
                        backgroundColor:
                            mode === "contained"
                                ? theme.colors.primaryVariant
                                : "transparent",
                    },
                    mode === "outlined"
                        ? [styles.border, { borderColor: theme.colors.text }]
                        : [styles.border, { borderColor: "transparent" }],
                ]}>
                <View style={{ flexDirection: "row" }}>
                    <View
                        style={{
                            marginRight: icon === undefined ? 0 : 10,
                        }}>
                        {icon}
                    </View>
                    <Text
                        size={fontSize ? fontSize : 16}
                        bold={bold ? bold : false}>
                        {text}
                    </Text>
                </View>
            </View>
        </AnimatedTouchable>
    );
};

export default Button;

const styles = StyleSheet.create({
    container: {
        alignSelf: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    border: {
        borderWidth: 2,
    },
});
