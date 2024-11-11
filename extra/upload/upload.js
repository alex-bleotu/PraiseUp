const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const https = require("https");
require("dotenv").config();

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);

const storage = new Storage({
    credentials: serviceAccount,
    projectId: serviceAccount.project_id,
    agent: new https.Agent({
        keepAlive: true,
        timeout: 120000,
    }),
});

const bucketName = "praiseup-37c47.appspot.com";
const localFilePath = path.join(__dirname, "../../assets/bundle.json");
const firebaseStoragePath = "bundle.json";

const uploadFileWithMetadata = async () => {
    try {
        const fileBuffer = fs.readFileSync(localFilePath);
        const data = JSON.parse(fileBuffer.toString());
        const version = data.version || "1.0";

        const bucket = storage.bucket(bucketName);
        const file = bucket.file(firebaseStoragePath);

        const metadata = {
            metadata: {
                customMetadata: {
                    version: version,
                    author: "Alex Bleotu",
                    created_at: new Date().toISOString(),
                },
            },
        };

        await file.save(fileBuffer, { resumable: false });
        await file.setMetadata(metadata);

        console.log("File uploaded and metadata set successfully.");
    } catch (err) {
        console.error(
            "Error uploading the file or setting metadata:",
            err.message
        );
    }
};

uploadFileWithMetadata();
