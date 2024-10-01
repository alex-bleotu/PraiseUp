import "dotenv/config";

export default ({ config }) => ({
    ...config,
    name: "PraiseUp",
    slug: "PraiseUp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    scheme: "praiseup",
    splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.praiseup.app",
        associatedDomains: ["applinks:praiseup.alexbleotu.com"],
        googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST,
    },
    android: {
        package: "com.praiseup.app",
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#ffffff",
        },
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
        intentFilters: [
            {
                action: "VIEW",
                data: [
                    {
                        scheme: "https",
                        host: "praiseup.alexbleotu.com",
                        pathPrefix: "/",
                    },
                    {
                        scheme: "praiseup",
                    },
                ],
                category: ["BROWSABLE", "DEFAULT"],
            },
        ],
    },
    plugins: [
        "@react-native-google-signin/google-signin",
        "expo-localization",
        [
            "expo-font",
            {
                fonts: ["./assets/fonts/patrickHand.ttf"],
            },
        ],
    ],
    extra: {
        eas: {
            projectId: "ca9701e5-9bb2-4a8c-9e8a-2bd54c938e0b",
        },
        webClientId: process.env.WEB_CLIENT_ID,
        iosClientId: process.env.IOS_CLIENT_ID,
        androidClientId: process.env.ANDROID_CLIENT_ID,
        expoClientId: process.env.EXPO_CLIENT_ID,
        emailjsToken: process.env.EMAILJS_TOKEN,
    },
});
