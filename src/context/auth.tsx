import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    linkWithCredential,
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
                console.log("Failed to login", error);
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
                        console.log("Failed to login after register", error);
                        reject(error);
                    });
                }

                resolve(response);
            } catch (error) {
                console.log("Failed to register", error);
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
                console.log("Failed to login as guest", error);
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
        } catch {
            console.log("Failed to logout");
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
        } catch {
            console.log("Failed to exit guest");
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
                console.log("Failed to link guest", error);
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
            }}>
            {children}
        </AuthContext.Provider>
    );
};
