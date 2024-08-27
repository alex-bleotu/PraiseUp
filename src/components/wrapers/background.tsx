import React, { ReactNode, useContext } from "react";
import { Dimensions, View } from "react-native";
import { ThemeContext } from "../../context/theme";

interface BackgroundProps {
    children?: ReactNode | ReactNode[];
    noPadding?: boolean;
    color?: string;
    center?: boolean;
    noBottom?: boolean;
    style?: any;
}

const Background = ({
    children,
    color,
    center = false,
    noBottom = false,
    noPadding = false,
    style,
}: BackgroundProps) => {
    const { theme } = useContext(ThemeContext);

    const height = Dimensions.get("screen").height - 15;

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: color ? color : theme.colors.background,
                display: "flex",
                alignItems: "center",
                paddingTop: 50,
                paddingHorizontal: noPadding ? 0 : 20,
                height,
            }}>
            <View
                style={{
                    flex: 1,
                    width: "100%",
                    marginBottom: noBottom ? 0 : 80,
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: center ? "center" : "flex-start",
                    ...style,
                }}>
                {children}
            </View>
        </View>
    );
};

export default Background;
