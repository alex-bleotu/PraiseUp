module.exports = {
    locales: ["en", "ro"],
    sourceLocale: "en",
    catalogs: [
        {
            path: "./src/locales/{locale}/messages",
            include: ["src"],
        },
    ],
    format: "po",
};
