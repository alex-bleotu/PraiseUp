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
