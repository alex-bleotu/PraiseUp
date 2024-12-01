import { Music, Heart, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "../components/ThemeToggle";
import { FeatureCard } from "../components/FeatureCard";
import { Screenshots } from "../components/Screenshots";
import { StoreButton } from "../components/StoreButton";
import { Footer } from "../components/Footer";
import { DownloadButton } from "../components/DownloadButton";

const screenshots = [
    {
        imageLight: "/images/homeLight.png",
        imageDark: "/images/homeDark.png",
        title: "Discover Worship Songs",
        description: "Browse through our extensive library of worship songs",
    },
    {
        imageLight: "/images/songLight.png",
        imageDark: "/images/songDark.png",
        title: "Explore Songs",
        description: "Access lyrics, chords, and other song information",
    },
    {
        imageLight: "/images/albumLight.png",
        imageDark: "/images/albumDark.png",
        title: "Create Playlists",
        description: "Organize your favorite songs into custom playlists",
    },
];

export function Home() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors">
            <motion.nav
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                className="fixed w-full bg-paper-light/80 dark:bg-paper-dark/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <motion.div
                            className="flex items-center space-x-2"
                            whileHover={{ scale: 1.05 }}>
                            <img
                                src="/logo.png"
                                alt="PraiseUp Logo"
                                className="w-8 h-8"
                            />
                            <span className="text-xl font-bold text-text-light dark:text-text-dark">
                                PraiseUp
                            </span>
                        </motion.div>
                        <ThemeToggle />
                    </div>
                </div>
            </motion.nav>

            <main className="pt-20">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center">
                        <h1 className="text-4xl sm:text-6xl font-bold text-text-light dark:text-text-dark mb-6">
                            Your Personal Worship Experience
                        </h1>
                        <p className="text-xl text-text-variant mb-8 max-w-2xl mx-auto">
                            Discover, experience, and share your favorite
                            worship songs. Connect with a community of
                            worshippers around the world.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <DownloadButton />
                        </div>
                    </motion.div>
                </section>

                {/* Screenshots Section */}
                <section className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-20">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-text-light dark:text-text-dark text-center mb-12">
                        Experience PraiseUp
                    </motion.h2>
                    <Screenshots screenshots={screenshots} />
                </section>

                {/* Features Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-text-light dark:text-text-dark text-center mb-12">
                        Why Choose PraiseUp?
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Music className="w-6 h-6" />,
                                title: "Extensive Library",
                                description:
                                    "Access thousands of worship songs with lyrics and chords.",
                            },
                            {
                                icon: <Heart className="w-6 h-6" />,
                                title: "Personal Collections",
                                description:
                                    "Create and organize your favorite worship songs into custom playlists.",
                            },
                            {
                                icon: <Share2 className="w-6 h-6" />,
                                title: "Community Sharing",
                                description:
                                    "Share your arrangements and discover new worship songs from others.",
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}>
                                <FeatureCard {...feature} />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Download Section */}
                <section className="bg-primary-light/10 dark:bg-primary-dark/10 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark mb-8">
                            Ready to Start Your Worship Journey?
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <StoreButton type="apple" />
                            <StoreButton type="google" />
                        </div>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
