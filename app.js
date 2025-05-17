const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth"); // Import the auth routes
app.use("/api/auth", authRoutes);

const songRoutes = require("./routes/songRoute");
app.use("/api/songRoute", songRoutes);

const searchRoutes = require("./routes/searchRoutes");
app.use("/api/searchRoute", searchRoutes);

const searchSong = require("./routes/searchSong");
app.use("/api/search", searchSong);

const streamsRoutes = require("./routes/streams");
app.use("/api/streams", streamsRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));
