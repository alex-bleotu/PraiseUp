import React, { useContext, useEffect, useMemo, useState } from "react";
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
    const [dots, setDots] = useState(0);

    const colors = useMemo(() => {
        const scheme = Appearance.getColorScheme();
        const selectedTheme =
            theme || (scheme === "dark" ? darkTheme : lightTheme);

        return {
            primary: selectedTheme.colors.primary,
            background: selectedTheme.colors.background,
            text: selectedTheme.colors.text,
        };
    }, [theme]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev + 1) % 4);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const dotText = ".".repeat(dots);

    if (!background)
        return (
            <ActivityIndicator
                animating={true}
                size={50}
                color={colors.primary}
                style={{ height: "100%", marginTop: -70 }}
                accessibilityLabel="Loading indicator"
            />
        );

    return (
        <RNModal animationType="none" transparent={true} visible={true}>
            <View style={styles.modalWrapper}>
                <Background center color={colors.background}>
                    <ActivityIndicator
                        animating={true}
                        size={50}
                        color={colors.primary}
                        accessibilityLabel="Loading content"
                    />
                    <View style={styles.textContainer}>
                        {text && (
                            <View style={styles.first}>
                                <Text bold center color={colors.text}>
                                    {text}
                                </Text>
                            </View>
                        )}
                        <View style={styles.second}>
                            <Text color={colors.text} bold>
                                {dotText}
                            </Text>
                        </View>
                    </View>
                </Background>
            </View>
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
    modalWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
