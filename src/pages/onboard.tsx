import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRef, useState } from "react";
import { Animated, FlatList } from "react-native";

import OnboardItem from "../components/items/onboardItem";
import Background from "../components/wrapers/background";
import NextButton from "../components/wrapers/nextButton";
import Paginator from "../components/wrapers/paginator";
import slides from "../utils/slides";

function Onboard({ navigation }: { navigation: any }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = async () => {
        if (currentIndex < slides.length - 1) {
            (slidesRef.current as any).scrollToIndex({
                index: currentIndex + 1,
            });
        } else {
            AsyncStorage.setItem("onboard", "true");
            navigation.navigate("Login");
        }
    };

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
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
                showsHorizontalScrollIndicator={false}
            />

            <Paginator data={slides} scrollX={scrollX} />

            <NextButton
                scrollTo={scrollTo}
                percentage={(currentIndex + 1) * (100 / slides.length)}
                style={{ marginBottom: 60 }}
            />
        </Background>
    );
}

export default Onboard;
