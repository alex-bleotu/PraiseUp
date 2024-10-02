import { t } from "@lingui/macro";
import React from "react";
import { StyleSheet } from "react-native";
import StackPage from "../components/wrapers/stackPage";

const AboutUs = ({ navigation }: { navigation: any }) => {
    return (
        <StackPage title={t`About Us`} navigation={navigation} noBottom variant>
            <></>
        </StackPage>
    );
};

export default AboutUs;

const styles = StyleSheet.create({});
