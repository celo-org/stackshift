import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/46589/week-7-subgraph/v.0.0.1",
  cache: new InMemoryCache(),
});

export default client;