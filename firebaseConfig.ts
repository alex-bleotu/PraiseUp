import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCgtB2MaWXNf9uDACKYKCiPnguO8oN73AE",
    authDomain: "musicapp-26bf5.firebaseapp.com",
    projectId: "musicapp-26bf5",
    storageBucket: "musicapp-26bf5.appspot.com",
    messagingSenderId: "573744627786",
    appId: "1:573744627786:web:7db777d403d30ee67a66b3",
    measurementId: "G-EDWBT24WRZ",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
