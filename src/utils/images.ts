const covers = {
    default: require("../../assets/images/default.png"),
    default1: require("../../assets/images/1.png"),
    default2: require("../../assets/images/2.png"),
    default3: require("../../assets/images/3.png"),
    default4: require("../../assets/images/4.png"),
};

export const getImage = (cover: string | null) => {
    if (cover === null) return covers.default;

    return covers[cover as keyof typeof covers] || covers.default;
};
