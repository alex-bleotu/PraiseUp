import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView as SV } from "react-native-gesture-handler";

interface ScrollViewProps {
    children: React.ReactNode | React.ReactNode[];
    style?: ViewStyle;
    bottom?: number;
    top?: number;
    horizontal?: boolean;
    showScroll?: boolean;
}

const ScrollView = ({
    children,
    style,
    bottom = 0,
    top = 0,
    horizontal = false,
    showScroll = true,
}: ScrollViewProps) => {
    return (
        <SV
            overScrollMode="never"
            contentContainerStyle={style}
            showsHorizontalScrollIndicator={showScroll}
            showsVerticalScrollIndicator={showScroll}
            horizontal={horizontal}>
            <View style={{ margin: top }} />
            {children}
            <View style={{ margin: bottom }} />
        </SV>
    );
};

export default ScrollView;

const styles = StyleSheet.create({});
