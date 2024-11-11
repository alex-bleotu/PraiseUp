const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const token = process.env.GITHUB_TOKEN;
const username = process.env.GITHUB_USERNAME;

const fetchAllGists = async () => {
    let page = 1;
    const allGists = [];

    while (true) {
        const response = await axios.get(
            `https://api.github.com/users/${username}/gists?page=${page}&per_page=100`,
            {
                headers: { Authorization: `token ${token}` },
                timeout: 60000,
            }
        );
        const gists = response.data;
        if (gists.length === 0) break;
        allGists.push(...gists);
        page += 1;
    }
    return allGists;
};

const fetchGistContent = async (gist) => {
    const files = gist.files;
    let content = "";

    for (const fileName in files) {
        const file = files[fileName];
        try {
            const fileResponse = await axios.get(file.raw_url, {
                headers: { Authorization: `token ${token}` },
                responseType: "text",
                timeout: 60000,
            });
            content += fileResponse.data;
        } catch (error) {
            console.error(
                `Failed to fetch content for file ${fileName} in gist ${gist.id}:`,
                error.message
            );
        }
    }

    try {
        return JSON.parse(content.trim());
    } catch {
        return content.trim();
    }
};

const saveAllGistContents = async () => {
    const allGists = await fetchAllGists();
    const songs = [];

    for (let i = 0; i < allGists.length; i++) {
        try {
            const content = await fetchGistContent(allGists[i]);
            songs.push(content);
            console.log(`Fetched gist ${i + 1}/${allGists.length}`);
        } catch (error) {
            console.error(`Failed to fetch gist ${i + 1}:`, error.message);
        }
    }

    const result = { songs };
    fs.writeFileSync("songs.json", JSON.stringify(result, null, 2));
    console.log("All gists fetched and saved to songs.json");
};

saveAllGistContents();
