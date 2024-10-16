export const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

export const getColorFromId = (id: string): string => {
    const pastelAdjustment = 80;
    const neonReduction = 0.6;

    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    let r = Math.min(
        255,
        ((hash >> 0) & 0xff) * neonReduction + pastelAdjustment
    );
    let g = Math.min(
        255,
        ((hash >> 8) & 0xff) * neonReduction + pastelAdjustment
    );
    let b = Math.min(
        255,
        ((hash >> 16) & 0xff) * neonReduction + pastelAdjustment
    );

    if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30) {
        r = Math.min(255, r + 40);
        b = Math.max(0, b - 40);
    }

    return `rgb(${r}, ${g}, ${b})`;
};

export const hexToRGBA = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
