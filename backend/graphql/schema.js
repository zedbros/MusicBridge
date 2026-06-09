const { gql } = require("graphql-tag");

const typeDefs = gql`
  type User {
    nickname: String!
    bio: String
    email: String
  }

  type Query {
    getUser(nickname: String!): User
    me: User
    getAllUsers: [User]
  }

  type Mutation {
    updateProfile(bio: String!): User
  }
`;

module.exports = typeDefs;
