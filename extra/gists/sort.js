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

    if (jsonData.songs && Array.isArray(jsonData.songs)) {
        jsonData.songs.sort((a, b) => a.title.localeCompare(b.title));
    } else {
        console.error("No 'songs' array found in JSON data.");
        return;
    }

    fs.writeFile(
        "songs_sorted.json",
        JSON.stringify(jsonData, null, 2),
        "utf8",
        (writeErr) => {
            if (writeErr) {
                console.error("Error writing file:", writeErr);
            } else {
                console.log(
                    "Songs sorted by title and saved to songs_sorted.json"
                );
            }
        }
    );
});
