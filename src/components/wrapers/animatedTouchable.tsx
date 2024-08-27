import React, { useContext, useState } from "react";
import { Animated } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ThemeContext } from "../../context/theme";

interface AnimatedTouchableProps {
    children: React.ReactNode;
    style?: any;
    onPress?: () => void;
    onLongPress?: () => void;
    disabled?: boolean;
}

const AnimatedTouchable = ({
    children,
    style,
    onPress,
    onLongPress,
    disabled = false,
}: AnimatedTouchableProps) => {
    const { theme } = useContext(ThemeContext);

    const [scale] = useState(new Animated.Value(1));

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.95,
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
        <Animated.View
            style={{ transform: [{ scale }], opacity: disabled ? 0.5 : 1 }}>
            <TouchableOpacity
                disabled={disabled}
                delayLongPress={400}
                style={[style]}
                activeOpacity={theme.activeOpacity}
                onPress={() => {
                    if (onPress && !disabled) onPress();
                }}
                onLongPress={() => {
                    if (onLongPress && !disabled) onLongPress();
                }}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}>
                {children}
            </TouchableOpacity>
        </Animated.View>
    );
};

export default AnimatedTouchable;
