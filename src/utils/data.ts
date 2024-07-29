import { AlbumType, SongType } from "../context/data";

export const songs: SongType[] = [
    {
        id: "S1",
        title: "Song 1",
        artist: "Artist Name",
        cover: null,
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
        id: "S2",
        title: "Song 2",
        artist: "Artist Name",
        cover: null,
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
        id: "S3",
        title: "Song 3",
        artist: "Artist Name",
        cover: null,
        lyrics: "",
    },
    {
        id: "S4",
        title: "Song 4",
        artist: "Artist Name",
        cover: null,
        lyrics: "",
    },
    {
        id: "S5",
        title: "Song 5",
        artist: "Artist Name",
        cover: null,
        lyrics: "",
    },
    {
        id: "S6",
        title: "Song 6",
        artist: "Artist Name",
        cover: null,
        lyrics: "",
    },
    {
        id: "S7",
        title: "Song 7",
        artist: "Artist Name",
        cover: null,
        lyrics: "",
    },
    {
        id: "S8",
        title: "Song 8",
        artist: "Artist Name",
        cover: null,
        lyrics: "",
    },
    {
        id: "S9",
        title: "Song 9",
        artist: "Artist Name",
        cover: null,
        lyrics: "",
    },
    {
        id: "S10",
        title: "Song 10",
        artist: "Artist Name",
        cover: null,
        lyrics: "",
    },
];

export const albums: AlbumType[] = [
    {
        id: "A1",
        title: "Album 1",
        songs: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
    {
        id: "A2",
        title: "Album 2",
        songs: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
    {
        id: "A3",
        title: "Album 3",
        songs: ["1"],
    },
    {
        id: "A4",
        title: "Album 4",
        songs: ["1"],
    },
    {
        id: "A5",
        title: "Album 5",
        songs: ["1"],
    },
    {
        id: "A6",
        title: "Album 6",
        songs: ["1"],
    },
    {
        id: "A7",
        title: "Album 7",
        songs: ["1"],
    },
    {
        id: "A8",
        title: "Album 8",
        songs: ["1"],
    },
    {
        id: "A9",
        title: "Album 9",
        songs: ["1"],
    },
    {
        id: "A10",
        title: "Album 10",
        songs: ["1"],
    },
];

export const getById = (id: string) => {
    if (id.includes("S")) return songs.find((song) => song.id === id);
    else return albums.find((album) => album.id === id);
};

export const filterSongs = (searchQuery: string) => {
    return songs.filter((song: any) => {
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

        if (!randomSongs.includes(song.id) || (song as SongType))
            randomSongs.push(song.id);
    }

    return randomSongs;
};
