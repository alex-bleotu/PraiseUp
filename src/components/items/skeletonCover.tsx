import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import tinycolor from "tinycolor2";
import { ThemeContext } from "../../context/theme";

interface SongCoverSkeletonProps {
    fullWidth?: boolean;
    vertical?: boolean;
}

const SkeletonCover = ({
    fullWidth,
    vertical = false,
}: SongCoverSkeletonProps) => {
    const { theme, themeType, systemTheme } = React.useContext(ThemeContext);
    const shimmerAnimation = useRef(new Animated.Value(0)).current;

    const width = fullWidth ? "100%" : Dimensions.get("screen").width / 2 - 25;
    const verticalWidth = Math.min(
        (Dimensions.get("screen").width - 55) / 3,
        160
    );

    const shimmerWidth = 300;
    const screenWidth = Dimensions.get("screen").width;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnimation, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnimation, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();

        return () => {
            shimmerAnimation.stopAnimation();
            shimmerAnimation.setValue(0);
        };
    }, [shimmerAnimation]);

    const shimmerTranslateX = shimmerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-shimmerWidth, screenWidth + shimmerWidth],
    });

    const shimmerGradientColors =
        themeType === "light" ||
        (themeType === "system" && systemTheme === "light")
            ? [
                  tinycolor(theme.colors.background).darken(16).toHexString(), // Slightly darker background
                  tinycolor(theme.colors.background).darken(8).toHexString(), // Highlight shimmer
                  tinycolor(theme.colors.background).darken(16).toHexString(), // Back to base
              ]
            : [
                  tinycolor(theme.colors.background).lighten(10).toHexString(), // Slightly lighter background
                  tinycolor(theme.colors.background).lighten(16).toHexString(), // Highlight shimmer
                  tinycolor(theme.colors.background).lighten(10).toHexString(), // Back to base
              ];
    const defaultColor =
        themeType === "light" ||
        (themeType === "system" && systemTheme) === "light"
            ? tinycolor(theme.colors.background).darken(16).toHexString()
            : tinycolor(theme.colors.background).lighten(10).toHexString();

    return (
        <View
            style={[
                vertical ? styles.containerVertical : styles.container,
                {
                    width: vertical ? "100%" : width,
                    backgroundColor: vertical
                        ? "transparent"
                        : theme.colors.paper,
                },
            ]}>
            <View
                style={[
                    styles.imagePlaceholder,
                    {
                        width: vertical ? verticalWidth : 70,
                        height: vertical ? verticalWidth : 70,
                        backgroundColor: defaultColor,
                    },
                ]}>
                <Animated.View
                    style={[
                        styles.shimmer,
                        { transform: [{ translateX: shimmerTranslateX }] },
                    ]}>
                    <LinearGradient
                        colors={shimmerGradientColors}
                        start={[0, 0.5]}
                        end={[1, 0.5]}
                        style={[styles.gradient, { width: shimmerWidth }]}
                    />
                </Animated.View>
            </View>

            <View
                style={[
                    styles.textContainer,
                    vertical
                        ? { marginTop: 7, width: verticalWidth }
                        : { marginLeft: 8, marginRight: 40, marginTop: 6 },
                ]}>
                <View
                    style={[
                        styles.textPlaceholder,
                        {
                            backgroundColor: defaultColor,
                            marginLeft: vertical ? 3 : 0,
                        },
                    ]}>
                    <Animated.View
                        style={[
                            styles.shimmer,
                            { transform: [{ translateX: shimmerTranslateX }] },
                        ]}>
                        <LinearGradient
                            colors={shimmerGradientColors}
                            start={[0, 0.5]}
                            end={[1, 0.5]}
                            style={[styles.gradient, { width: shimmerWidth }]}
                        />
                    </Animated.View>
                </View>
                {!vertical && (
                    <View
                        style={[
                            styles.textPlaceholder,
                            {
                                backgroundColor: defaultColor,
                                marginLeft: vertical ? 3 : 0,
                                marginTop: 5,
                                width: "50%",
                            },
                        ]}>
                        <Animated.View
                            style={[
                                styles.shimmer,
                                {
                                    transform: [
                                        { translateX: shimmerTranslateX },
                                    ],
                                },
                            ]}>
                            <LinearGradient
                                colors={shimmerGradientColors}
                                start={[0, 0.5]}
                                end={[1, 0.5]}
                                style={[
                                    styles.gradient,
                                    { width: shimmerWidth },
                                ]}
                            />
                        </Animated.View>
                    </View>
                )}
            </View>
        </View>
    );
};

export default SkeletonCover;

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        display: "flex",
        flexDirection: "row",
        paddingRight: 8,
    },
    containerVertical: {
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: 8,
    },
    imagePlaceholder: {
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
    },
    textContainer: {
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
    },
    textPlaceholder: {
        width: "80%",
        height: 16,
        borderRadius: 8,
        overflow: "hidden",
        position: "relative",
        marginBottom: 4,
    },
    textPlaceholderSmall: {
        width: "60%",
        height: 14,
        borderRadius: 8,
        overflow: "hidden",
        position: "relative",
    },
    shimmer: {
        position: "absolute",
        top: 0,
        bottom: 0,
    },
    gradient: {
        flex: 1,
    },
});
