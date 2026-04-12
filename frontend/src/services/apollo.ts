import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'https://taski-665e.onrender.com/graphql', //  NestJS GraphQL endpoint
  credentials: 'same-origin',           // optional, depends on auth
});

export const client = new ApolloClient({
  link: ApolloLink.from([httpLink]),
  cache: new InMemoryCache(),
});
