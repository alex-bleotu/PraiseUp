import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    GoogleSignin,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import {
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    fetchSignInMethodsForEmail,
    sendPasswordResetEmail as firebaseSendPasswordResetEmail,
    updatePassword as firebaseUpdatePassword,
    GoogleAuthProvider,
    linkWithCredential,
    reauthenticateWithCredential,
    signInAnonymously,
    signInWithCredential,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import { DataContext } from "./data";
import { LoadingContext } from "./loading";
import { RecentContext } from "./recent";
import { ServerContext } from "./server";
import { TutorialContext } from "./tutorial";
import { UserContext } from "./user";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const { clearData, syncFavorites, syncPersonalAlbums } =
        useContext(DataContext);
    const { setUserDisplayName, getUserDisplayName } =
        useContext(ServerContext);
    const { setUser } = useContext(UserContext);
    const { setLoading, setSyncLoading } = useContext(LoadingContext);
    const { activateTutorial } = useContext(TutorialContext);
    const { webClientId, iosClientId } = Constants.expoConfig?.extra || {};
    const { deleteRecent, fullyUpdateRecent } = useContext(RecentContext);

    const configureGoogleSignIn = async () => {
        GoogleSignin.configure({
            webClientId: webClientId,
            iosClientId: iosClientId,
        });
    };

    useEffect(() => {
        configureGoogleSignIn();

        const loadAuth = async () => {
            const user = await AsyncStorage.getItem("user");

            if (user) {
                const userParsed = JSON.parse(user);
                setUser(userParsed);
            } else setUser(null);
        };

        loadAuth();
    }, []);

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

    const login = async (
        email: string,
        password: string,
        loading: boolean = true
    ): Promise<any> => {
        if (loading) setLoading(true);

        return new Promise(async (resolve, reject) => {
            try {
                const response = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                setSyncLoading(true);

                setUser(response.user);
                fullyUpdateRecent([]);

                await syncFavorites(response.user);
                await syncPersonalAlbums(response.user);

                resolve(response.user);
            } catch (error) {
                reject(error);
            } finally {
                if (loading) setLoading(false);
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

                    activateTutorial();

                    await login(email, password, false).catch((error) => {
                        reject(error);
                    });

                    await setUserDisplayName(response.user.uid, username);
                }

                resolve(response.user);
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
                activateTutorial();

                const userCredential = await signInAnonymously(auth);

                await initializeUserDocument(userCredential.user.uid);

                setUser(userCredential.user);
                fullyUpdateRecent([]);

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
            await clearData();
            deleteRecent();
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
            await clearData();
            deleteRecent();
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

    const googleLogin = async (): Promise<any> => {
        return new Promise(async (resolve, reject) => {
            try {
                await GoogleSignin.hasPlayServices();
                const user = (await GoogleSignin.signIn()).data;

                const idToken = user?.idToken;
                const accessToken = (await GoogleSignin.getTokens())
                    .accessToken;

                if (!idToken) {
                    throw new Error("No idToken received from Google");
                }

                const googleCredential = GoogleAuthProvider.credential(
                    idToken,
                    accessToken
                );

                const response = await signInWithCredential(
                    auth,
                    googleCredential
                );

                const savedName = await getUserDisplayName(response.user.uid);

                if (!savedName)
                    await updateProfile(response.user, {
                        displayName: user.user.name,
                    });

                const userDocRef = doc(db, "users", response.user.uid);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    await initializeUserDocument(response.user.uid);
                }

                if (!savedName)
                    await setUserDisplayName(response.user.uid, user.user.name);

                setSyncLoading(true);

                setUser(response.user);
                fullyUpdateRecent([]);

                await syncFavorites(response.user);
                await syncPersonalAlbums(response.user);

                setSyncLoading(false);
                resolve(response.user);
            } catch (error: any) {
                if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                    console.log("User cancelled the login process");
                } else if (error.code === statusCodes.IN_PROGRESS) {
                    console.log("Sign-in is already in progress");
                } else if (
                    error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
                ) {
                    console.log("Play Services not available or outdated");
                } else {
                    console.log("Some other error happened:", error);
                    reject(error);
                }
            }
        });
    };

    const linkGuestWithGoogle = async (): Promise<any> => {
        return new Promise(async (resolve, reject) => {
            try {
                await GoogleSignin.hasPlayServices();
                const userInfo = (await GoogleSignin.signIn()).data;

                const idToken = userInfo?.idToken;
                const accessToken = (await GoogleSignin.getTokens())
                    .accessToken;

                if (!idToken) {
                    throw new Error("No idToken received from Google");
                }

                const googleCredential = GoogleAuthProvider.credential(
                    idToken,
                    accessToken
                );
                const email = userInfo.user.email;

                const signInMethods = await fetchSignInMethodsForEmail(
                    auth,
                    email
                );

                if (signInMethods.length > 0) {
                    reject(
                        "This Google account is already linked with another account."
                    );
                }

                const user = auth.currentUser;

                if (user) {
                    const response = await linkWithCredential(
                        user,
                        googleCredential
                    );

                    const savedName = await getUserDisplayName(
                        response.user.uid
                    );

                    if (!savedName)
                        await updateProfile(response.user, {
                            displayName: userInfo.user.name,
                        });

                    const userDocRef = doc(db, "users", response.user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (!userDoc.exists()) {
                        await initializeUserDocument(response.user.uid);
                    }

                    setUser(response.user);
                    fullyUpdateRecent([]);

                    if (!savedName)
                        await setUserDisplayName(
                            response.user.uid,
                            userInfo.user.name
                        );

                    resolve(response);
                } else {
                    throw new Error("No user is currently signed in.");
                }
            } catch (error: any) {
                if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                    console.log("User cancelled the login process");
                } else if (error.code === statusCodes.IN_PROGRESS) {
                    console.log("Sign-in is already in progress");
                } else if (
                    error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
                ) {
                    console.log("Play Services not available or outdated");
                } else {
                    console.log("Some other error happened:", error);
                    reject(error);
                }
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
                googleLogin,
                linkGuestWithGoogle,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
