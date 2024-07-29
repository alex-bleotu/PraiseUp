export interface Data {
    id: string;
    name: string;
    type: "song" | "album";
    artist?: string;
    lyrics?: string;
    songs?: string[];
}

export const songs: Data[] = [
    {
        id: "1",
        type: "song",
        name: "Song 1",
        artist: "Artist Name",
        lyrics: `[Am]I took a step into the [G]night,  
With [C]dreams that glimmered in the [F]light,  
A [Am]path unknown, a heart so [G]bold,  
Seeking [C]stories yet un[F]told.

Oh, my [C]journey, my [G]tale to [Am]weave,  
Through the [F]darkness, I be[C]lieve,  
With every [G]step, a new [Am]sunrise,  
In this [F]world of endless [C]skies.

[Am]Mountains high and [G]valleys low,  
In the [C]rain and in the [F]snow,  
Every [Am]challenge, every [G]fear,  
Makes the [C]purpose crystal [F]clear.

Oh, my [C]journey, my [G]tale to [Am]weave,  
Through the [F]darkness, I be[C]lieve,  
With every [G]step, a new [Am]sunrise,  
In this [F]world of endless [C]skies.

And if I [Am]fall, I'll rise a[G]gain,  
For every [C]loss, a chance to [F]gain,  
With [Am]courage as my [G]guiding star,  
I'll [C]travel near, I'll travel [F]far.

Oh, my [C]journey, my [G]tale to [Am]weave,  
Through the [F]darkness, I be[C]lieve,  
With every [G]step, a new [Am]sunrise,  
In this [F]world of endless [C]skies.
So here's to [Am]paths that lie a[G]head,  
To every [C]word we've yet to [F]be said,  
With [Am]hope and love, and [G]dreams so wide,  
We'll [C]find our place, and there a[F]bide.`,
    },
    {
        id: "2",
        type: "song",
        name: "Song 2",
        artist: "Artist Name",
        lyrics: `I took a step into the night,  
With dreams that glimmered in the light,  
A path unknown, a heart so bold,  
Seeking stories yet untold.

Oh, my journey, my tale to weave,  
Through the darkness, I believe,  
With every step, a new sunrise,  
In this world of endless skies.

Mountains high and valleys low,  
In the rain and in the snow,  
Every challenge, every fear,  
Makes the purpose crystal clear.

Oh, my journey, my tale to weave,  
Through the darkness, I believe,  
With every step, a new sunrise,  
In this world of endless skies.

And if I fall, I'll rise again,  
For every loss, a chance to gain,  
With courage as my guiding star,  
I'll travel near, I'll travel far.

Oh, my journey, my tale to weave,  
Through the darkness, I believe,  
With every step, a new sunrise,  
In this world of endless skies.
So here's to paths that lie ahead,  
To every word we've yet to be said,  
With hope and love, and dreams so wide,  
We'll find our place, and there abide.
`,
    },
    {
        id: "3",
        type: "song",
        name: "Song 3",
        artist: "Artist Name",
    },
    {
        id: "4",
        type: "song",
        name: "Song 4",
        artist: "Artist Name",
    },
    {
        id: "5",
        type: "song",
        name: "Song 5",
        artist: "Artist Name",
    },
    {
        id: "6",
        type: "song",
        name: "Song 6",
        artist: "Artist Name",
    },
    {
        id: "7",
        type: "song",
        name: "Song 7",
        artist: "Artist Name",
    },
    {
        id: "8",
        type: "song",
        name: "Song 8",
        artist: "Artist Name",
    },
    {
        id: "9",
        type: "song",
        name: "Song 9",
        artist: "Artist Name",
    },
    {
        id: "10",
        type: "song",
        name: "Song 10",
        artist: "Artist Name",
    },
    {
        id: "11",
        type: "album",
        name: "Album 1",
        songs: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
    {
        id: "12",
        type: "album",
        name: "Album 2",
        songs: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
    {
        id: "13",
        type: "album",
        name: "Album 3",
        songs: ["1"],
    },
    {
        id: "14",
        type: "album",
        name: "Album 4",
        songs: ["1"],
    },
    {
        id: "15",
        type: "album",
        name: "Album 5",
        songs: ["1"],
    },
    {
        id: "16",
        type: "album",
        name: "Album 6",
        songs: ["1"],
    },
    {
        id: "17",
        type: "album",
        name: "Album 7",
        songs: ["1"],
    },
    {
        id: "18",
        type: "album",
        name: "Album 8",
        songs: ["1"],
    },
    {
        id: "19",
        type: "album",
        name: "Album 9",
        songs: ["1"],
    },
    {
        id: "20",
        type: "album",
        name: "Album 10",
        songs: ["1"],
    },
];

export const getSongById = (id: string) => {
    return songs.find((song) => song.id === id);
};

export const filterSongs = (searchQuery: string) => {
    return songs.filter((song: Data) => {
        const query = searchQuery.toLowerCase();

        const stripChords = (lyrics: string) => {
            return lyrics.replace(/\[[^\]]+\]/g, "").toLowerCase();
        };

        const songNameMatches = song.name.toLowerCase().includes(query);
        const artistMatches = song.artist
            ? song.artist.toLowerCase().includes(query)
            : false;
        const lyricsMatches = song.lyrics
            ? stripChords(song.lyrics).includes(query)
            : false;

        return songNameMatches || artistMatches || lyricsMatches;
    });
};

export const getRandomSongs = (number: number) => {
    const randomSongs: string[] = [];

    while (randomSongs.length < number) {
        const song = songs[Math.floor(Math.random() * songs.length)];

        if (!randomSongs.includes(song.id) || song.type === "song")
            randomSongs.push(song.id);
    }

    return randomSongs;
};
