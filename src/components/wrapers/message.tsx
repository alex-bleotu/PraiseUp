import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ThemeContext } from "../../context/theme";
import Text from "./text";

interface MessageProps {
    variant: "success" | "error" | undefined;
    message: string;
    setShow: (arg0: boolean) => void;
}

const Message = ({ variant, message, setShow: disappear }: MessageProps) => {
    const { theme } = useContext(ThemeContext);

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
        <View
            style={[
                styles.container,
                {
                    backgroundColor:
                        variant === "success"
                            ? theme.colors.successBackground
                            : variant === "error"
                            ? theme.colors.errorBackground
                            : "transparent",
                },
            ]}>
            <Text bold color={"white"}>
                {message}
            </Text>
        </View>
    );
};

export default Message;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: 12,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
});
