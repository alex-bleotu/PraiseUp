import { MaterialCommunityIcons as MCIcons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ThemeContext } from "../../context/theme";
import Text from "./text";

interface IconInputProps {
    icon: any;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    style?: any;
    hidden?: boolean;
    letterSpacing?: number;
    validate?: (value: string) => boolean;
    onValidateChange?: (value: boolean) => void;
    error?: boolean;
    errorText?: string;
    editable?: boolean;
    autoCapitalize?: boolean;
    keyboardType?: any;
    multiline?: boolean;
    lines?: number;
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
    error = false,
    errorText,
    editable = true,
    autoCapitalize = false,
    keyboardType,
    multiline = false,
    lines,
}: IconInputProps) => {
    const { theme } = useContext(ThemeContext);

    const [isFocused, setIsFocused] = useState(false);
    const [isHidden, setIsHidden] = useState(hidden);

    return (
        <>
            <View
                style={[
                    styles.container,
                    style,
                    {
                        backgroundColor: theme.colors.darkPaper,
                        borderWidth: 2,
                        borderColor: "transparent",
                        height: multiline ? undefined : 50,
                    },
                    error && {
                        borderColor: theme.colors.danger,
                    },
                ]}>
                <View
                    style={[
                        styles.iconContainer,
                        {
                            justifyContent: multiline
                                ? "flex-start"
                                : undefined,
                            marginTop: multiline ? 20 : 0,
                        },
                    ]}>
                    <MCIcons
                        name={icon}
                        color={theme.colors.grey}
                        style={{ marginLeft: 5 }}
                        size={26}
                    />
                </View>
                <TextInput
                    style={[
                        styles.input,
                        {
                            letterSpacing,
                            color: theme.colors.text,
                            fontSize: 16,
                            textAlignVertical: "top",
                        },
                    ]}
                    secureTextEntry={isHidden}
                    onChangeText={(text) => {
                        onChange(text);
                        if (validate && onValidateChange)
                            onValidateChange(validate(text.trim()));
                    }}
                    keyboardType={keyboardType ? keyboardType : "default"}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.grey}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    selectionColor={theme.colors.grey}
                    editable={editable}
                    autoCapitalize={autoCapitalize ? "words" : "none"}
                    multiline={multiline}
                    numberOfLines={lines}
                />
                {hidden && (
                    <View style={styles.eyeIconContainer}>
                        <TouchableOpacity
                            activeOpacity={theme.activeOpacity}
                            onPress={() => setIsHidden(!isHidden)}>
                            <MCIcons
                                name={isHidden ? "eye" : "eye-off"}
                                color={theme.colors.grey}
                                size={26}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {error && errorText && (
                <View style={styles.error}>
                    <Text color={theme.colors.danger} fontSize={14}>
                        {errorText}
                    </Text>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        width: "100%",
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 10,
        paddingRight: 8,
        paddingLeft: 10,
    },
    iconContainer: {
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    eyeIconContainer: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5,
    },
    error: {
        marginTop: 5,
        marginLeft: 15,
        alignSelf: "flex-start",
    },
});

export default IconInput;
