import { useContext } from "react";
import {
    Modal as RNModal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { ThemeContext } from "../../context/theme";

interface ModalProps {
    children: any;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    style?: any;
    width?: any;
    onClose?: () => void;
    disableClose?: boolean;
}

const Modal = ({
    children,
    visible,
    setVisible,
    style,
    width,
    onClose,
    disableClose = false,
}: ModalProps) => {
    const { theme } = useContext(ThemeContext);

    return (
        <RNModal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                if (disableClose) return;

                setVisible(false), onClose && onClose();
            }}
            style={{ top: 100 }}>
            <TouchableOpacity
                style={{ width: "100%", height: "100%" }}
                onPress={() => {
                    if (disableClose) return;

                    setVisible(false), onClose && onClose();
                }}
                activeOpacity={1}>
                <View style={styles.container}>
                    <View
                        style={{
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            ...style,
                        }}>
                        <TouchableWithoutFeedback>
                            <View
                                style={[
                                    styles.modal,
                                    width !== undefined ? { width } : {},
                                    {
                                        backgroundColor: theme.colors.paper,
                                    },
                                ]}>
                                {children}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </TouchableOpacity>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.75)",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    modal: {
        borderRadius: 20,
        padding: 15,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default Modal;
