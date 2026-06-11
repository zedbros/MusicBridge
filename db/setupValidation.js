require("dotenv").config({ path: "../.env" });
const { connectDB, getDB } = require("./MongoDB");

async function setup() {
  await connectDB();
  const db = getDB();

  // Users collection validation
  await db.command({
    collMod: "users",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["nickname", "email", "password"],
        properties: {
          nickname: { bsonType: "string", maxLength: 20 },
          email: { bsonType: "string" },
          password: { bsonType: "string" },
          bio: { bsonType: "string" },
          genre: { bsonType: "string" },
          profile_picture_id: { bsonType: "string" },
        }
      }
    },
    validationLevel: "moderate",
    validationAction: "error",
  });
  console.log("Users collection validated.");

  // Playlists collection validation
  await db.command({
    collMod: "playlists",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "owner_nickname", "viewability", "songs"],
        properties: {
          name: { bsonType: "string" },
          owner_nickname: { bsonType: "string" },
          viewability: { enum: ["public", "private"] },
          songs: { bsonType: "array" },
          profile_picture_id: { bsonType: "string" },
        }
      }
    },
    validationLevel: "moderate",
    validationAction: "error",
  });
  console.log("Playlists collection validated.");

  process.exit(0);
}

setup().catch(err => { console.error(err); process.exit(1); });
