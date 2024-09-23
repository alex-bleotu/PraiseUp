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
            <View
                style={{
                    marginTop: 10,
                    alignItems: "center",
                }}>
                <Text
                    fontSize={26}
                    bold
                    center
                    style={{ marginTop: 40, marginBottom: 20 }}>
                    {item.title}
                </Text>
                <Text
                    center
                    color={theme.colors.textVariant}
                    fontSize={17}
                    style={{ width: 275 }}>
                    {item.description}
                </Text>
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
        marginTop: -75,
    },
    image: {
        height: 250,
        resizeMode: "contain",
        justifyContent: "center",
        marginBottom: 50,
    },
});

export default OnboardItem;
