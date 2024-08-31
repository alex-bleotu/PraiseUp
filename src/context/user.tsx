import { User } from "firebase/auth";
import React, { createContext, ReactNode, useState } from "react";

export const UserContext = createContext<any>(null);

export const UserProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [user, setUser] = useState<User | null | undefined>(undefined);

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
