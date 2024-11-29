import { useContext } from "react";
import { Animated, StyleSheet, View, useWindowDimensions } from "react-native";
import { ThemeContext } from "../../context/theme";

const Paginator = ({
    data,
    scrollX,
    style,
}: {
    data: any;
    scrollX: any;
    style?: any;
}) => {
    const { width } = useWindowDimensions();
    const { theme, themeType, systemTheme } = useContext(ThemeContext);

    const color =
        (themeType === "system" && systemTheme === "light") ||
        themeType === "light"
            ? theme.colors.lightGrey
            : theme.colors.darkGrey;

    return (
        <View style={[styles.container, style]}>
            {data.map((_: any, i: number) => {
                const inputRange = [
                    (i - 1) * width,
                    i * width,
                    (i + 1) * width,
                ];

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 20, 10],
                    extrapolate: "clamp",
                });

                const backgroundColor = scrollX.interpolate({
                    inputRange,
                    outputRange: [color, theme.colors.primary, color],
                    extrapolate: "clamp",
                });

                return (
                    <Animated.View
                        key={i}
                        style={{
                            ...styles.dot,
                            backgroundColor,
                            width: dotWidth,
                        }}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 64,
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginHorizontal: 8,
    },
});

export default Paginator;
