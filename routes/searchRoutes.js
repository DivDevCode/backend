const express = require("express");
const router = express.Router();
const songs = require("../data/songs");

router.get("/search", async (req, res) => {
  const query = req.query.s;
  if (!query) return res.json([]);

  const regex = new RegExp(`^${query}`, "i"); // starts with, case-insensitive

  const filtered = songs.filter(
    (song) => regex.test(song.title) || regex.test(song.artist)
  );

  res.json(filtered);
});

module.exports = router;