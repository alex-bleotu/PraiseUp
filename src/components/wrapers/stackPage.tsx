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
    action?: () => void;
}

const StackPage = ({
    children,
    navigation,
    title,
    icon,
    action,
    back = true,
}: StackPageProps) => {
    const { theme } = useContext(ThemeContext);

    const iconSize = 30;

    return (
        <Background noPadding>
            <View style={styles.topBar}>
                {back && (
                    <AnimatedTouchable
                        style={{ marginLeft: 10 }}
                        onPress={() => {
                            navigation.goBack();
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
                    <Text center size={24}>
                        {title}
                    </Text>
                </View>
                {icon && (
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
                )}
            </View>
            <View style={styles.container}>{children}</View>
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
        marginBottom: 5,
    },
    cornerButton: {
        marginRight: 10,
    },
});
