import React, { useContext } from "react";
import { ActivityIndicator, Modal as RNModal, StyleSheet } from "react-native";
import Background from "../components/wrapers/background";
import { ThemeContext } from "../context/theme";

const Loading = ({ background = true }: { background?: boolean }) => {
    const { theme } = useContext(ThemeContext);

    if (!background)
        return (
            <ActivityIndicator
                animating={true}
                size={50}
                color={theme.colors.primary}
                style={{ height: "100%", marginTop: -70 }}
            />
        );

    return (
        <RNModal
            animationType="none"
            transparent={true}
            visible={true}
            style={{ top: 100 }}>
            <Background center>
                <ActivityIndicator
                    animating={true}
                    size={50}
                    color={theme.colors.primary}
                />
            </Background>
        </RNModal>
    );
};

export default Loading;

const styles = StyleSheet.create({});
