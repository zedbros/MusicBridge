const { MongoClient } = require("mongodb");

let client;
let db;

async function connectDB(){
    client = new MongoClient(process.env.MONGO_URI)
    await client.connect();
    db = client.db("main")
    console.log("Succefully connected to Atlas MongoDB")
}

function getDB(){
    if (!db) throw new Error("Database not initalized.");
    return db;
}

module.exports = {
    connectDB,
    getDB
};
