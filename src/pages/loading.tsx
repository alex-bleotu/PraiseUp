import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import Background from "../components/wrapers/background";
import { getTheme } from "../utils/theme";

const Loading = () => {
    const theme = getTheme();

    return (
        <Background>
            <ActivityIndicator
                animating={true}
                size="large"
                color={theme.colors.primary}
            />
        </Background>
    );
};

export default Loading;

const styles = StyleSheet.create({});
