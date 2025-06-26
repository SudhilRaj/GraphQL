# React GraphQL - Apollo Client + Apollo Server

## What is GraphQL?
- GraphQL is a query language for APIs, developed by Meta.
- It allows clients to request exactly the data they need, using a strongly typed schema.
- It acts as a layer between the client and backend services, helping aggregate and simplify data fetching.
- Enables flexible and efficient data querying, especially for frontend applications.
- Supports not only queries (read) but also mutations (write/modify) and subscriptions (real-time updates).
- A graph is a representation of objects and their relations. 
- REST is more of an architectural style; GraphQL is a query language to interact with the API which have its own rules.
- Under the hood GraphQL also using the standard HTTP.

### Key Benefits
- Clients can fetch only the required fields, reducing over-fetching and under-fetching.
- Multiple resource requests can be combined into a single query.
- Well-suited for complex and nested data structures.

### GraphQL Query Example
```graphql
// Query to fetch all pets
query getAllPets {
  pets {
    name
    petType
  }
}
```
### GraphQL Mutation Example
```graphql
// Mutation to add a new pet
mutation AddNewPet($name: String!, $petType: petType) {
  addPet(name: $name, petType: $petType) {
    id
    name
    petType
  }
}
```
- Note: Make sure variable names and types (e.g., petType) match your schema exactly.

### GraphQL Schema Basics
- The schema defines the types of data and how they are related.
- It is used to validate requests and generate responses.

```graphql
type User {
  id: ID!
  name: String!
}

type Post {
  id: ID!
  title: String!
  author: User!
}
```

### Subscriptions (Real-Time)
- Subscriptions allow clients to receive real-time updates when data changes.
- Useful for real-time applications like chats, notifications, etc.
- Typically implemented using WebSockets.


### GraphQL vs REST
- Data Fetching -> 	Fixed structure per endpoint | Client defines data shape via query
- Tooling Required ->	Minimal |	Requires client/server setup
- Caching ->	Easy with HTTP tools |	More complex (Apollo will helps)
- Best For ->	Simple CRUD APIs | Complex, nested, dynamic data needs

⚠️ For simple APIs, GraphQL may introduce unnecessary complexity due to heavier setup.


## This Project Setup
This project demonstrates how to create a full-stack application using **React**, **Apollo Client**, **Apollo Server**, and **GraphQL**. The project includes a simple **CRUD (Create, Read, Update, Delete)** example where we can:

1. View a list of users.
2. View a single user by ID.
3. Create a new user.

## Features
- **React** for building the frontend.
- **Apollo Client** for interacting with the GraphQL API.
- **Apollo Server** for building the backend with GraphQL.
- Simple **User** model with fields `id`, `name`, `age`, and `isMarried`.


## Installation
Follow these steps to set up the project on your local machine.

### 1. Clone this repository

```bash
git clone https://github.com/SudhilRaj/GraphQL
cd GraphQL
```

### 2. Backend Setup

1. Go to the backend directory:

```bash
cd server
```

2. Install the required dependencies:

```bash
npm install
```

3. Start the server:

```bash
node server.js
```

This will run the Apollo Server on `http://localhost:4000`.

### 3. Frontend Setup

1. Go to the frontend directory:

```bash
cd client
```

2. Install the required dependencies:

```bash
npm install
```

3. Start the React development server:

```bash
npm run dev
```

This will run the React app on `http://localhost:5173`


## Tech Stack

- **Frontend**: React, Apollo Client, Vite
- **Backend**: Node.js, Apollo Server, GraphQL
- **Database**: In-memory (No database used here)
  
  (NOTE - We can use a real DB, Express, Typescript, etc as updates to this app)

  https://www.apollographql.com/docs/react
  
  https://www.apollographql.com/docs/apollo-server/getting-started
