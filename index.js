import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'


//DB
import db from './_db.js'

//Types
import { typeDefs } from './schema.js'

//Resolvers
const resolvers = {
    Query: {
        books() {
            return db.books
        },
        reviews() {
            return db.reviews
        },
        authors() {
            return db.authors
        },
        book(_, args) {
            return db.books.find((book) => book.id === args.id)
        },
        review(_, args) {
            return db.reviews.find((review) => review.id === args.id)
        },
        author(_, args) {
            return db.authors.find((author) => author.id === args.id)
        },
    }
}

/* 
books {
    title
}
*/

//Server Setup
const server = new ApolloServer({
    typeDefs,      //- define the types of data
    resolvers
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
})

console.log('Server is Ready to Go', 4000)