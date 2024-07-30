import React, { useContext } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import Background from "../components/wrapers/background";
import { ThemeContext } from "../context/theme";

const Loading = () => {
    const { theme } = useContext(ThemeContext);

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
