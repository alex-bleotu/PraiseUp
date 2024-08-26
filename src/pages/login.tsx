import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { AuthContext } from "../context/auth";

const Login = () => {
    const { setUserToken } = useContext(AuthContext);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
            <Button onPress={() => setUserToken("token")}>Login</Button>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({});
