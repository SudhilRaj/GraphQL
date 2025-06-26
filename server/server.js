import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { v4 as uuidv4 } from 'uuid';

// TBD - Database integration for the real data
// TBD - Express instead of plain node.js

// We can create separate files like db.js and schema.js, but now keeping everything here for easy reference.
let users = [
   { id: "1", name: "John Doe", age: 30, isMarried: true },
   { id: "2", name: "Jane Smith", age: 25, isMarried: false },
   { id: "3", name: "Alice Johnson", age: 28, isMarried: false },
];
// Example to show relations
const skills = [
   { id: "1", title: "React", level: "Expert", user_id: "1" },
   { id: "2", title: "Angular", level: "Beginner", user_id: "2" },
   { id: "3", title: "Vue", level: "Intermediate", user_id: "1" },
   { id: "4", title: "Node.js", level: "Expert", user_id: "3" },
   { id: "5", title: "Next.js", level: "Beginner", user_id: "3" },
   { id: "6", title: "AWS", level: "Expert", user_id: "2" },
   { id: "7", title: "Rust", level: "Intermediate", user_id: "2" },
   { id: "7", title: "Go", level: "Expert", user_id: "1" },
]

// Types in GraphQL - ID, Int, Float, String, Boolean
const typeDefs = `#graphql
    type Query {
      users: [User]
      user(id: ID!): User
    }

    type Mutation {
      createUser(name: String!, age: Int!, isMarried: Boolean!): User
      deleteUser(id: ID!): [User]
    }

    type User {
      id: ID
      name: String
      age: Int
      isMarried: Boolean,
      skills: [Skill!] #relation
    }

    type Skill {
      id: ID,
      title: String,
      level: String,
      user_id: String
    }
`;

const resolvers = {
   Query: {
      users: async () => {
         return users;
      },
      user: (parent, args) => {
         const id = args.id;
         return users.find((user) => user.id === id);
      },
   },
   Mutation: {
      createUser: (parent, args) => {
         const { name, age, isMarried } = args;
         const newUser = {
            id: uuidv4(),
            name,
            age,
            isMarried,
         };
         console.log(newUser);
         users.push(newUser);
         return newUser;
      },
      deleteUser: (_, args) => {
         const { id } = args;
         users = users.filter(user => user.id !== id);
         return users;
      }
   },
   User: {
      skills: (parent, args) => {
         return skills.filter(skill => skill.user_id === parent.id)
      }
   },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
   listen: { port: 4000 },
})

console.log(`🚀 Server running at ${url}`)

// Query, Mutation, TypeDefs, Resolvers