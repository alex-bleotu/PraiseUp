import React, { useContext } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import Background from "../components/wrapers/background";
import { ThemeContext } from "../context/theme";

const Loading = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <Background center>
            <ActivityIndicator
                animating={true}
                size={50}
                color={theme.colors.primary}
            />
        </Background>
    );
};

export default Loading;

const styles = StyleSheet.create({});
