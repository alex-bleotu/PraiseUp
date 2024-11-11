const fs = require("fs");

// Load JSON data from songs.json
const data = JSON.parse(fs.readFileSync("songs.json", "utf8"));
const songs = data.songs;

// Count the number of songs for each artist
const artistCount = {};

songs.forEach((song) => {
    const artist = song.artist || "Unknown Artist";
    artistCount[artist] = (artistCount[artist] || 0) + 1;
});

// Convert artist count to an array of entries and sort by song count in descending order
const sortedArtists = Object.entries(artistCount)
    .sort((a, b) => b[1] - a[1])
    .map(([artist, count]) => ({ artist, count }));

// Display artists with the most songs
console.log("Artists with the most songs:");
sortedArtists.forEach(({ artist, count }) => {
    console.log(`${artist}: ${count} songs`);
});
