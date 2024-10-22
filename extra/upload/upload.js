const { initializeApp } = require("firebase/app");
const { getAuth, signInWithCustomToken } = require("firebase/auth");
const { getStorage, ref, uploadBytes } = require("firebase/storage");
const fs = require("fs");
const path = require("path");

const firebaseConfig = {
    apiKey: "AIzaSyARM9TMtALzUPscjZYtLlMcCNgrIz1roHw",
    authDomain: "praiseup-37c47.firebaseapp.com",
    projectId: "praiseup-37c47",
    storageBucket: "praiseup-37c47.appspot.com",
    messagingSenderId: "742969818984",
    appId: "1:742969818984:web:414308e856683bce1560dd",
    measurementId: "G-W2JXKPS0MR",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// const customToken =
//     "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTcyOTYwMDU0NiwiZXhwIjoxNzI5NjA0MTQ2LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay0xdW9qNkBwcmFpc2V1cC0zN2M0Ny5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLTF1b2o2QHByYWlzZXVwLTM3YzQ3LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoiZlFxSjhZTG5aYVhWdUJyelUzVGJwMk5OdFl4MiJ9.mhpXTN6pFiGXn3hrros-QeS5Mvddf8qbK_tXdk_V1uNBSkjMVarY_gY3DTDmzJemVk4XgXENv7erKYcq3FCtmX85nXEgX6xvq0OL_FgrbE-kKXt9arMZka1KBvWc6-SqMQxp4lcGOPjK2LJmLWAPm9zDxoArISkk-YySFq2rhcCFJVqPMljPMIw5dn0k6GQlLaemm1wf_lb_40Xswnma6Z5uOwf5mmAzSZ7FX1HkiKcv-N3bOH2RCCqMWQfap5nZyu_wiBjSLcaXpetfqY3Y8CzkO8wt7_JD6fFPB1yU9sT_WEyG2bau28uKmeBhNI8QRuveUgkj0TBNsy7ZrVKA6w";
const customToken = "";

signInWithCustomToken(auth, customToken)
    .then((userCredential) => {
        console.log("Admin user signed in!");

        const uploadFileWithMetadata = async (filePath, storagePath) => {
            try {
                const fileBuffer = fs.readFileSync(filePath);

                const fileRef = ref(storage, storagePath);

                const data = JSON.parse(fileBuffer.toString());

                const metadata = {
                    customMetadata: {
                        version: data.version,
                        author: "Alex Bleotu",
                        created_at: new Date().toISOString(),
                    },
                };

                await uploadBytes(fileRef, fileBuffer, metadata);
                console.log("File uploaded with metadata!");
            } catch (err) {
                console.error("Error uploading the file:", err);
            }
        };

        const localFilePath = path.join(__dirname, "../../assets/bundle.json");
        const firebaseStoragePath = "bundle.json";

        uploadFileWithMetadata(localFilePath, firebaseStoragePath);
    })
    .catch((error) => {
        console.error("Error signing in with custom token:", error);
    });
