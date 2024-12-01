import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function isValidUUID(id: string | undefined): boolean {
    const uuidRegex =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return id ? uuidRegex.test(id) : false;
}

function getPlatformRedirectUrl() {
    const userAgent = navigator.userAgent || navigator.vendor;

    if (/android/i.test(userAgent)) {
        return "https://play.google.com/store/apps/details?id=com.praiseup";
    } else if (/iPad|iPhone|iPod/i.test(userAgent)) {
        return "https://apps.apple.com/us/app/praiseup/idxxxxxxxxx";
    }
    return "/";
}

export function AppRedirect() {
    const { id, type } = useParams<Record<string, string | undefined>>();
    const navigate = useNavigate();
    const [isValidLink, setIsValidLink] = useState(true);

    useEffect(() => {
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        if (prefersDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        const themeListener = (e: MediaQueryListEvent) => {
            if (e.matches) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        };

        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", themeListener);

        return () => {
            window
                .matchMedia("(prefers-color-scheme: dark)")
                .removeEventListener("change", themeListener);
        };
    }, []);

    useEffect(() => {
        const newId = id?.slice(1);

        if (!newId || !isValidUUID(newId) || !type) {
            setIsValidLink(false);
            return;
        }

        const appUrl = `praiseup://home/${type}/${id}`;

        if (navigator.userAgent.includes("Android")) {
            window.location.href = appUrl;
        } else if (navigator.userAgent.includes("iPad|iPhone|iPod")) {
            window.location.href = appUrl;
        } else {
            window.location.href = getPlatformRedirectUrl();
        }

        const timeout = setTimeout(() => {
            window.location.href = getPlatformRedirectUrl();
        }, 1000);

        return () => clearTimeout(timeout);
    }, [id, type]);

    if (!isValidLink) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark transition-colors">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-8 bg-paper-light dark:bg-paper-dark rounded-2xl shadow-xl max-w-md w-full m-6">
                    <h1 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">
                        Wrong Link
                    </h1>
                    <p className="text-text-variant mb-6 dark:text-text-dark">
                        The link provided is not valid.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-paper-darkLight dark:bg-paper-darkDark text-text-light dark:text-text-dark px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                        Back to Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark transition-colors">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8 bg-paper-light dark:bg-paper-dark rounded-2xl shadow-xl max-w-md w-full m-6">
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex justify-center mb-6">
                    <img src="/logo.png" alt="PraiseUp" className="w-16 h-16" />
                </motion.div>
                <h1 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">
                    Opening PraiseUp...
                </h1>
                <p className="text-text-variant mb-6 dark:text-text-dark">
                    If the app doesn't open automatically, you may need to
                    install it first.
                </p>
                <div className="space-y-4">
                    <button
                        onClick={() => {
                            window.location.href = getPlatformRedirectUrl();
                        }}
                        className="w-full bg-primary-light dark:bg-primary-dark text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                        Get the App
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-paper-darkLight dark:bg-paper-darkDark text-text-light dark:text-text-dark px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                        Back to Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
