import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView as SV } from "react-native-gesture-handler";

interface ScrollViewProps {
    children: React.ReactNode | React.ReactNode[];
    style?: ViewStyle | ViewStyle[];
    bottom?: number;
    top?: number;
    horizontal?: boolean;
    showScroll?: boolean;
    scrollEnabled?: boolean;
    waitFor?: any;
    onScroll?: (event: any) => void;
}

const ScrollView = ({
    children,
    style,
    bottom = 0,
    top = 0,
    horizontal = false,
    showScroll = true,
    scrollEnabled = true,
    waitFor,
    onScroll,
}: ScrollViewProps) => {
    return (
        <SV
            overScrollMode="never"
            contentContainerStyle={style}
            showsHorizontalScrollIndicator={showScroll}
            showsVerticalScrollIndicator={showScroll}
            scrollEnabled={scrollEnabled}
            waitFor={waitFor}
            onScroll={onScroll}
            scrollEventThrottle={16}
            horizontal={horizontal}>
            <View style={{ margin: top }} />
            {children}
            <View style={{ margin: bottom }} />
        </SV>
    );
};

export default ScrollView;

const styles = StyleSheet.create({});
