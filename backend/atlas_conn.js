const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();

app.use(express.json());

const uri = 'mongodb+srv://zb_user:rRwtDVE8JLdXVMKe@musicbridge.qxsq7nw.mongodb.net/?';
const port = 3000
const client = new MongoClient(uri)

let db;

async function connectDB(){
  await client.connect();
  db = client.db("main")
  console.log("Succefully connected to Atlas MongoDB")
}

connectDB().then(() => {
  app.listen(port, () => {
    console.log("Running on port 3000");
  });
  // app.post("/", async (req, res) => {
  //   const user = await db.collection("main").findOne({nickname: "YoMama"});
  //   console.log("yAAAR");
  //   res.json({
  //     success: true,
  //     message: "Balls"
  //   })
  // });
  db.collection("main").insertOne({
    nickname: "Balls",
    pfp_id: 3,
    fav_genre: "balls",
    playlists: 3
  })
}).catch(console.error);
