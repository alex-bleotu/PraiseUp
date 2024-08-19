import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import Background from "../components/wrapers/background";
import BottomSheetModal from "../components/wrapers/bottomSheetModal";
import Button from "../components/wrapers/button";

const User = () => {
    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);

    return (
        <Background>
            <Button
                text="Open Bottom Sheet"
                onPress={() => setBottomSheetOpen(true)}
                mode={"contained"}
            />
            <BottomSheetModal
                open={isBottomSheetOpen}
                onClose={() => {
                    setBottomSheetOpen(false);
                }}>
                <Text>Bottom Sheet Content</Text>
            </BottomSheetModal>
            <Text>User</Text>
        </Background>
    );
};

export default User;

const styles = StyleSheet.create({});
