import { Entypo as EIcons } from "@expo/vector-icons";
import { useContext, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import SVG, { Circle, G } from "react-native-svg";
import { ThemeContext } from "../../context/theme";
import AnimatedTouchable from "./animatedTouchable";

const NextButton = ({
    percentage,
    scrollTo,
    style,
}: {
    percentage: number;
    scrollTo: any;
    style?: any;
}) => {
    const { theme } = useContext(ThemeContext);

    const size = 100;
    const strokeWidth = 3.5;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const progressAnimation = useRef(new Animated.Value(0)).current;
    const progressRef = useRef(null);

    const animation = (toValue: number) => {
        return Animated.timing(progressAnimation, {
            toValue,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        animation(percentage);
    }, [percentage]);

    useEffect(() => {
        progressAnimation.addListener((value) => {
            const strokeDashoffset =
                circumference - (circumference * value.value) / 100;

            if (progressRef?.current) {
                (progressRef.current as any).setNativeProps({
                    strokeDashoffset,
                });
            }
        });

        return () => {
            progressAnimation.removeAllListeners();
        };
    }, [percentage]);

    return (
        <View style={[styles.container, style]}>
            <View style={styles.circle}>
                <SVG width={size} height={size}>
                    <G rotation="-90" origin={center}>
                        <Circle
                            stroke={theme.colors.lightGrey}
                            cx={center}
                            cy={center}
                            r={radius}
                            strokeWidth={strokeWidth}
                            fill="transparent"
                        />
                        <Circle
                            ref={progressRef}
                            stroke={theme.colors.primary}
                            cx={center}
                            cy={center}
                            r={radius}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            fill="transparent"
                        />
                    </G>
                </SVG>
            </View>

            <AnimatedTouchable onPress={scrollTo}>
                <View
                    style={[
                        styles.button,
                        {
                            backgroundColor: theme.colors.primary,
                        },
                    ]}>
                    <EIcons
                        name="chevron-right"
                        size={40}
                        color={theme.colors.textInverted}
                    />
                </View>
            </AnimatedTouchable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        position: "absolute",
        borderRadius: 100,
        padding: 10,
        top: -31,
        right: -31,
    },
    circle: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default NextButton;
