const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../../db/MongoDB");
const multer = require("multer");

const router = express.Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("images").insertOne({
      data: req.file.buffer.toString("base64"),
      mimetype: req.file.mimetype,
    });
    res.json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Image upload failed." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const image = await db.collection("images")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!image) return res.status(404).json({ error: "Image not found." });
    const buffer = Buffer.from(image.data, "base64");
    res.set("Content-Type", image.mimetype);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch image." });
  }
});

module.exports = router;