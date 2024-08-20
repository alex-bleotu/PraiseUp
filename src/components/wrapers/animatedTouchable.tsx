import React, { useContext, useState } from "react";
import { Animated, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ThemeContext } from "../../context/theme";

interface AnimatedTouchableProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
    onLongPress?: () => void;
}

const AnimatedTouchable = ({
    children,
    style,
    onPress,
    onLongPress,
}: AnimatedTouchableProps) => {
    const { theme } = useContext(ThemeContext);

    const [scale] = useState(new Animated.Value(1));

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            delayLongPress={400}
            style={style}
            activeOpacity={theme.activeOpacity}
            onPress={() => {
                onPress && onPress();
            }}
            onLongPress={() => {
                onLongPress && onLongPress();
            }}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}>
            <Animated.View style={{ transform: [{ scale }] }}>
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
};

export default AnimatedTouchable;
