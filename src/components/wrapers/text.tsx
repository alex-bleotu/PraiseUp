import React, { ReactNode } from "react";
import { StyleSheet, Text as Ts, ViewStyle } from "react-native";
import { getTheme } from "../../utils/theme";

interface TextProps {
    children: ReactNode;
    size?: number;
    bold?: boolean;
    color?: string;
    style?: ViewStyle;
    center?: boolean;
}

const Text = ({
    children,
    size = 16,
    bold,
    color,
    style,
    center,
}: TextProps) => {
    const theme = getTheme();

    return (
        <Ts
            style={{
                ...style,
                fontSize: size,
                fontWeight: bold ? "bold" : "normal",
                color: color ? color : theme.colors.text,
                textAlign: center ? "center" : "left",
            }}>
            {children}
        </Ts>
    );
};

export default Text;

const styles = StyleSheet.create({});
