import pkg from '@apollo/client'
const { InMemoryCache, ApolloClient } = pkg

export const client = new ApolloClient({
    uri: 'https://us-west-2.cdn.hygraph.com/content/clo0kf2c97pnm01t4g8sva2ni/master',
    cache: new InMemoryCache(),
  })

export default client

