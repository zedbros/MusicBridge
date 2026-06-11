require("dotenv").config({path:"../../.env"})
const express = require("express");
const { getDB } = require("../../db/MongoDB");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const passport = require("../middleware/passport")

// POST /api/auth/signUp
router.post("/signUp", async (req, res) => {
  const { email, password, nickname } = req.body;

  if (!email || !password || !nickname)
    return res.status(400).json({ error: "All fields are required." });

  try {
    const db = getDB();
    const users = db.collection("users");

    const nickname_exists = await users.findOne({ nickname });
    if (nickname_exists)
      return res.status(409).json({ error: "Nickname already taken." });

    const email_exists = await users.findOne({ email });
    if (email_exists)
      return res.status(409).json({ error: "Email already in use." });

    const hashedPassword = await bcrypt.hash(password, 10); // Hashes password
    await users.insertOne({ email, password: hashedPassword, nickname });

    const user = await users.findOne({nickname: nickname});

    const token = jwt.sign(
      { id: user._id, nickname: nickname },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Account created successfully.");
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // HTTP only if false
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });
    res.json({ nickname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sign up server error." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return res.status(500).json({ error: "Server error." });
    if (!user) return res.status(401).json({ error: info?.message || "Login failed." });

    const token = jwt.sign(
      { id: user._id, nickname: user.nickname },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: false, // HTTP only if false
    //   sameSite: "lax",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    // });
    // res.json({ nickname });
    res.json({ token, nickname: user.nickname });
  })(req, res); // there was res, next in this parenthesis incase there is an error that occures here.
});

router.get("/user/:nickname", async (req, res) => {});

router.post("/user/:nickname/edit", requireAuth, async (req, res) => {
  if (req.user.nickname !== req.params.nickname)
    return res.status(403).json({ error: "Forbidden." });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out." });
});

function requireAuth(req, res, next){
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({erro: "You haven't provided any token"})

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}

module.exports = router;
