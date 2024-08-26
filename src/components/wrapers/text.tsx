import React, { ReactNode, useContext } from "react";
import { StyleSheet, Text as Ts, ViewStyle } from "react-native";
import { ThemeContext } from "../../context/theme";

interface TextProps {
    children: ReactNode;
    fontSize?: number;
    bold?: boolean;
    color?: string;
    style?: ViewStyle | ViewStyle[];
    center?: boolean;
}

const Text = ({
    children,
    fontSize = 16,
    bold,
    color,
    style,
    center,
}: TextProps) => {
    const { theme } = useContext(ThemeContext);

    return (
        <Ts
            style={{
                ...style,
                fontSize,
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
