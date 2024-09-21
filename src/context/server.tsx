import * as FileSystem from "expo-file-system";
import {
    arrayRemove,
    arrayUnion,
    deleteField,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { app, db } from "../../firebaseConfig";
import { LoadingContext } from "./loading";
import { UserContext } from "./user";

export const ServerContext = createContext<any>(null);

export const ServerProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const { user } = useContext(UserContext);
    const { loading, setLoading } = useContext(LoadingContext);

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
        } catch (err: any) {
            console.error("Error removing favorite: ", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getFavorites = async () => {
        if (!user) return [];

        setLoading(true);
        setError(null);

        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                return userData?.favorites || [];
            } else {
                console.error("User document does not exist.");
                return [];
            }
        } catch (err: any) {
            console.error("Error fetching favorites: ", err);
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createPersonalAlbum = async (
        albumId: string,
        title: string
    ): Promise<void> => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                [`personalAlbums.${albumId}`]: {
                    title: title,
                    songs: [],
                },
                personalAlbumsIds: arrayUnion(albumId),
            });
        } catch (err: any) {
            console.error("Error adding personal album: ", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updatePersonalAlbum = async (
        albumId: string,
        title?: string,
        songs?: string[]
    ): Promise<void> => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                [`personalAlbums.${albumId}`]: {
                    title,
                    songs,
                },
            });
        } catch (err: any) {
            console.error("Error updating personal album: ", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updatePersonalAlbumsList = async (
        personalAlbumsIds: string[]
    ): Promise<void> => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                personalAlbumsIds: personalAlbumsIds,
            });
        } catch (err: any) {
            console.error("Error syncing personal albums IDs: ", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getPersonalAlbumsList = async () => {
        if (!user) return [];

        setLoading(true);
        setError(null);

        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                return userData?.personalAlbumsIds || [];
            } else {
                console.error("User document does not exist.");
                return [];
            }
        } catch (err: any) {
            console.error("Error fetching personal albums IDs: ", err);
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const deletePersonalAlbum = async (albumId: string): Promise<void> => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const userDocRef = doc(db, "users", user.uid);

            await updateDoc(userDocRef, {
                [`personalAlbums.${albumId}`]: deleteField(),
                personalAlbumsIds: arrayRemove(albumId),
            });
        } catch (err: any) {
            console.error("Error deleting personal album: ", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getPersonalAlbum = async (albumId: string): Promise<any | null> => {
        if (!user) return null;

        setLoading(true);
        setError(null);

        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const albumData = userData.personalAlbums?.[albumId] || null;
                return albumData;
            } else {
                console.error("User document does not exist.");
                return null;
            }
        } catch (err: any) {
            console.error("Error fetching personal album: ", err);
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const checkUpdates = async () => {
        try {
            const storage = getStorage(app, "gs://praiseup-37c47.appspot.com");

            const fileRef = ref(storage, "bundle.json");

            const url = await getDownloadURL(fileRef);

            const response = await fetch(url);

            const data = await response.json();

            return data;
        } catch (err: any) {
            console.error("Error checking for updates: ", err);
            return null;
        }
    };

    const saveCover = async (coverName: string) => {
        try {
            const storage = getStorage(app, "gs://praiseup-37c47.appspot.com");

            const fileRef = ref(storage, `covers/${coverName}.png`);

            const url = await getDownloadURL(fileRef);

            const localPath = `${FileSystem.documentDirectory}${coverName}`;

            const { uri } = await FileSystem.downloadAsync(url, localPath);

            return uri;
        } catch (err: any) {
            console.error("Error fetching cover: ", err);
            return null;
        }
    };

    const getUserData = async () => {
        if (!user) return null;

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData;
        } else {
            console.error("User document does not exist.");
            return null;
        }
    };

    return (
        <ServerContext.Provider
            value={{
                loading,
                error,
                addFavorite,
                removeFavorite,
                createPersonalAlbum,
                updatePersonalAlbum,
                updatePersonalAlbumsList,
                getPersonalAlbumsList,
                deletePersonalAlbum,
                getPersonalAlbum,
                checkUpdates,
                saveCover,
                getUserData,
                getFavorites,
            }}>
            {children}
        </ServerContext.Provider>
    );
};
