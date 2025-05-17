const express = require("express");
const Fuse = require("fuse.js");
const songs = require("../data/songs");
const router = express.Router();

router.post("/searchSong", async (req, res) => {
  const { title, artist } = req.body;

  try {
    // First try exact match
    const exactMatch = songs.find(
      (song) =>
        song.title.toLowerCase().trim() === title.toLowerCase().trim() &&
        song.artist.toLowerCase().trim() === artist.toLowerCase().trim()
    );

    if (exactMatch) {
      return res.status(200).json({ song: exactMatch });
    }

    // If no exact match, use fuzzy search
    const fuse = new Fuse(songs, {
      keys: ["title", "artist"],
      threshold: 0.3, // lower means stricter match
    });

    const result = fuse.search(`${title} ${artist}`);

    if (result.length > 0) {
      return res.status(200).json({ song: result[0].item });
    }

    res.status(404).json({ message: "Song not found" });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
