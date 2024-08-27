import React, { ReactNode, useContext } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ThemeContext } from "../../context/theme";
import AnimatedTouchable from "./animatedTouchable";
import Text from "./text";

interface ButtonProps {
    text: string;
    bold?: boolean;
    fontSize?: number;
    style?: ViewStyle;
    mode: "contained" | "outlined" | "none";
    icon?: ReactNode;
    fullWidth?: boolean;
    upper?: boolean;
    color?: string;
    onPress?: () => void;
    disabled?: boolean;
}

const Button = ({
    text,
    style,
    bold,
    fontSize,
    mode,
    icon,
    fullWidth = false,
    upper = false,
    color,
    onPress,
    disabled,
}: ButtonProps) => {
    const { theme } = useContext(ThemeContext);

    return (
        <AnimatedTouchable onPress={onPress} disabled={disabled}>
            <View
                style={[
                    styles.container,
                    style,
                    {
                        width: fullWidth ? "100%" : "auto",
                        backgroundColor:
                            mode === "contained"
                                ? theme.colors.primary
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
                        fontSize={fontSize ? fontSize : 16}
                        bold={bold ? bold : false}
                        upper={upper}
                        color={color ? color : theme.colors.textInverted}>
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
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    border: {
        borderWidth: 2,
    },
});
