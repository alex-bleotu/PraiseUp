import { Instagram, Globe } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
    const socialLinks = [
        { icon: Globe, href: "https://alexbleotu.com" },
        { icon: Instagram, href: "https://instagram.com/alex.bleotu" },
    ];

    return (
        <footer className="bg-paper-light dark:bg-paper-dark border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <img src="/logo.png" className="w-8 h-8" />
                            <span className="text-xl font-bold text-text-light dark:text-text-dark">
                                PraiseUp
                            </span>
                        </div>
                        <p className="text-text-variant max-w-md">
                            Join our community of worshippers and experience a
                            new way of connecting with God through music.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-text-light dark:text-text-dark mb-4">
                            Follow me
                        </h3>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="text-text-variant hover:text-primary-light dark:hover:text-primary-dark transition-colors">
                                        <Icon className="w-5 h-5" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row justify-center items-center">
                        <p className="text-text-variant text-sm">
                            © {new Date().getFullYear()} PraiseUp. Created with
                            ❤️ by Alex Bleotu.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
