import React, { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Appearance,
    Modal as RNModal,
    StyleSheet,
    View,
} from "react-native";
import Background from "../components/wrapers/background";
import Text from "../components/wrapers/text";
import { ThemeContext } from "../context/theme";
import { darkTheme, lightTheme } from "../utils/theme";

const Loading = ({
    background = true,
    text,
}: {
    background?: boolean;
    text?: string;
}) => {
    const { theme } = useContext(ThemeContext);
    const [dots, setDots] = useState("");

    const color = theme
        ? theme.colors.primary
        : Appearance.getColorScheme() === "dark"
        ? darkTheme.colors.primary
        : lightTheme.colors.primary;
    const bgColor = theme
        ? theme.colors.background
        : Appearance.getColorScheme() === "dark"
        ? darkTheme.colors.background
        : lightTheme.colors.background;
    const textColor = theme
        ? theme.colors.text
        : Appearance.getColorScheme() === "dark"
        ? darkTheme.colors.text
        : lightTheme.colors.text;

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => {
                if (prevDots === "") return ".";
                if (prevDots === ".") return "..";
                if (prevDots === "..") return "...";
                return "";
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    if (!background)
        return (
            <ActivityIndicator
                animating={true}
                size={50}
                color={color}
                style={{ height: "100%", marginTop: -70 }}
            />
        );

    return (
        <RNModal
            animationType="none"
            transparent={true}
            visible={true}
            style={{ top: 100 }}>
            <Background center color={bgColor}>
                <ActivityIndicator animating={true} size={50} color={color} />
                <View style={styles.textContainer}>
                    {text && (
                        <View style={styles.first}>
                            <Text bold center color={textColor}>
                                {text}
                            </Text>
                        </View>
                    )}
                    <View style={styles.second}>
                        <Text color={textColor} bold>
                            {dots}
                        </Text>
                    </View>
                </View>
            </Background>
        </RNModal>
    );
};

export default Loading;

const styles = StyleSheet.create({
    textContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    first: {
        marginLeft: 20,
        alignItems: "flex-end",
    },
    second: {
        width: 30,
        alignItems: "flex-start",
    },
});
