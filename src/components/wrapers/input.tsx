import { useContext, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { ThemeContext } from "../../context/theme";

interface InputProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    style?: any;
    hidden?: boolean;
    errorEmpty?: boolean;
    editable?: boolean;
    autoCapitalize?: boolean;
    maxLength?: number;
}

const Input = ({
    placeholder,
    value,
    onChange,
    style,
    hidden,
    errorEmpty = false,
    editable = true,
    autoCapitalize = false,
    maxLength,
}: InputProps) => {
    const { theme } = useContext(ThemeContext);

    const [isFocused, setIsFocused] = useState(false);

    return (
        <View
            style={[
                styles.container,
                style,
                {
                    backgroundColor: theme.colors.background,
                    borderWidth: 2,
                    borderColor: "transparent",
                },
                errorEmpty && {
                    borderColor: theme.colors.danger,
                    borderWidth: 2,
                },
            ]}>
            <TextInput
                style={{ ...styles.input, color: theme.colors.text }}
                secureTextEntry={hidden}
                onChangeText={onChange}
                value={value}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.grey}
                onFocus={() => {
                    setIsFocused(true);
                }}
                onBlur={() => setIsFocused(false)}
                selectionColor={theme.colors.grey}
                editable={editable}
                autoCapitalize={autoCapitalize ? "words" : "none"}
                maxLength={maxLength}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 20,
        width: 250,
        height: 40,
    },
    input: {
        fontSize: 15,
        width: "100%",
        paddingLeft: 10,
        paddingRight: 8,
        backgroundColor: "transparent",
        marginLeft: 2,
        letterSpacing: 0,
    },
});

export default Input;
