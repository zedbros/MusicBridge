require("dotenv").config()

const express = require("express");
const { connectDB } = require("../db/MongoDB")

const app = express();
app.use(express.json());

async function startServer(){
  try{
    await connectDB();

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error){
    console.error(error);
    process.exit(1); // clean failure exit
  }
}

startServer();
