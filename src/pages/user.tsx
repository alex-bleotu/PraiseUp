import React, { useContext } from "react";
import { StyleSheet, Text } from "react-native";
import Background from "../components/wrapers/background";
import Button from "../components/wrapers/button";
import { ThemeContext } from "../context/theme";

const User = () => {
    const { theme, changeTheme } = useContext(ThemeContext);

    return (
        <Background>
            <Text>User</Text>
            <Button
                mode="contained"
                text="Logout"
                onPress={() => {
                    changeTheme();
                }}
            />
        </Background>
    );
};

export default User;

const styles = StyleSheet.create({});
