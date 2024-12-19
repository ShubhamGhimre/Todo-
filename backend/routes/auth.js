const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.get("/check", async (req, res) => {
  try {
    const token = req.cookies.todo_auth_token;
    if (!token) {
      return res.json({ isAuthenticated: false });
    }

    const payload = jwt.verify(token, "secret_ecom");
    const User = req.dbConnection.model("User", require("../models/User").schema);
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.json({ isAuthenticated: false });
    }

    res.json({ isAuthenticated: true, user: { userId: user } });
  } catch (error) {
    res.json({ isAuthenticated: false });
  }         
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const User = req.dbConnection.model("User", require("../models/User").schema);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "User registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const User = req.dbConnection.model("User", require("../models/User").schema);
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie(process.env.COOKIE_NAME, token, { httpOnly: true, secure: false });
    res.json({ message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
