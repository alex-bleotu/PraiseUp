import React, { createContext, ReactNode, useState } from "react";

export const LoadingContext = createContext<any>(null);

export const LoadingProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [syncLoading, setSyncLoading] = useState<boolean>(false);

    return (
        <LoadingContext.Provider
            value={{
                loading,
                setLoading,
                syncLoading,
                setSyncLoading,
            }}>
            {children}
        </LoadingContext.Provider>
    );
};
