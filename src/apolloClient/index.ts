import { ApolloClient, InMemoryCache } from '@apollo/client';

const baseURL = import.meta.env.VITE_API_URL;

const client = new ApolloClient({
  uri: baseURL,
  cache: new InMemoryCache(),
});

export default client;
