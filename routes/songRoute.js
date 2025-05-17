const express = require("express");
const router = express.Router();
const songs = require("../data/songs");

router.get("/songs", (req, res) => {
  res.status(200).json(songs);
});

module.exports = router;
