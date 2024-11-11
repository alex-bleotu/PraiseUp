const { Storage } = require("@google-cloud/storage");
const https = require("https");

const customAgent = new https.Agent({
    keepAlive: true,
    timeout: 60000,
});

const storage = new Storage({
    projectId: "praiseup-37c47",
    keyFilename: "./admin.json",
    agent: customAgent,
});

const bucket = storage.bucket("praiseup-37c47.appspot.com");
const localFilePath = path.join(__dirname, "../../assets/bundle.json");
const firebaseStoragePath = "bundle.json";

const uploadFileWithMetadata = async (filePath, storagePath) => {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const data = JSON.parse(fileBuffer.toString());

        const metadata = {
            metadata: {
                customMetadata: {
                    version: data.version,
                    author: "Alex Bleotu",
                    created_at: new Date().toISOString(),
                },
            },
        };

        const file = bucket.file(storagePath);
        await file.save(fileBuffer, metadata);
        console.log("Uploaded the bundle. Current version:", data.version);
    } catch (err) {
        console.error("Error uploading the file:", err.message);
    }
};

uploadFileWithMetadata(localFilePath, firebaseStoragePath);
