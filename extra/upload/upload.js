const { initializeApp } = require("firebase/app");
const { getAuth, signInWithCustomToken } = require("firebase/auth");
const { getStorage, ref, uploadBytes } = require("firebase/storage");
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const serviceAccount = require("./admin.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

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

const uid = "fQqJ8YLnZaXVuBrzU3Tbp2NNtYx2";

admin
    .auth()
    .createCustomToken(uid)
    .then((customToken) => {
        signInWithCustomToken(auth, customToken)
            .then((userCredential) => {
                const uploadFileWithMetadata = async (
                    filePath,
                    storagePath
                ) => {
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
                        console.log(
                            "Uploaded the bundle. Current version:",
                            data.version
                        );
                    } catch (err) {
                        console.error("Error uploading the file:", err);
                    }
                };

                const localFilePath = path.join(
                    __dirname,
                    "../../assets/bundle.json"
                );
                const firebaseStoragePath = "bundle.json";

                uploadFileWithMetadata(localFilePath, firebaseStoragePath);
            })
            .catch((error) => {
                console.error("Error signing in with custom token:", error);
            });
    })
    .catch((error) => {
        console.error("Error creating custom token:", error);
    });
