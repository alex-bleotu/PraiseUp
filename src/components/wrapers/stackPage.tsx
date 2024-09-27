import {
    Entypo as EIcons,
    MaterialCommunityIcons as MCIcons,
} from "@expo/vector-icons";
import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
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
}: StackPageProps) => {
    const { theme } = useContext(ThemeContext);

    const iconSize = 30;

    return (
        <Background noPadding noBottom={noBottom}>
            <View style={styles.topBar}>
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
                <View
                    style={[
                        styles.textContainer,
                        {
                            marginRight: icon || !back ? 0 : iconSize + 15,
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
            </View>
            <View
                style={[
                    styles.container,
                    {
                        marginBottom: noBottom ? 0 : 5,
                    },
                ]}>
                {children}
            </View>
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
});
