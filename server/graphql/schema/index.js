const { buildSchema } = require('graphql')

module.exports = buildSchema(`
  type Notification {
    recipient: String!
    sender: String!
    read: Boolean!
    type: String!
    postId: ID!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    password: String
    posts: [Post!]
    notifications: [Notification!]
    imageUrl: String
    bio: String
    location: String
    status: String
  }

  type EditUserDetails {
    user: User!
  }

  type AuthUser {
    userId: ID!
    token: String!
    tokenExp: Int!
    username: String!
  }

  type Post {
    _id: ID!
    content: String!
    creator: User!
    comments: [Comment!]
    likes: [Like!]
    commentCount: Int
    likeCount: Int
    createdAt: String!
    updatedAt: String!
  }

  type Comment {
    _id: ID!
    content: String
    username: String
    imageUrl: String
    userId: ID
    postId: ID
    createdAt: String
    updatedAt: String
  }

  type Like {
    _id: ID!
    username: String!
    user: ID!
    post: ID!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }
  
  input CommentInput {
    postId: ID!
    content: String!
  }

  input UserDetails {
    bio: String
    location: String
    status: String
  }

  
  type RootQuery {
    userPost:[Post!]
    posts: [Post!]
    comments: [Comment!]
    users: [User!]!
    login(email: String!, password: String!): AuthUser!
  }

  type RootMutation {
    signup(userInput: UserInput): AuthUser!
    editUserDetails(userDetails: UserDetails): User
    createPost(content: String!): Post
    addComment(commentInput: CommentInput): Comment!
    likePost(postId: ID!): Post
    unlikePost(postId: ID!): Post!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)