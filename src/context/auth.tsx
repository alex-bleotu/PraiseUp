import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect, useState } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const token = await AsyncStorage.getItem("token");
            setUserToken(token);

            setLoading(false);
        };
        load();
    }, []);

    useEffect(() => {
        if (userToken === null || loading) return;

        AsyncStorage.setItem("token", userToken);
    }, [userToken]);

    return (
        <AuthContext.Provider
            value={{
                userToken,
                setUserToken,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
