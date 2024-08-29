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
    User,
} from "firebase/auth";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [user, setUser] = useState<User | null | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const user = await AsyncStorage.getItem("user");

            if (user) setUser(JSON.parse(user));
            else setUser(null);

            setLoading(false);
        };
        load();
    }, []);

    useEffect(() => {
        if (user) AsyncStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    const login = async (email: string, password: string): Promise<any> => {
        setLoading(true);

        return new Promise(async (resolve, reject) => {
            try {
                const response = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                setUser(response.user);
                resolve(response);
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

                    await login(email, password).catch((error) => {
                        reject(error);
                    });
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
                setUser(userCredential.user);
                resolve(userCredential);
            } catch (error) {
                reject(error);
            }
        });
    };

    const logout = async () => {
        setLoading(true);

        try {
            await auth.signOut();
            await AsyncStorage.removeItem("user");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const exitGuest = async () => {
        setLoading(true);

        try {
            await auth.currentUser?.delete();
            await AsyncStorage.removeItem("user");
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
                user,
                loading,
                login,
                register,
                logout,
                loginAsGuest,
                exitGuest,
                linkGuest,
                sendPasswordResetEmail,
                deleteAccount,
                updatePassword,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
