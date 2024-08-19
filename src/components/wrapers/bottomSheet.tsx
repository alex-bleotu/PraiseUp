import React, { useCallback, useContext, useImperativeHandle } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { ThemeContext } from "../../context/theme";
import Background from "./background";

export type BottomSheetProps = {
    children: any;
    midTranslateY?: number;
};
export type BottomSheetRefProps = {
    scrollTo: (destination: number) => void;
    state: "closed" | "mid" | "open";
    translateY: number;
};

const { height: WindowHeight } = Dimensions.get("window");
const OpenY = 400;
const CloseY = 100;

const BottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
    ({ children }, ref) => {
        const { theme } = useContext(ThemeContext);

        const translateY = useSharedValue(CloseY);

        const state = useSharedValue<"closed" | "open">("closed");

        const scrollTo = useCallback((destination: number) => {
            "worklet";
            translateY.value = withSpring(destination, { damping: 10 });

            if (destination === CloseY) state.value = "closed";
            else state.value = "open";
        }, []);

        useImperativeHandle(
            ref,
            () => ({
                scrollTo,
                state: state.value,
                translateY: translateY.value,
            }),
            [scrollTo, state.value]
        );

        const context = useSharedValue({ y: 0 });
        const gesture = Gesture.Pan()
            .onStart(() => {
                context.value = { y: translateY.value };
            })
            .onUpdate((event: any) => {
                if (state.value === "closed") return;
                translateY.value = event.translationY + context.value.y;
                translateY.value = Math.max(translateY.value, OpenY);
            })
            .onEnd(() => {
                if (translateY.value > OpenY - 50) scrollTo(OpenY);
                else scrollTo(CloseY);
            });

        const rBottomSheetStyle = useAnimatedStyle(() => {
            return {
                transform: [{ translateY: translateY.value }],
            };
        });

        return (
            <GestureDetector gesture={gesture}>
                <Animated.View
                    style={[
                        styles.container,
                        rBottomSheetStyle,
                        { backgroundColor: theme.colors.background },
                    ]}>
                    <Background>
                        <View
                            style={[
                                styles.line,
                                { backgroundColor: theme.colors.text },
                            ]}
                        />
                        {children}
                    </Background>
                </Animated.View>
            </GestureDetector>
        );
    }
);

export default BottomSheet;

const styles = StyleSheet.create({
    container: {
        height: WindowHeight,
        width: "100%",
        position: "absolute",
        top: WindowHeight,
        borderRadius: 25,
    },
    line: {
        height: 6,
        width: 80,
        borderRadius: 50,
        alignSelf: "center",
        marginVertical: 10,
    },
});
