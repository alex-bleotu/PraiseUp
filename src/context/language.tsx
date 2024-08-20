import React, { createContext, ReactNode, useEffect, useState } from "react";

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { messages as enMessages } from "../../src/locales/en/messages";
import { messages as roMessages } from "../../src/locales/ro/messages";

i18n.load({
    en: enMessages,
    ro: roMessages,
});

i18n.activate("ro");

export const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [language, setLanguage] = useState<"en" | "ro">("ro");

    useEffect(() => {
        i18n.activate(language);
    }, [language]);

    const changeLanguage = () => {
        setLanguage("ro");
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                changeLanguage,
            }}>
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
        </LanguageContext.Provider>
    );
};
