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
    songs: [Song]
  }

  type Song {
    name: String!
    artist: String!
    album: String!
    duration: Int!
    cover: String
    spotifyId: String
  }

  type SongSearchResult {
    available: Boolean!
    song: Song
  }

  type Query {
    getUser(nickname: String!): User
    me: User
    getAllUsers: [User]

    getPlaylist(id: ID!): Playlist
    getUserPlaylists(nickname: String!): [Playlist]

    searchSong(query: String!): SongSearchResult
  }

  type Mutation {
    updateProfile(bio: String, genre: String, profile_picture_id: String): User

    createPlaylist(name: String!, viewability: String!): Playlist
    updatePlaylist(id: ID!, name: String, viewability: String, profile_picture_id: String): Playlist
    deletePlaylist(id: ID!): Boolean

    addSongToPlaylist(playlistId: ID!, song: SongInput!): Playlist
    removeSongFromPlaylist(playlistId: ID!, spotifyId: String!): Playlist
  }

  input SongInput {
    name: String!
    artist: String!
    album: String!
    duration: Int!
    cover: String
    spotifyId: String!
  }
`;

module.exports = typeDefs;
