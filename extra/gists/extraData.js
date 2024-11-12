const fs = require("fs");

fs.readFile("../../assets/bundle.json", "utf8", (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    let jsonData;
    try {
        jsonData = JSON.parse(data);
    } catch (parseErr) {
        console.error("Error parsing JSON:", parseErr);
        return;
    }

    const songsMissingExtraData = jsonData.songs.filter(
        (song) => song.extraData === undefined
    );

    if (songsMissingExtraData.length > 0) {
        console.log("Songs missing extraData:");
        songsMissingExtraData.forEach((song) => {
            console.log(`- Title: ${song.title}, ID: ${song.id}`);
        });
    } else {
        console.log("All songs have extraData defined.");
    }
});
