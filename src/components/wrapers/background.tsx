import React, { ReactNode, useContext } from "react";
import { Dimensions, View } from "react-native";
import { ThemeContext } from "../../context/theme";

const Background = ({
    children,
    noPadding,
    color,
}: {
    children: ReactNode | ReactNode[];
    noPadding?: boolean;
    color?: string;
}) => {
    const { theme } = useContext(ThemeContext);

    const height = Dimensions.get("screen").height - 15;

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: color ? color : theme.colors.background,
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
                }}>
                {children}
            </View>
        </View>
    );
};

export default Background;
