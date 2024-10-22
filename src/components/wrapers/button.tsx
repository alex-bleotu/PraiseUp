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
    backgroundColor?: string;
    center?: boolean;
    contentStyle?: ViewStyle;
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
    backgroundColor,
    center = true,
    contentStyle,
}: ButtonProps) => {
    const { theme } = useContext(ThemeContext);

    return (
        <AnimatedTouchable onPress={onPress} disabled={disabled}>
            <View
                style={[
                    styles.container,
                    {
                        width: fullWidth ? "100%" : "auto",
                        backgroundColor:
                            mode === "contained"
                                ? backgroundColor
                                    ? backgroundColor
                                    : theme.colors.primary
                                : "transparent",
                        alignItems: center ? "center" : "flex-start",
                    },
                    style,
                    mode === "outlined"
                        ? [styles.border, { borderColor: theme.colors.text }]
                        : [styles.border, { borderColor: "transparent" }],
                    contentStyle,
                ]}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    {icon && (
                        <View
                            style={{
                                marginRight: 10,
                                marginLeft: center ? 0 : -5,
                                width: 30,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                            {icon}
                        </View>
                    )}
                    <Text
                        fontSize={fontSize ? fontSize : 16}
                        bold={bold ? bold : false}
                        upper={upper}
                        style={{
                            marginLeft: center ? 0 : 5,
                        }}
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
        justifyContent: "center",
    },
    border: {
        borderWidth: 2,
    },
});
