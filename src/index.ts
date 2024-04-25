import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";

import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

import { makeExecutableSchema } from "@graphql-tools/schema";
import * as dotenv from 'dotenv';

interface MyContext {
  token?: String;
}

async function main() {
  dotenv.config();
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,

  }

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}

main().catch((err) => console.log(err));

// ------ SERVER SETUP ------
// npm init -y
// npm i @apollo/server express graphql cors
// npm i --save-dev typescript
// npm i ts-node
// npm i graphql graphql-tag
// npm i lodash.merge
// npm i @graphql-tools/schema
// npm i --save-dev nodemon  
// npm i dotenv