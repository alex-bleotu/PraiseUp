import React, {
    useCallback,
    useContext,
    useImperativeHandle,
    useState,
} from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { ThemeContext } from "../../context/theme";

export type BottomSheetProps = {
    children: React.ReactNode;
};

export type BottomSheetRefProps = {
    scrollTo: (destination: number) => void;
    open: () => void;
    close: () => void;
    state: "closed" | "open";
    translateY: number;
};

const { height: WindowHeight } = Dimensions.get("window");
const MaxTranslateY = -WindowHeight + 400;
const MinTranslateY = 100;

const BottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
    ({ children }, ref) => {
        const { theme } = useContext(ThemeContext);
        const [pointerEvents, setPointerEvents] = useState<"auto" | "none">(
            "none"
        );

        const translateY = useSharedValue(MinTranslateY);
        const state = useSharedValue<"closed" | "open">("closed");

        const scrollTo = useCallback((destination: number) => {
            "worklet";
            translateY.value = withSpring(destination, {
                damping: 15,
                stiffness: 100,
            });
            state.value = destination === MinTranslateY ? "closed" : "open";
            runOnJS(setPointerEvents)(
                destination === MinTranslateY ? "none" : "auto"
            );
        }, []);

        const open = useCallback(() => {
            scrollTo(MaxTranslateY);
        }, [scrollTo]);

        const close = useCallback(() => {
            scrollTo(MinTranslateY);
        }, [scrollTo]);

        useImperativeHandle(
            ref,
            () => ({
                scrollTo,
                open,
                close,
                get state() {
                    return state.value;
                },
                get translateY() {
                    return translateY.value;
                },
            }),
            [scrollTo, open, close, state, translateY]
        );

        const context = useSharedValue({ y: 0 });

        const gesture = Gesture.Pan()
            .onStart(() => {
                context.value = { y: translateY.value };
            })
            .onUpdate((event) => {
                if (state.value === "closed") return;
                translateY.value = event.translationY + context.value.y;
                translateY.value = Math.max(translateY.value, MaxTranslateY);
            })
            .onEnd(() => {
                if (translateY.value < MaxTranslateY / 2 - 100) {
                    scrollTo(MaxTranslateY);
                } else {
                    scrollTo(MinTranslateY);
                }
            });

        const rBottomSheetStyle = useAnimatedStyle(() => ({
            transform: [{ translateY: translateY.value }],
        }));

        return (
            <View style={[styles.overlay, { pointerEvents }]}>
                <GestureDetector gesture={gesture}>
                    <Animated.View
                        style={[
                            styles.container,
                            rBottomSheetStyle,
                            { backgroundColor: theme.colors.paper },
                        ]}>
                        <View
                            style={[
                                styles.line,
                                { backgroundColor: theme.colors.grey },
                            ]}
                        />
                        {children}
                    </Animated.View>
                </GestureDetector>
            </View>
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
        paddingHorizontal: 20,
    },
    line: {
        height: 5,
        width: 40,
        borderRadius: 50,
        alignSelf: "center",
        marginVertical: 10,
        backgroundColor: "white",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
    },
});
