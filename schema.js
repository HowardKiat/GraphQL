export const typeDefs = `#graphql
# " ! " means required, fields are non-nullable
    type Book {
        id: ID!
        title: String! 
        platform: [String!]!
        reviews: [Review!]
    }

    type Review {
        id: ID!
        rating: Int!
        content: String!
        book: Book!
        author: Author!
    }
        
    type Author {
        id: ID!
        name: String!
        verified: Boolean!
        reviews: [Review!]
    }

    type Query {
        reviews: [Review]
        review(id: ID!): Review
        books: [Book]
        book(id: ID!): Book
        authors: [Author]
        author(id: ID!): Author
    }

    type Mutation {
        addBook(book: AddBookInput!): Book
        deleteBook(id: ID!): [Book]
        updateBook(id: ID!, edits: EditBookInput!): Book
    }

    input AddBookInput {
        title: String!,
        platform: [String!]!
    }

    input EditBookInput {
        title: String,
        platform: [String!]
    }
`;