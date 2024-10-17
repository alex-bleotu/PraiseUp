import {
    Entypo as EIcons,
    MaterialCommunityIcons as MCIcons,
} from "@expo/vector-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Animated, Keyboard, StyleSheet, View } from "react-native";
import { ThemeContext } from "../../context/theme";
import AnimatedTouchable from "./animatedTouchable";
import Background from "./background";
import Text from "./text";

interface StackPageProps {
    children: React.ReactNode | React.ReactNode[];
    navigation?: any;
    title: string;
    icon?: keyof typeof MCIcons.glyphMap;
    back?: boolean;
    noBottom?: boolean;
    action?: () => void;
    buttonRef?: React.RefObject<any>;
    variant?: boolean;
    description?: string;
}

const StackPage = ({
    children,
    navigation,
    title,
    icon,
    action,
    back = true,
    noBottom = false,
    buttonRef,
    variant = false,
    description,
}: StackPageProps) => {
    const { theme } = useContext(ThemeContext);

    const translateYAnim = useRef(new Animated.Value(0)).current;
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const iconSize = 30;

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow",
            () => {
                setKeyboardVisible(true);
                animateMoveUp(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            () => {
                setKeyboardVisible(false);
                animateMoveUp(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const animateMoveUp = (moveUp: boolean) => {
        Animated.timing(translateYAnim, {
            toValue: moveUp ? -120 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Background noPadding noBottom={noBottom}>
            <Animated.View
                style={[
                    styles.topBar,
                    {
                        transform: variant
                            ? [
                                  {
                                      translateY: translateYAnim,
                                  },
                              ]
                            : [],
                    },
                ]}>
                {back && (
                    <AnimatedTouchable
                        style={{ marginLeft: 10 }}
                        onPress={() => {
                            if (navigation.canGoBack()) {
                                navigation.goBack();
                            } else {
                                navigation.navigate("Home");
                            }
                        }}>
                        <EIcons
                            name="chevron-left"
                            size={iconSize}
                            color={theme.colors.text}
                        />
                    </AnimatedTouchable>
                )}

                {!variant && (
                    <>
                        <View
                            style={[
                                styles.textContainer,
                                {
                                    marginRight:
                                        icon || !back ? 0 : iconSize + 15,
                                    marginLeft: !back ? iconSize + 5 : 0,
                                },
                            ]}>
                            <Text center fontSize={24}>
                                {title}
                            </Text>
                        </View>
                        {icon && (
                            <View ref={buttonRef} collapsable={false}>
                                <AnimatedTouchable
                                    style={{
                                        ...styles.cornerButton,
                                    }}
                                    onPress={() => {
                                        action && action();
                                    }}>
                                    <MCIcons
                                        name={icon}
                                        size={iconSize}
                                        color={theme.colors.text}
                                    />
                                </AnimatedTouchable>
                            </View>
                        )}
                    </>
                )}
            </Animated.View>
            <Animated.View
                style={{
                    flex: 1,
                    transform: variant
                        ? [
                              {
                                  translateY: translateYAnim,
                              },
                          ]
                        : [],
                }}>
                <View style={variant ? styles.container2 : { flex: 1 }}>
                    {variant && (
                        <View style={styles.top}>
                            <View
                                style={{
                                    alignSelf: "flex-start",
                                    marginTop: 10,
                                    marginBottom: 20,
                                }}>
                                <Text bold fontSize={30}>
                                    {title}
                                </Text>
                            </View>
                            <View
                                style={{
                                    alignSelf: "flex-start",
                                    marginBottom: 20,
                                }}>
                                <Text
                                    fontSize={18}
                                    color={theme.colors.textVariant}>
                                    {description}
                                </Text>
                            </View>
                        </View>
                    )}
                    <View
                        style={[
                            styles.container,
                            {
                                marginBottom: noBottom ? 0 : 5,
                            },
                        ]}>
                        {children}
                    </View>
                </View>
            </Animated.View>
        </Background>
    );
};

export default StackPage;

const styles = StyleSheet.create({
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    textContainer: {
        flex: 1,
        alignItems: "center",
    },
    container: {
        width: "100%",
        display: "flex",
        flex: 1,
    },
    cornerButton: {
        marginRight: 10,
    },
    top: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    container2: {
        paddingHorizontal: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
    },
});
