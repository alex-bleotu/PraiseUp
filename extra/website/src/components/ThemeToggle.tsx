import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme">
            {theme === "dark" ? (
                <Sun className="w-5 h-5" color="white" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    );
}
