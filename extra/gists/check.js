const fs = require("fs");

const checkForDuplicateTitles = () => {
    const data = JSON.parse(fs.readFileSync("songs.json", "utf8"));
    const songs = data.songs;
    const titleCount = {};
    const duplicates = [];

    songs.forEach((song) => {
        const title = song.title || "Untitled";
        if (titleCount[title]) {
            titleCount[title]++;
            duplicates.push(title);
        } else {
            titleCount[title] = 1;
        }
    });

    if (duplicates.length > 0) {
        console.log("Duplicate titles found:", [...new Set(duplicates)]);
    } else {
        console.log("No duplicate titles found.");
    }
};

checkForDuplicateTitles();
