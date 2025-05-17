// routes/streams.js
const express = require("express");
const mongoose = require("mongoose");
const { Types } = mongoose;
const router = express.Router();

const db = mongoose.connection;
const ObjectId = Types.ObjectId;

// GET /api/streams/getStreams/:songId
router.get("/getStreams/:songId", async (req, res) => {
  const songId = parseInt(req.params.songId, 10); // convert to number
  if (isNaN(songId)) {
    return res.status(400).json({ error: "Invalid songId" });
  }

  try {
    const song = await db.collection("songs").findOne({ _id: songId });
    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }
    res.json({ streamCount: song.streamCount || 0 });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/streams/saveStreams
router.post("/saveStreams", async (req, res) => {
  const { songId, title, artist } = req.body;

  if (!songId || !title || !artist) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await db.collection("SkidoStreams").insertOne({
      songId,
      title,
      artist,
      timestamp: new Date(),
    });

    await db.collection("songs").updateOne(
      { _id: songId },
      {
        $inc: { streamCount: 1 },
        $setOnInsert: { title, artist, timestamp: new Date() },
      },
      { upsert: true }
    );
    //   { $inc: { streamCount: 1 } }
    // );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error saving stream:", err);
    res.status(500).json({ error: "Failed to save stream" });
  }
});

module.exports = router;
