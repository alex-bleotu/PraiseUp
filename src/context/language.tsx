import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import * as RNLocalize from "react-native-localize";
import { messages as enMessages } from "../../src/locales/en/messages";
import { messages as roMessages } from "../../src/locales/ro/messages";

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
    const [language, setLanguage] = useState<"en" | "ro">("ro");
    const [key, setKey] = useState(0);

    console.log(RNLocalize.getLocales());

    useEffect(() => {
        const loadLanguage = async () => {
            const storedLanguage = await AsyncStorage.getItem("language");
            if (storedLanguage === "en" || storedLanguage === "ro") {
                setLanguage(storedLanguage);
            } else {
                // const locales = RNLocalize.getLocales();

                // if (locales[0].languageCode === "en") {
                //     await AsyncStorage.setItem("language", "en");
                //     setLanguage("en");
                // } else {
                //     await AsyncStorage.setItem("language", "ro");
                //     setLanguage("ro");
                // }

                await AsyncStorage.setItem("language", "en");
                setLanguage("en");
            }
        };

        loadLanguage();
    }, []);

    useEffect(() => {
        i18n.activate(language);
        AsyncStorage.setItem("language", language);
        setKey((prevKey) => prevKey + 1);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            <I18nProvider i18n={i18n} key={key}>
                {children}
            </I18nProvider>
        </LanguageContext.Provider>
    );
};
