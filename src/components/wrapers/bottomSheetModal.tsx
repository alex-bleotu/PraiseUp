import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Modal,
    PanResponder,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { ThemeContext } from "../../context/theme";

const { height: windowHeight } = Dimensions.get("window");

interface BottomSheetModalProps {
    open: boolean;
    children: React.ReactNode | React.ReactNode[];
    onClose?: () => void;
}

const BottomSheetModal = ({
    open,
    onClose,
    children,
}: BottomSheetModalProps) => {
    const [modalVisible, setModalVisible] = useState(open);
    const translateY = useRef(new Animated.Value(windowHeight)).current;

    const { theme } = useContext(ThemeContext);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dy > windowHeight * 0.25) {
                    closeBottomSheet();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,

                        stiffness: 200,
                        damping: 30,
                        mass: 0.8,
                    }).start();
                }
            },
        })
    ).current;

    useEffect(() => {
        if (open) {
            setModalVisible(true);
            openBottomSheet();
        } else {
            closeBottomSheet();
        }
    }, [open]);

    const openBottomSheet = () => {
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,

            stiffness: 200,
            damping: 30,
            mass: 0.8,
        }).start();
    };

    const closeBottomSheet = () => {
        Animated.timing(translateY, {
            toValue: windowHeight,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setModalVisible(false);
            onClose && onClose();
        });
    };

    if (!modalVisible) return null;

    return (
        <Modal
            transparent
            animationType="none"
            onRequestClose={closeBottomSheet}>
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={styles.overlayTouchable}
                    onPress={closeBottomSheet}
                />
                <Animated.View
                    style={[
                        styles.bottomSheetContainer,
                        {
                            transform: [{ translateY }],
                            backgroundColor: theme.colors.paper,
                        },
                    ]}
                    {...panResponder.panHandlers}>
                    <View
                        style={[
                            styles.bottomSheetHandle,
                            { backgroundColor: theme.colors.grey },
                        ]}
                    />
                    <View style={styles.sheetContent}>{children}</View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    overlayTouchable: {
        flex: 1,
    },
    bottomSheetContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 400,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
    },
    bottomSheetHandle: {
        width: 40,
        height: 5,
        borderRadius: 3,
        alignSelf: "center",
        marginTop: 10,
    },
    sheetContent: {
        fontSize: 18,
        textAlign: "center",
        marginVertical: 20,
    },
});

export default BottomSheetModal;
