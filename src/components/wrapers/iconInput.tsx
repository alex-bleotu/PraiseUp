import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ThemeContext } from "../../context/theme";

interface IconInputProps {
    icon: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    style?: any;
    hidden?: boolean;
    letterSpacing?: number;
    validate?: (value: string) => boolean;
    onValidateChange?: (value: boolean) => void;
    errorEmpty?: boolean;
    editable?: boolean;
    autoCapitalize?: boolean;
}

const IconInput = ({
    icon,
    placeholder,
    value,
    onChange,
    style,
    hidden = false,
    letterSpacing = 0.5,
    validate,
    onValidateChange,
    errorEmpty = false,
    editable = true,
    autoCapitalize = false,
}: IconInputProps) => {
    const { theme } = useContext(ThemeContext);

    const [isFocused, setIsFocused] = useState(false);
    const [isHidden, setIsHidden] = useState(hidden);

    return (
        <View
            style={[
                styles.container,
                style,
                {
                    backgroundColor: theme.colors.white,
                    borderWidth: 2,
                    borderColor: "transparent",
                },
                errorEmpty && {
                    borderColor: theme.colors.danger,
                    borderWidth: 2,
                },
            ]}>
            <View style={styles.iconContainer}>
                <MCIcons
                    text={icon}
                    color={theme.colors.grey}
                    style={{ marginLeft: 5 }}
                    size={24}
                />
            </View>
            <TextInput
                style={[
                    styles.input,
                    hidden && styles.password,
                    { letterSpacing, color: theme.colors.text },
                    value.length > 20 && { fontSize: 14 },
                    value.length > 25 && { fontSize: 13 },
                ]}
                secureTextEntry={isHidden}
                onChangeText={(text) => {
                    onChange(text);
                    if (validate && onValidateChange)
                        onValidateChange(validate(text.trim()));
                }}
                value={value}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.grey}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setIsFocused(false);
                }}
                selectionColor={theme.colors.grey}
                editable={editable}
                autoCapitalize={autoCapitalize ? "words" : "none"}
            />
            {hidden && (
                <View style={styles.iconContainer}>
                    <TouchableOpacity
                        activeOpacity={theme.activeOpacity}
                        onPress={() => {
                            setIsHidden(!isHidden);
                        }}>
                        <MCIcons
                            text={isHidden ? "eye" : "eye-off"}
                            color={theme.colors.grey}
                            size={24}
                        />
                    </TouchableOpacity>
                </View>
            )}
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
        width: 200,
        paddingRight: 2,
        backgroundColor: "transparent",
        letterSpacing: 0,
    },
    password: {
        width: 167,
    },
    iconContainer: {
        height: 40,
        width: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default IconInput;
