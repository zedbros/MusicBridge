require("dotenv").config({path:"../.env"});

const express = require("express");
const { connectDB } = require("../db/MongoDB");
const passport = require("./middleware/passport");

const app = express();
app.use(express.json());
app.use(passport.initialize());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

// TODO CHANGE THIS TO IMAGES.JS
const multer = require("multer");
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // limits to 5MB images

app.post("/api/images/upload", upload.single("image"), async (req, res) => {
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

app.get("/api/images/:id", async (req, res) => {
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



async function startServer(){
  try{
    await connectDB();

    const apolloServer = new ApolloServer({ typeDefs, resolvers });
    await apolloServer.start();

    app.use("/graphql", expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        // Passport JWT validates the token and returns the user
        return new Promise((resolve) => {
          passport.authenticate("jwt", { session: false }, (err, user) => {
            if (err || !user) return resolve({ user: null });
            resolve({ user });
          })(req);
        });
      }
    }));


    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error){
    console.error(error);
    process.exit(1); // clean failure exit
  }
}

startServer();
