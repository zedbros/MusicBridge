require("dotenv").config({path:"../.env"});

const express = require("express");
const { connectDB } = require("../db/MongoDB");
const passport = require("./middleware/passport");

const app = express();
const cors = require("cors");
app.use(cors({
  origin: `http://localhost:${process.env.VITE_PORT || 5173}`,
  credentials: true, // needed for cookies
}));
app.use(express.json());
app.use(passport.initialize());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const imageRoutes = require("./routes/images");
app.use("/api/images", imageRoutes);

const cookieParser = require("cookie-parser");
app.use(cookieParser());

async function startServer(){
  try{
    await connectDB();

    const apolloServer = new ApolloServer({ typeDefs, resolvers });
    await apolloServer.start();

    app.use("/graphql", expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        // Passport JWT validates the token and returns the user
        return new Promise((resolve) => {
          const cookieToken = req.cookies?.token;
          if (cookieToken) {
            req.headers.authorization = `Bearer ${cookieToken}`;
          }
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
