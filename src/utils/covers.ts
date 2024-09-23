const covers = {
    default: require("../../assets/images/covers/default.png"),
    favorites: require("../../assets/images/covers/default.png"),
};

export const coversList = Object.keys(covers);

export const getImage = (cover: string | null) => {
    if (cover === null || cover === "none" || cover === undefined)
        return covers.default;

    if (cover.includes("file://")) return { uri: cover };

    return covers[cover as keyof typeof covers] || covers.default;
};
