import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView as SV } from "react-native-gesture-handler";

interface ScrollViewProps {
    children: React.ReactNode | React.ReactNode[];
    style?: ViewStyle;
    bottom?: number;
    top?: number;
}

const ScrollView = ({
    children,
    style,
    bottom = 15,
    top = 0,
}: ScrollViewProps) => {
    return (
        <SV overScrollMode="never" style={style}>
            <View style={{ margin: top }} />
            {children}
            <View style={{ margin: bottom }} />
        </SV>
    );
};

export default ScrollView;

const styles = StyleSheet.create({});
