import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import React, { useContext } from "react";
import {
    DimensionValue,
    Modal as RNModal,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    ViewStyle,
} from "react-native";
import { ThemeContext } from "../../context/theme";
import AnimatedTouchable from "./animatedTouchable";
import Text from "./text";

interface ModalProps {
    children: React.ReactNode;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    style?: ViewStyle;
    onClose?: () => void;
    width?: DimensionValue;
    title: string;
}

const Modal = ({
    children,
    visible,
    setVisible,
    style,
    width,
    title,
    onClose,
}: ModalProps) => {
    const { theme } = useContext(ThemeContext);

    return (
        <RNModal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}
            style={{ top: 100 }}>
            <TouchableWithoutFeedback
                style={{
                    width: "100%",
                    height: "100%",
                }}
                onPress={() => setVisible(false)}>
                <View style={styles.container}>
                    <View
                        style={{
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            ...style,
                        }}>
                        <View
                            style={[
                                styles.modal,
                                { backgroundColor: theme.colors.paper },
                                width !== undefined ? { width } : {},
                            ]}>
                            <View style={styles.top}>
                                <Text size={20} bold style={{ width: "100%" }}>
                                    {title}
                                </Text>
                                <View
                                    style={{
                                        marginLeft: "auto",
                                        padding: 5,
                                        marginRight: -15,
                                    }}>
                                    <AnimatedTouchable
                                        onPress={() => {
                                            setVisible(false);
                                            onClose && onClose();
                                        }}>
                                        <MCIcons
                                            name={"close"}
                                            size={25}
                                            color={theme.colors.text}
                                        />
                                    </AnimatedTouchable>
                                </View>
                            </View>
                            <View style={styles.content}>{children}</View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 25,
        zIndex: 100,
    },
    modal: {
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    top: {
        zIndex: 105,
        marginTop: -5,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        marginHorizontal: 15,
    },
    content: {
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
});

export default Modal;
