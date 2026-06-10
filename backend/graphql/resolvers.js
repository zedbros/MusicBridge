const { getDB } = require("../../db/MongoDB");
const { ObjectId } = require("mongodb")


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
    getAllUsers: async () => {
      const db = getDB();
      return db.collection("users").find({}).toArray();
    },

    getUserPlaylists: async (_, { nickname }) => {
      const db = getDB();
      const playlists = await db.collection("playlists")
        .find({ owner_nickname: nickname })
        .toArray();
      return playlists.map(p => ({ ...p, id: p._id.toString() }));
    },
    getPlaylist: async (_, { id }) => {
      const db = getDB();
      const playlist = await db.collection("playlists")
        .findOne({ _id: new ObjectId(id) });
      if (!playlist) throw new Error("Playlist not found.");
      return { ...playlist, id: playlist._id.toString() };
    },
  },
  Mutation: {
    updateProfile: async (_, { bio, genre, profile_picture_id }, context) => {
      requireAuth(context);
      const db = getDB();
      const updates = {};
      if (bio !== undefined) updates.bio = bio;
      if (genre !== undefined) updates.genre = genre;
      if (profile_picture_id !== undefined) updates.profile_picture_id = profile_picture_id;

      await db.collection("users").updateOne(
        { nickname: context.user.nickname },
        { $set: updates }
      );
      return db.collection("users").findOne({ nickname: context.user.nickname });
    },

    createPlaylist: async (_, { name, viewability }, context) => {
      requireAuth(context);
      const db = getDB();
      const result = await db.collection("playlists").insertOne({
        name,
        owner_nickname: context.user.nickname,
        profile_picture_id: null,
        viewability,
        songs: [],
      });
      const playlist = await db.collection("playlists")
        .findOne({ _id: result.insertedId });
      return { ...playlist, id: playlist._id.toString() };
    },

    updatePlaylist: async (_, { id, name, viewability }, context) => {
      requireAuth(context);
      const db = getDB();
      const playlist = await db.collection("playlists")
        .findOne({ _id: new ObjectId(id) });
      if (!playlist) throw new Error("Playlist not found.");
      requireOwner(context, playlist.owner_nickname);

      const updates = {};
      if (name !== undefined) updates.name = name;
      if (viewability !== undefined) updates.viewability = viewability;

      await db.collection("playlists").updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
      );
      const updated = await db.collection("playlists")
        .findOne({ _id: new ObjectId(id) });
      return { ...updated, id: updated._id.toString() };
    },

    deletePlaylist: async (_, { id }, context) => {
      requireAuth(context);
      const db = getDB();
      const playlist = await db.collection("playlists")
        .findOne({ _id: new ObjectId(id) });
      if (!playlist) throw new Error("Playlist not found.");
      requireOwner(context, playlist.owner_nickname);
      await db.collection("playlists").deleteOne({ _id: new ObjectId(id) });
      return true;
    },
  },
};

module.exports = resolvers;
