import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "firebase/auth";
import React, { createContext, ReactNode, useEffect, useState } from "react";

export const UserContext = createContext<any>(null);

export const UserProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [user, setUser] = useState<User | null | undefined>(undefined);

    useEffect(() => {
        if (user === undefined) return;
        AsyncStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
            }}>
            {children}
        </UserContext.Provider>
    );
};
