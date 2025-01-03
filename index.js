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
        }
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
    //resolvers
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
})

console.log('Serve is Ready to Go', 4000)