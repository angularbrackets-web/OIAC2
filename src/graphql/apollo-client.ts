import { InMemoryCache } from "@apollo/client"
import { ApolloClient } from "@apollo/client/core/ApolloClient"


const client = new ApolloClient({
    uri: 'https://api-us-west-2.hygraph.com/v2/clo0kf2c97pnm01t4g8sva2ni/master',
    cache: new InMemoryCache(),
  })

export default client

