// An old setup for creating a graphql server with express and express-graphql. Without Apollo
// Keeping just for reference
const express = require('express');
// Note that express-graphql is a bit older; in newer projects, you might 
// consider using Apollo Server, which offers a more modern setup 
// and better features like subscriptions.
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } = require("graphql");
const app = express();

const authors = [
   { id: 1, name: 'J. K. Rowling' },
   { id: 2, name: 'J. R. R. Tolkien' },
   { id: 3, name: 'Brent Weeks' }
]

const books = [
   { id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
   { id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
   { id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
   { id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
   { id: 5, name: 'The Two Towers', authorId: 2 },
   { id: 6, name: 'The Return of the King', authorId: 2 },
   { id: 7, name: 'The Way of Shadows', authorId: 3 },
   { id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

// Queries
// ========
// const schema = new GraphQLSchema({
//    query: new GraphQLObjectType({
//       name: "helloWorld",
//       fields: () => ({
//          message: {
//             type: GraphQLString,
//             resolve: (parent, args) => 'Hello world',
//          }
//       })
//    })
// })

const AuthorType = new GraphQLObjectType({
   name: 'Author',
   description: 'This is the author of the book',
   fields: () => ({
      id: { type: GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLNonNull(GraphQLString) },
      books: {
         type: new GraphQLList(BookType),
         resolve: (author) => {
            return books.filter(book => book.authorId === author.id)
         }
      }
   })
})

const BookType = new GraphQLObjectType({
   name: 'Book',
   description: 'This is the description for the book',
   fields: () => ({
      id: { type: GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLNonNull(GraphQLString) },
      authorId: { type: GraphQLNonNull(GraphQLInt) },
      author: {
         type: AuthorType,
         resolve: (book) => {
            return authors.find(author => author.id === book.authorId)
         }
      }
   })
})

const RootQueryType = new GraphQLObjectType({
   name: "Query",
   description: "Root Query",
   fields: () => ({
      book: {
         type: BookType,
         description: "A single book",
         args: {
            id: { type: GraphQLInt }
         },
         resolve: (parent, args) => books.find(book => book.id === args.id)
      },
      books: {
         type: new GraphQLList(BookType),
         description: "List of all books",
         resolve: () => books  //This will be the DB query
      },
      author: {
         type: AuthorType,
         description: "An single author",
         args: {
            id: { type: GraphQLInt }
         },
         resolve: (parent, args) => authors.find(author => author.id === args.id)  //This will be the DB query
      },
      authors: {
         type: new GraphQLList(AuthorType),
         description: "List of all authors",
         resolve: () => authors  //This will be the DB query
      }
   })
})


// Mutations (Updates/Modifications)
// =================================
const RootMutationType = new GraphQLObjectType({
   name: "Mutation",
   description: "Root Mutation",
   fields: () => ({
      addBook: {
         type: BookType,
         description: "Add a book",
         args: {
            name: { type: GraphQLNonNull(GraphQLString) },
            authorId: { type: GraphQLNonNull(GraphQLInt) }
         },
         resolve: (parent, args) => {
            const book = {
               id: books.length + 1,
               name: args.name,
               authorId: args.authorId
            }
            books.push(book)
            return book;
         }
      },
      addAuthor: {
         type: AuthorType,
         description: "Add a author",
         args: {
            name: { type: GraphQLNonNull(GraphQLString) }
         },
         resolve: (parent, args) => {
            const author = {
               id: authors.length + 1,
               name: args.name
            }
            authors.push(author)
            return author;
         }
      }
   })
})


// Schema
// =======
const schema = new GraphQLSchema({
   query: RootQueryType,
   mutation: RootMutationType
})

// route
app.use('/graphql', graphqlHTTP({
   schema: schema,
   graphiql: true
}))

app.listen(5000, () => {
   console.log("Server is running at 5000.");
})