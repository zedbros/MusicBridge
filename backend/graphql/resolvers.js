const { getDB } = require("../../db/MongoDB");


function requireAuth(context) {
  if (!context.user) throw new Error("Not authenticated in require auth.");
}

function requireOwner(context, nickname) {
  requireAuth(context);
  if (context.user.nickname !== nickname)
    throw new Error("Forbidden.");
}


const resolvers = {
  Query: {
    getUser: async (_, { nickname }) => {
      const db = getDB();
      return db.collection("users").findOne({ nickname });
    },
    me: async (_, __, context) => {
      if (!context.user) throw new Error("Not authenticated in resolver.");
      const db = getDB();
      return db.collection("users").findOne({ nickname: context.user.nickname });
    },
  },
  Mutation: {
    updateProfile: async (_, { bio }, context) => {
      requireOwner(context, context.user?.nickname); // use context.user.nickname directly
      const db = getDB();
      await db.collection("users").updateOne(
        { nickname: context.user.nickname },
        { $set: { bio } }
      );
      return db.collection("users").findOne({ nickname: context.user.nickname });
    }
  },
};

module.exports = resolvers;
