import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import tinycolor from "tinycolor2";
import { ThemeContext } from "../../context/theme";

interface SkeletonTextProps {
    lines?: number;
    lineHeight?: number;
    width?: number;
    verticalSpacing?: number;
}

const SkeletonText = ({
    lines = 1,
    lineHeight = 22,
    width = 150,
    verticalSpacing = 8,
}: SkeletonTextProps) => {
    const { theme, themeType, systemTheme } = React.useContext(ThemeContext);
    const shimmerAnimation = useRef(new Animated.Value(0)).current;

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
                  tinycolor(theme.colors.background).darken(16).toHexString(),
                  tinycolor(theme.colors.background).darken(8).toHexString(),
                  tinycolor(theme.colors.background).darken(16).toHexString(),
              ]
            : [
                  tinycolor(theme.colors.background).lighten(10).toHexString(),
                  tinycolor(theme.colors.background).lighten(16).toHexString(),
                  tinycolor(theme.colors.background).lighten(10).toHexString(),
              ];
    const defaultColor =
        themeType === "light" ||
        (themeType === "system" && systemTheme === "light")
            ? tinycolor(theme.colors.background).darken(16).toHexString()
            : tinycolor(theme.colors.background).lighten(10).toHexString();

    return (
        <View style={styles.container}>
            {Array.from({ length: lines }).map((_, index) => (
                <View
                    key={`skeleton-line-${index}`}
                    style={[
                        styles.linePlaceholder,
                        {
                            height: lineHeight,
                            marginBottom:
                                index < lines - 1 ? verticalSpacing : 0,
                            backgroundColor: defaultColor,
                            width: width,
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
            ))}
        </View>
    );
};

export default SkeletonText;

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
    },
    linePlaceholder: {
        borderRadius: 8,
        overflow: "hidden",
        position: "relative",
    },
    shimmer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    gradient: {
        flex: 1,
    },
});
