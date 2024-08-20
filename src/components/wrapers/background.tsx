import React, { ReactNode, useContext } from "react";
import { Dimensions, View } from "react-native";
import { ThemeContext } from "../../context/theme";

const Background = ({
    children,
    noPadding,
    color,
    center,
}: {
    children: ReactNode | ReactNode[];
    noPadding?: boolean;
    color?: string;
    center?: boolean;
}) => {
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
                    marginBottom: 80,
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: center ? "center" : "flex-start",
                    // alignItems: "center",
                }}>
                {children}
            </View>
        </View>
    );
};

export default Background;
