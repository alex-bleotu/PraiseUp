import React from "react";
import { StyleSheet, Text } from "react-native";
import StackPage from "../components/wrapers/stackPage";

const Settings = ({ navigation }: { navigation: any }) => {
    return (
        <StackPage title="Settings" navigation={navigation}>
            <Text>Settings</Text>
        </StackPage>
    );
};

export default Settings;

const styles = StyleSheet.create({});
