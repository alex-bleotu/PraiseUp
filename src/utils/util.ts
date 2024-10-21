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

export const translateVerse = (verse: string): string => {
    const bookTranslations: { [key: string]: string } = {
        // Old Testament
        Geneza: "Genesis",
        Exodul: "Exodus",
        Leviticul: "Leviticus",
        Numeri: "Numbers",
        Deuteronomul: "Deuteronomy",
        Iosua: "Joshua",
        Judecători: "Judges",
        Rut: "Ruth",
        "1 Samuel": "1 Samuel",
        "2 Samuel": "2 Samuel",
        "1 Împărați": "1 Kings",
        "2 Împărați": "2 Kings",
        "1 Cronici": "1 Chronicles",
        "2 Cronici": "2 Chronicles",
        Ezra: "Ezra",
        Neemia: "Nehemiah",
        Estera: "Esther",
        Iov: "Job",
        Psalmi: "Psalms",
        Proverbe: "Proverbs",
        Eclesiastul: "Ecclesiastes",
        "Cântarea Cântărilor": "Song of Solomon",
        Isaia: "Isaiah",
        Ieremia: "Jeremiah",
        "Plângerile lui Ieremia": "Lamentations",
        Ezechiel: "Ezekiel",
        Daniel: "Daniel",
        Osea: "Hosea",
        Ioel: "Joel",
        Amos: "Amos",
        Obadia: "Obadiah",
        Iona: "Jonah",
        Mica: "Micah",
        Naum: "Nahum",
        Habacuc: "Habakkuk",
        Țefania: "Zephaniah",
        Hagai: "Haggai",
        Zaharia: "Zechariah",
        Maleahi: "Malachi",

        // New Testament
        Matei: "Matthew",
        Marcu: "Mark",
        Luca: "Luke",
        Ioan: "John",
        "Faptele Apostolilor": "Acts",
        Romani: "Romans",
        "1 Corinteni": "1 Corinthians",
        "2 Corinteni": "2 Corinthians",
        Galateni: "Galatians",
        Efeseni: "Ephesians",
        Filipeni: "Philippians",
        Coloseni: "Colossians",
        "1 Tesaloniceni": "1 Thessalonians",
        "2 Tesaloniceni": "2 Thessalonians",
        "1 Timotei": "1 Timothy",
        "2 Timotei": "2 Timothy",
        Tit: "Titus",
        Filimon: "Philemon",
        Evrei: "Hebrews",
        Iacov: "James",
        "1 Petru": "1 Peter",
        "2 Petru": "2 Peter",
        "1 Ioan": "1 John",
        "2 Ioan": "2 John",
        "3 Ioan": "3 John",
        Iuda: "Jude",
        Apocalipsa: "Revelation",
    };

    const match = verse.match(/^([1-3]?\s?[A-Za-zăîâșț]+)\s(\d+:\d+(-\d+)?)$/);
    if (!match) {
        return "Invalid verse format";
    }

    const book = match[1].trim();
    const reference = match[2];

    const translatedBook =
        Object.keys(bookTranslations).find(
            (key) => bookTranslations[key] === book || key === book
        ) || "Unknown Book";

    return `${translatedBook} ${reference}`;
};

export const getBibleLink = (verse: string, language: "ro" | "en"): string => {
    const versionMap: { [key: string]: string } = {
        ro: "126", // NTR
        en: "111", // NIV
    };

    const bookAbbreviations: { [key: string]: string } = {
        // Old Testament
        Genesis: "GEN",
        Exodus: "EXO",
        Leviticus: "LEV",
        Numbers: "NUM",
        Deuteronomy: "DEU",
        Joshua: "JOS",
        Judges: "JDG",
        Ruth: "RUT",
        "1 Samuel": "1SA",
        "2 Samuel": "2SA",
        "1 Kings": "1KI",
        "2 Kings": "2KI",
        "1 Chronicles": "1CH",
        "2 Chronicles": "2CH",
        Ezra: "EZR",
        Nehemiah: "NEH",
        Esther: "EST",
        Job: "JOB",
        Psalms: "PSA",
        Proverbs: "PRO",
        Ecclesiastes: "ECC",
        "Song of Solomon": "SNG",
        Isaiah: "ISA",
        Jeremiah: "JER",
        Lamentations: "LAM",
        Ezekiel: "EZK",
        Daniel: "DAN",
        Hosea: "HOS",
        Joel: "JOL",
        Amos: "AMO",
        Obadiah: "OBA",
        Jonah: "JON",
        Micah: "MIC",
        Nahum: "NAM",
        Habakkuk: "HAB",
        Zephaniah: "ZEP",
        Haggai: "HAG",
        Zechariah: "ZEC",
        Malachi: "MAL",

        // New Testament
        Matthew: "MAT",
        Mark: "MRK",
        Luke: "LUK",
        John: "JHN",
        Acts: "ACT",
        Romans: "ROM",
        "1 Corinthians": "1CO",
        "2 Corinthians": "2CO",
        Galatians: "GAL",
        Ephesians: "EPH",
        Philippians: "PHP",
        Colossians: "COL",
        "1 Thessalonians": "1TH",
        "2 Thessalonians": "2TH",
        "1 Timothy": "1TI",
        "2 Timothy": "2TI",
        Titus: "TIT",
        Philemon: "PHM",
        Hebrews: "HEB",
        James: "JAS",
        "1 Peter": "1PE",
        "2 Peter": "2PE",
        "1 John": "1JN",
        "2 John": "2JN",
        "3 John": "3JN",
        Jude: "JUD",
        Revelation: "REV",
    };

    const match = verse.match(/^([\dA-Za-z\s]+)\s(\d+:\d+(-\d+)?)$/);
    if (!match) {
        return "Invalid verse format";
    }

    const book = match[1].trim();
    const reference = match[2].replace(":", ".");

    const bookAbbreviation = bookAbbreviations[book];
    if (!bookAbbreviation) {
        return "Unknown book";
    }

    const version = versionMap[language];

    return `https://www.bible.com/bible/${version}/${bookAbbreviation}.${reference}`;
};
