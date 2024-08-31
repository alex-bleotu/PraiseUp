import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { db } from "../../firebaseConfig";
import { UserContext } from "./user";

export const ServerContext = createContext<any>(null);

export const ServerProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const { user, setUser } = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addFavorite = async (id: string): Promise<void> => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                favorites: arrayUnion(id),
            });

            const updatedUser = {
                ...user,
                favorites: [...user.favorites, id],
            };
            setUser(updatedUser);
        } catch (err: any) {
            console.error("Error adding favorite: ", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (id: string): Promise<void> => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                favorites: arrayRemove(id),
            });

            const updatedUser = {
                ...user,
                favorites: user.favorites.filter(
                    (favoriteId: string) => favoriteId !== id
                ),
            };
            setUser(updatedUser);
        } catch (err: any) {
            console.error("Error removing favorite: ", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ServerContext.Provider
            value={{
                loading,
                error,
                addFavorite,
                removeFavorite,
            }}>
            {children}
        </ServerContext.Provider>
    );
};
