import { Download } from "lucide-react";

export function DownloadButton() {
    const handleDownloadClick = () => {
        const userAgent = navigator.userAgent || navigator.vendor;

        if (/android/i.test(userAgent)) {
            window.location.href =
                "https://play.google.com/store/apps/details?id=com.praiseup";
        } else if (/iPad|iPhone|iPod/i.test(userAgent)) {
            window.location.href =
                "https://apps.apple.com/us/app/praiseup/idxxxxxxxxx";
        } else {
            window.location.href = "https://praiseup.com";
        }
    };

    return (
        <button
            onClick={handleDownloadClick}
            className="btn btn-primary w-full sm:w-auto mb-4 sm:mb-0 sm:mr-4 flex items-center justify-center bg-primary-light dark:bg-primary-dark text-white rounded-3xl py-3 px-6 hover:bg-primary-dark/80 hover:shadow-lg hover:shadow-primary-dark/50 transition duration-300 ease-in-out block">
            <Download className="w-6 h-6 mr-2" />
            Download Now
        </button>
    );
}
