import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import Background from "../components/wrapers/background";
import { messages as enMessages } from "../locales/en/messages";
import { messages as roMessages } from "../locales/ro/messages";

i18n.load({
    en: enMessages,
    ro: roMessages,
});

export const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [language, setLanguage] = useState<"en" | "ro">("en");
    const [key, setKey] = useState(0);

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const storedLanguage = await AsyncStorage.getItem("language");
                if (storedLanguage === "en" || storedLanguage === "ro") {
                    setLanguage(storedLanguage);
                } else {
                    if (getLocales()[0].languageCode === "en") {
                        await AsyncStorage.setItem("language", "en");
                        setLanguage("en");
                    } else {
                        await AsyncStorage.setItem("language", "ro");
                        setLanguage("ro");
                    }
                }
            } catch (error) {
                console.error(
                    "Failed to load language from AsyncStorage:",
                    error
                );
            }
        };

        loadLanguage();
    }, []);

    useEffect(() => {
        i18n.activate(language);
        AsyncStorage.setItem("language", language);
        setKey((prevKey) => prevKey + 1);
    }, [language]);

    if (!language) return <Background />;

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            <I18nProvider i18n={i18n} key={key}>
                {children}
            </I18nProvider>
        </LanguageContext.Provider>
    );
};
