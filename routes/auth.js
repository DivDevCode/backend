const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
require("dotenv").config();

// SIGNUP
router.post("/signup", async (req, res) => {
  const { firstName, middleName, lastName, username, email, password } =
    req.body;
 
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      middleName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    console.log("recieved data", username, email, firstName);

    await newUser.save();
    console.log("recieved data saving user");

    res.status(201).json({ message: "Signup successful", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
 
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
