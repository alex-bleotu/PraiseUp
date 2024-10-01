import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Text from "./text";

interface MessageProps {
    variant: "success" | "error" | undefined;
    message: string;
    setShow: (arg0: boolean) => void;
}

const Message = ({ variant, message, setShow: disappear }: MessageProps) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timeId = setTimeout(() => {
            setShow(false);
            disappear(false);
        }, 5000);

        return () => {
            clearTimeout(timeId);
        };
    }, []);

    if (!show) return <></>;

    return (
        <View>
            <Text>{message}</Text>
        </View>
    );
};

export default Message;

const styles = StyleSheet.create({});
