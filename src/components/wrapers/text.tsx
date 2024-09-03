import React, { ReactNode, useContext } from "react";
import { StyleSheet, Text as Ts } from "react-native";
import { ThemeContext } from "../../context/theme";

interface TextProps {
    children: ReactNode;
    fontSize?: number;
    bold?: boolean;
    color?: string;
    style?: any;
    center?: boolean;
    upper?: boolean;
    fontFamily?: string;
}

const Text = ({
    children,
    fontSize = 16,
    bold,
    color,
    style,
    center,
    upper = false,
    fontFamily,
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
                textTransform: upper ? "uppercase" : "none",
                fontFamily: fontFamily ? fontFamily : "Roboto",
            }}>
            {children}
        </Ts>
    );
};

export default Text;

const styles = StyleSheet.create({});
