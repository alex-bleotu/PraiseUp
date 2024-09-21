const covers = {
    default: require("../../assets/images/covers/default.png"),
    default1: require("../../assets/images/covers/1.png"),
    default2: require("../../assets/images/covers/2.png"),
    default3: require("../../assets/images/covers/3.png"),
    default4: require("../../assets/images/covers/4.png"),
};

export const coversList = Object.keys(covers);

export const getImage = (cover: string | null) => {
    if (cover === null || cover === "none" || cover === undefined)
        return covers.default;

    if (cover.includes("file://")) return { uri: cover };

    return covers[cover as keyof typeof covers] || covers.default;
};
