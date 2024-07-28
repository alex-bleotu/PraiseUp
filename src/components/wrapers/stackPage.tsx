import { Entypo as EIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { getTheme } from "../../utils/theme";
import AnimatedTouchable from "./animatedTouchable";
import Background from "./background";
import Text from "./text";

interface StackPageProps {
    children: React.ReactNode | React.ReactNode[];
    navigation: any;
    title: string;
}

const StackPage = ({ children, navigation, title }: StackPageProps) => {
    const theme = getTheme();

    return (
        <Background noPadding>
            <View style={styles.topBar}>
                <AnimatedTouchable
                    style={{ marginLeft: 10 }}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <EIcons
                        name="chevron-left"
                        size={30}
                        color={theme.colors.text}
                    />
                </AnimatedTouchable>
                <View style={styles.textContainer}>
                    <Text center size={24}>
                        {title}
                    </Text>
                </View>
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
        paddingBottom: 30,
    },
    textContainer: {
        flex: 1,
        alignItems: "center",
        marginRight: 40,
    },
    container: {
        width: "100%",
        display: "flex",
        flex: 1,
        marginBottom: 10,
    },
});
