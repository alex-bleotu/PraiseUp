import React from "react";
import {
    Modal as RNModal,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface OverlayProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onClose?: () => void;
    children?: React.ReactNode;
}

const Overlay = ({ visible, setVisible, onClose, children }: OverlayProps) => {
    return (
        <RNModal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                setVisible(false), onClose && onClose();
            }}
            style={{ top: 100 }}>
            <TouchableOpacity
                style={{ width: "100%", height: "100%" }}
                onPress={() => {
                    setVisible(false), onClose && onClose();
                }}
                activeOpacity={1}>
                <View style={styles.container}>{children}</View>
            </TouchableOpacity>
        </RNModal>
    );
};

export default Overlay;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
});
