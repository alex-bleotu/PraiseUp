import { motion } from "framer-motion";

interface StoreButtonProps {
    type: "apple" | "google";
    className?: string;
}

export function StoreButton({ type, className = "" }: StoreButtonProps) {
    const store = {
        apple: {
            src: "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
            alt: "Download on the App Store",
            href: "#",
        },
        google: {
            src: "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png",
            alt: "Get it on Google Play",
            href: "https://play.google.com/store/apps/details?id=com.praiseup",
        },
    };

    return (
        <motion.a
            href={store[type].href}
            className={`inline-block ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            <img
                src={store[type].src}
                alt={store[type].alt}
                className={`object-contain ${type === "google" ? "h-[58px]" : "h-[40px]"}`} // Make google button larger
            />
        </motion.a>
    );
}
