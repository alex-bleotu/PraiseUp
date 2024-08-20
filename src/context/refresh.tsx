import React, { createContext, ReactNode, useState } from "react";

export const RefreshContext = createContext<any>(null);

export const RefreshProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [refresh, setRefresh] = useState<number>(0);

    return (
        <RefreshContext.Provider
            value={{
                refresh,
                setRefresh,
            }}>
            {children}
        </RefreshContext.Provider>
    );
};
