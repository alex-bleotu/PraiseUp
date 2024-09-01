import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyARM9TMtALzUPscjZYtLlMcCNgrIz1roHw",
    authDomain: "praiseup-37c47.firebaseapp.com",
    projectId: "praiseup-37c47",
    storageBucket: "praiseup-37c47.appspot.com",
    messagingSenderId: "742969818984",
    appId: "1:742969818984:web:414308e856683bce1560dd",
    measurementId: "G-W2JXKPS0MR",
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app, "gs://praiseup-37c47.appspot.com");
