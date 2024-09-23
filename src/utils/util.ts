export const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

export const getColorFromId = (id: string): string => {
    const hash = id.slice(1, 7);

    const r = parseInt(hash.slice(0, 2), 16);
    const g = parseInt(hash.slice(2, 4), 16);
    const b = parseInt(hash.slice(4, 6), 16);

    const pastelFactor = 0.7;

    const pastelR = Math.round((220 - r) * pastelFactor + r);
    const pastelG = Math.round((220 - g) * pastelFactor + g);
    const pastelB = Math.round((220 - b) * pastelFactor + b);

    return `rgb(${pastelR}, ${pastelG}, ${pastelB})`;
};
