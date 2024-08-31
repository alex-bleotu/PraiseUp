import { t } from "@lingui/macro";
import { useContext, useRef } from "react";
import { Animated, FlatList, StyleSheet, View } from "react-native";
import OnboardItem from "../components/items/onboardItem";
import Background from "../components/wrapers/background";
import Button from "../components/wrapers/button";
import Paginator from "../components/wrapers/paginator";
import { ThemeContext } from "../context/theme";
import slides from "../utils/slides";

function Onboard({ navigation }: { navigation: any }) {
    const { theme } = useContext(ThemeContext);

    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    return (
        <Background
            center
            noBottom
            noPadding
            style={{
                alignItems: "center",
            }}>
            <FlatList
                data={slides}
                renderItem={({ item }) => <OnboardItem item={item} />}
                horizontal
                pagingEnabled
                bounces={false}
                keyExtractor={(item: any) => item.id}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={32}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
                showsHorizontalScrollIndicator={false}
            />

            <View style={styles.paginator}>
                <Paginator data={slides} scrollX={scrollX} />
            </View>

            <View style={styles.buttons}>
                <Button
                    mode="contained"
                    text={t`Join PraiseUp`}
                    upper
                    fullWidth
                    fontSize={14}
                    bold
                    onPress={() => {
                        navigation.navigate("Register");
                    }}
                />
                <Button
                    mode="none"
                    text={t`Already have an account?`}
                    upper
                    fullWidth
                    fontSize={14}
                    bold
                    style={{ marginTop: 10 }}
                    color={theme.colors.grey}
                    onPress={() => {
                        navigation.navigate("Login");
                    }}
                />
            </View>
        </Background>
    );
}

export default Onboard;

const styles = StyleSheet.create({
    paginator: {
        position: "absolute",
    },
    buttons: {
        marginBottom: 20,
        width: "100%",
        paddingHorizontal: 20,
    },
});
