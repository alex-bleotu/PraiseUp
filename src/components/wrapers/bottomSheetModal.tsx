import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Modal,
    PanResponder,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { ThemeContext } from "../../context/theme";

const { height: windowHeight } = Dimensions.get("window");

interface BottomSheetModalProps {
    isOpen: boolean;
    children: React.ReactNode | React.ReactNode[];
    height?: number;
    numberOfButtons?: number;
    onClose?: () => void;
}

const BottomSheetModal = ({
    isOpen,
    onClose,
    children,
    numberOfButtons,
    height,
}: BottomSheetModalProps) => {
    const [modalVisible, setModalVisible] = useState(isOpen);
    const translateY = useRef(new Animated.Value(windowHeight)).current;
    const gestureStartY = useRef(0);

    const { theme } = useContext(ThemeContext);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true, // Allow starting pan from the handle or the sheet
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dy) > 10;
            },
            onPanResponderGrant: (evt, gestureState) => {
                gestureStartY.current = gestureState.y0;
            },
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                const distanceMoved =
                    gestureState.moveY - gestureStartY.current;

                if (distanceMoved > 50) {
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
        if (isOpen) {
            setModalVisible(true);
            openBottomSheet();
        } else {
            closeBottomSheet();
        }
    }, [isOpen]);

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
            duration: 200,
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
                    {...panResponder.panHandlers}
                    style={{
                        transform: [{ translateY }],
                    }}>
                    <View
                        style={[
                            styles.bottomSheetContainer,
                            {
                                backgroundColor: theme.colors.paper,
                                height: height
                                    ? height
                                    : numberOfButtons
                                      ? 130 + 50 * numberOfButtons
                                      : "auto",
                            },
                        ]}>
                        <View style={styles.bottomSheetHandleContainer}>
                            <View
                                style={[
                                    styles.bottomSheetHandle,
                                    { backgroundColor: theme.colors.grey },
                                ]}
                                {...panResponder.panHandlers}
                            />
                        </View>
                        <TouchableWithoutFeedback>
                            <View style={styles.sheetContent}>{children}</View>
                        </TouchableWithoutFeedback>
                    </View>
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    bottomSheetHandleContainer: {
        width: "100%",
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    bottomSheetHandle: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: "#CCC",
    },
    sheetContent: {
        marginVertical: 20,
    },
});

export default BottomSheetModal;
