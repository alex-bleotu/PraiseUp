import { t } from "@lingui/macro";
import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import Button from "../components/wrapers/button";
import StackPage from "../components/wrapers/stackPage";
import { LanguageContext } from "../context/language";
import { ThemeContext } from "../context/theme";

const Settings = ({ navigation }: { navigation: any }) => {
    const { theme, changeTheme } = useContext(ThemeContext);
    const { language, changeLanguage } = useContext(LanguageContext);

    return (
        <StackPage title={t`Settings`} navigation={navigation}>
            <Button
                mode="contained"
                text="Theme"
                onPress={() => {
                    changeTheme();
                }}
            />
            <Button
                mode="contained"
                text="Language"
                onPress={() => {
                    changeLanguage();
                }}
            />
        </StackPage>
    );
};

export default Settings;

const styles = StyleSheet.create({});
