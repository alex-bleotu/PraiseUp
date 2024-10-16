import * as FileSystem from "expo-file-system";
import { updateProfile, verifyBeforeUpdateEmail } from "firebase/auth";
import {
    arrayRemove,
    arrayUnion,
    deleteDoc,
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { getDownloadURL, getMetadata, getStorage, ref } from "firebase/storage";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { app, auth, db } from "../../firebaseConfig";
import { UserContext } from "./user";

export const ServerContext = createContext<any>(null);

export const ServerProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState<boolean>(false);

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
            console.log("Error adding favorite: ", err);
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
            console.log("Error removing favorite: ", err);
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
                console.log("User document does not exist.");
                return [];
            }
        } catch (err: any) {
            console.log("Error fetching favorites: ", err);
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createPersonalAlbum = async (
        albumId: string,
        title: string,
        uid: string
    ): Promise<void> => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const personalAlbumRef = doc(db, "personalAlbums", albumId);
            await setDoc(personalAlbumRef, {
                title: title,
                songs: [],
                creator: uid,
            });

            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                personalAlbumsIds: arrayUnion(albumId),
            });
        } catch (err: any) {
            console.log("Error adding personal album: ", err);
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
            const personalAlbumRef = doc(db, "personalAlbums", albumId);
            await updateDoc(personalAlbumRef, {
                ...(title && { title }),
                ...(songs && { songs }),
            });
        } catch (err: any) {
            console.log("Error updating personal album: ", err);
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
            console.log("Error syncing personal albums IDs: ", err);
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
                console.log("User document does not exist.");
                return [];
            }
        } catch (err: any) {
            console.log("Error fetching personal albums IDs: ", err);
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
            const personalAlbumRef = doc(db, "personalAlbums", albumId);
            await deleteDoc(personalAlbumRef);

            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                personalAlbumsIds: arrayRemove(albumId),
            });
        } catch (err: any) {
            console.log("Error deleting personal album: ", err);
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
            const personalAlbumRef = doc(db, "personalAlbums", albumId);
            const personalAlbumDoc = await getDoc(personalAlbumRef);

            if (personalAlbumDoc.exists()) {
                return personalAlbumDoc.data();
            } else {
                console.log("Personal album document does not exist.");
                return null;
            }
        } catch (err: any) {
            console.log("Error fetching personal album: ", err);
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
            console.log("Error checking for updates: ", err);
            return null;
        }
    };

    const getVersion = async () => {
        try {
            const storage = getStorage(app, "gs://praiseup-37c47.appspot.com");

            const fileRef = ref(storage, "bundle.json");

            const metadata = await getMetadata(fileRef);

            const version = metadata.customMetadata?.version;

            if (version) {
                return version;
            } else {
                console.log("No version metadata available.");
                return null;
            }
        } catch (err: any) {
            console.log("Error checking for updates: ", err);
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
            console.log("Error fetching cover: ", err);
            return null;
        }
    };

    const deleteCover = async (uri: string) => {
        try {
            await FileSystem.deleteAsync(uri);
        } catch (err: any) {
            console.log("Error deleting cover: ", err);
        }
    };

    const getUserData = async (passedUser: any = user) => {
        if (!passedUser) return null;

        const userDocRef = doc(db, "users", passedUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData;
        } else {
            console.log("User document does not exist.");
            return null;
        }
    };

    const getUserDisplayName = async (uid: string) => {
        try {
            if (!uid) return null;

            const userDocRef = doc(db, "users", uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                return userData?.displayName || null;
            } else {
                console.log("User document does not exist.");
                return null;
            }
        } catch (error) {
            console.log("Error fetching user:", error);
        }
    };

    const setUserDisplayName = async (uid: string, displayName: string) => {
        try {
            const userDocRef = doc(db, "users", uid);
            await updateDoc(userDocRef, {
                displayName: displayName,
            });
        } catch (error) {
            console.log("Error fetching user:", error);
        }
    };

    const removePersonalAlbum = async (albumId: string) => {
        if (!user) return;

        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                personalAlbumsIds: arrayRemove(albumId),
            });
        } catch (error) {
            console.log("Error removing personal album from user:", error);
        }
    };

    const updateUser = async (username: string, email: string) => {
        if (!user || !auth.currentUser) return;

        setLoading(true);
        setError(null);

        try {
            if (email) {
                try {
                    await verifyBeforeUpdateEmail(auth.currentUser, email);
                } catch (error: any) {
                    console.log(error);
                    return;
                }
            }

            await updateProfile(auth.currentUser, {
                displayName: username,
            });

            setUser({ ...user, displayName: username });

            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                displayName: username,
            });

            console.log("User updated successfully");
        } catch (error: any) {
            console.error("Error updating user: ", error);
            setError(error.message);
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
                deleteCover,
                getUserDisplayName,
                setUserDisplayName,
                getVersion,
                removePersonalAlbum,
                updateUser,
            }}>
            {children}
        </ServerContext.Provider>
    );
};
