const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const data = JSON.parse(fs.readFileSync("songs.json", "utf8"));
const songs = data.songs;

const bbsoSongs = songs
    .filter((song) => song.artist === "BBSO")
    .map((song) => song.id);

const album = {
    id: `A${uuidv4()}`,
    type: "album",
    title: "BBSO",
    creator: null,
    songs: bbsoSongs,
    cover: null,
};

let albums;
try {
    albums = JSON.parse(fs.readFileSync("albums.json", "utf8")).albums;
} catch (error) {
    albums = [];
}

albums.push(album);

fs.writeFileSync("albums.json", JSON.stringify({ albums }, null, 2));

console.log("Album for BBSO created and saved to albums.json");
