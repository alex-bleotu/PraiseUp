import React, { useContext, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Background from "../components/wrapers/background";
import Button from "../components/wrapers/button";
import { BottomSheetContext } from "../context/bottomSheet";

const User = () => {
    const { setBottomSheetContent, bottomSheetRef } =
        useContext(BottomSheetContext);

    useEffect(() => {
        setBottomSheetContent(<Text>Bottom Sheet Content</Text>);
    }, []);

    return (
        <Background>
            <Button
                text="Open Bottom Sheet"
                onPress={() => bottomSheetRef.current?.open()}
                mode={"contained"}
            />
            <Text>User</Text>
        </Background>
    );
};

export default User;

const styles = StyleSheet.create({});
