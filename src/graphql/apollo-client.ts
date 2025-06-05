import pkg from '@apollo/client';

const {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql,
} = pkg;


export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://us-west-2.cdn.hygraph.com/content/clo0kf2c97pnm01t4g8sva2ni/master',
    fetch // 👈 make sure to inject Node's global fetch    
  }),
  cache: new InMemoryCache(),
});

export default client;
