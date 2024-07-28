import React, { ReactNode } from "react";
import { Dimensions, View } from "react-native";
import { getTheme } from "../../utils/theme";

const Background = ({
    children,
    noPadding,
}: {
    children: ReactNode | ReactNode[];
    noPadding?: boolean;
}) => {
    const theme = getTheme();
    const height = Dimensions.get("screen").height - 15;

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
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
