import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    sendPasswordResetEmail as firebaseSendPasswordResetEmail,
    updatePassword as firebaseUpdatePassword,
    linkWithCredential,
    reauthenticateWithCredential,
    signInAnonymously,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, ReactNode, useContext } from "react";
import { auth, db } from "../../firebaseConfig";
import { DataContext } from "./data";
import { LoadingContext } from "./loading";
import { ServerContext } from "./server";
import { UserContext } from "./user";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const { clearData, syncFavorites, syncPersonalAlbums } =
        useContext(DataContext);
    const { setUserDisplayName } = useContext(ServerContext);
    const { setUser } = useContext(UserContext);
    const { setLoading } = useContext(LoadingContext);

    const loadAuth = async () => {
        const user = await AsyncStorage.getItem("user");

        if (user) {
            const userParsed = JSON.parse(user);
            setUser(userParsed);
        } else setUser(null);
    };

    const initializeUserDocument = async (uid: string) => {
        const userDocRef = doc(db, "users", uid);
        await setDoc(userDocRef, {
            favorites: [],
            personalAlbumsIds: [],
            personalAlbums: {},
        });
    };

    const deleteUserDocument = async (uid: string) => {
        const userDocRef = doc(db, "users", uid);
        await deleteDoc(userDocRef);
    };

    const login = async (email: string, password: string): Promise<any> => {
        setLoading(true);

        return new Promise(async (resolve, reject) => {
            try {
                const response = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                const userDocRef = doc(db, "users", response.user.uid);
                const userDoc = await getDoc(userDocRef);

                let favorites: string[] = [];

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    favorites = userData.favorites || [];
                }

                setUser(response.user);

                try {
                    await syncFavorites();
                    await syncPersonalAlbums();
                } catch (error) {
                    console.error("Error syncing data:", error);
                }

                resolve(response.user);
            } catch (error) {
                reject(error);
            } finally {
                setLoading(false);
            }
        });
    };

    const register = async (
        email: string,
        password: string,
        username: string
    ): Promise<any> => {
        setLoading(true);

        return new Promise(async (resolve, reject) => {
            try {
                const response = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                if (response.user) {
                    await updateProfile(response.user, {
                        displayName: username,
                    });

                    await initializeUserDocument(response.user.uid);

                    await login(email, password).catch((error) => {
                        reject(error);
                    });

                    await setUserDisplayName(response.user.uid, username);
                }

                resolve(response);
            } catch (error) {
                reject(error);
            } finally {
                setLoading(false);
            }
        });
    };

    const loginAsGuest = async (): Promise<any> => {
        return new Promise(async (resolve, reject) => {
            try {
                const userCredential = await signInAnonymously(auth);

                await initializeUserDocument(userCredential.user.uid);

                setUser(userCredential.user);

                resolve(userCredential.user);
            } catch (error) {
                reject(error);
            }
        });
    };

    const logout = async () => {
        setLoading(true);

        try {
            await auth.signOut();
            clearData();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const exitGuest = async () => {
        setLoading(true);

        try {
            if (auth.currentUser) {
                await deleteUserDocument(auth.currentUser.uid);
                await auth.currentUser.delete();
            }
            clearData();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const linkGuest = async (
        email: string,
        password: string,
        username: string
    ): Promise<any> => {
        setLoading(true);

        return new Promise(async (resolve, reject) => {
            try {
                const credential = EmailAuthProvider.credential(
                    email,
                    password
                );
                const user = auth.currentUser;

                if (user) {
                    const response = await linkWithCredential(user, credential);

                    await updateProfile(response.user, {
                        displayName: username,
                    });

                    await setUserDisplayName(response.user.uid, username);

                    setUser(response.user);

                    resolve(response);
                } else {
                    throw new Error("No user is currently signed in.");
                }
            } catch (error) {
                reject(error);
            } finally {
                setLoading(false);
            }
        });
    };

    const sendPasswordResetEmail = async (email: string): Promise<any> => {
        setLoading(true);

        return new Promise(async (resolve, reject) => {
            try {
                await firebaseSendPasswordResetEmail(auth, email);
                resolve("Password reset email sent successfully");
            } catch (error) {
                reject(error);
            } finally {
                setLoading(false);
            }
        });
    };

    const updatePassword = async (
        oldPassword: string,
        newPassword: string
    ): Promise<any> => {
        setLoading(true);

        return new Promise(async (resolve, reject) => {
            try {
                const user = auth.currentUser;
                if (!user) throw new Error("No user is currently logged in.");

                const credential = EmailAuthProvider.credential(
                    user.email!,
                    oldPassword
                );
                await reauthenticateWithCredential(user, credential);

                await firebaseUpdatePassword(user, newPassword);

                resolve("Password reset email sent successfully");
            } catch (error) {
                reject(error);
            } finally {
                setLoading(false);
            }
        });
    };

    const deleteAccount = async (password: string): Promise<any> => {
        setLoading(true);

        return new Promise(async (resolve, reject) => {
            try {
                const user = auth.currentUser;
                if (!user) throw new Error("No user is currently logged in.");

                const credential = EmailAuthProvider.credential(
                    user.email!,
                    password
                );
                await reauthenticateWithCredential(user, credential);

                await deleteUserDocument(user.uid);
                await user.delete();
                await AsyncStorage.removeItem("user");

                setUser(null);

                resolve("Account deleted successfully");
            } catch (error) {
                reject(error);
            } finally {
                setLoading(false);
            }
        });
    };

    return (
        <AuthContext.Provider
            value={{
                login,
                register,
                logout,
                loginAsGuest,
                exitGuest,
                linkGuest,
                sendPasswordResetEmail,
                deleteAccount,
                updatePassword,
                loadAuth,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
