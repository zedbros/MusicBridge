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
    res.json({ token, nickname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
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

    res.json({ token, nickname: user.nickname });
  })(req, res); // there was res, next in this parenthesis incase there is an error that occures here.
  // const { nick_email, password } = req.body;

  // if (!nick_email || !password)
  //   return res.status(400).json({ error: "All fields are required." });

  // try {
  //   const db = getDB();
  //   const users = db.collection("users");

  //   const user = await users.findOne({
  //       $or: [
  //           {nickname: nick_email},
  //           {email: nick_email}
  //       ]
  //   });
    
  //   if (!user)
  //     return res.status(401).json({ error: "Invalid nickname or email." });

  //   const match = await bcrypt.compare(password, user.password);
  //   if (!match)
  //     return res.status(401).json({ error: "Invalid password." });

  //   const token = jwt.sign(
  //     { id: user._id, nickname: user.nickname },
  //     process.env.JWT_SECRET,
  //     { expiresIn: "7d" }
  //   );
  //   res.json({ token, nickname: user.nickname });
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json({ error: "Server error." });
  // }
});

router.get("/user/:nickname", async (req, res) => {});

router.post("/user/:nickname/edit", requireAuth, async (req, res) => {
  if (req.user.nickname !== req.params.nickname)
    return res.status(403).json({ error: "Forbidden." });
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
