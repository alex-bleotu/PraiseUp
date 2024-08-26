import { useContext } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { ThemeContext } from "../../context/theme";
import Text from "../wrapers/text";

const OnboardItem = ({ item }: { item: any }) => {
    const { theme } = useContext(ThemeContext);
    const { width } = Dimensions.get("screen");

    return (
        <View style={[styles.container, { width }]}>
            <Image source={item.image} style={styles.image} />
            <View>
                <Text
                    fontSize={30}
                    bold
                    color={theme.colors.primary}
                    center
                    style={{ marginTop: 40, marginBottom: 10 }}>
                    {item.title}
                </Text>
                <Text center>{item.description}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: 300,
        paddingHorizontal: 30,
    },
    image: {
        width: 300,
        height: 275,
        resizeMode: "contain",
        justifyContent: "center",
    },
});

export default OnboardItem;
