interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
    return (
        <div className="p-6 bg-white dark:bg-paper-dark rounded-xl shadow-lg">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    );
}
