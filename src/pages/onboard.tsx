import { t } from "@lingui/macro";
import { useContext, useMemo, useRef } from "react";
import { Animated, FlatList, StyleSheet, View } from "react-native";
import OnboardItem from "../components/items/onboardItem";
import Background from "../components/wrapers/background";
import Button from "../components/wrapers/button";
import Paginator from "../components/wrapers/paginator";
import { ThemeContext } from "../context/theme";

function Onboard({ navigation }: { navigation: any }) {
    const { theme } = useContext(ThemeContext);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    // Memoized slides data
    const slides = useMemo(
        () => [
            {
                id: 1,
                title: t`Worship Made Easy`,
                description: t`Access lyrics and chords with ease, bringing your worship moments to life.`,
                image: require("../../assets/images/onboard/image.png"),
            },
            {
                id: 2,
                title: t`Your Music, His Glory`,
                description: t`Organize and share your favorite worship songs with your friends.`,
                image: require("../../assets/images/onboard/image2.png"),
            },
            {
                id: 3,
                title: t`Prepare, Play, Praise`,
                description: t`Make your worship sessions with quick access to slideshows and more.`,
                image: require("../../assets/images/onboard/image3.png"),
            },
        ],
        []
    );

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
                keyExtractor={(item: any) => String(item.id)}
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
                    color={theme.colors.textOnPrimary}
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
        bottom: 100, // Ensuring the paginator does not overlap the buttons
    },
    buttons: {
        marginBottom: 20,
        width: "100%",
        paddingHorizontal: 20,
    },
});
