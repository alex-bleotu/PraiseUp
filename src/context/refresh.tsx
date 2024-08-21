import React, { createContext, ReactNode, useState } from "react";

export const RefreshContext = createContext<any>(null);

export const RefreshProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [refresh, setRefresh] = useState<number>(0);

    const updateRefresh = () => {
        setRefresh(refresh + 1);
    };

    return (
        <RefreshContext.Provider
            value={{
                refresh,
                updateRefresh,
            }}>
            {children}
        </RefreshContext.Provider>
    );
};
