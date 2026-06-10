const { gql } = require("graphql-tag");

const typeDefs = gql`
  type User {
    nickname: String!
    bio: String
    email: String!
    genre: String
    profile_picture_id: String
  }

  type Playlist {
    id: ID!
    name: String!
    owner_nickname: String!
    profile_picture_id: String
    viewability: String!
    songs: [String]
  }

  type Query {
    getUser(nickname: String!): User
    me: User
    getAllUsers: [User]

    getPlaylist(id: ID!): Playlist
    getUserPlaylists(nickname: String!): [Playlist]
  }

  type Mutation {
    updateProfile(bio: String, genre: String, profile_picture_id: String): User

    createPlaylist(name: String!, viewability: String!): Playlist
    updatePlaylist(id: ID!, name: String, viewability: String): Playlist
    deletePlaylist(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
