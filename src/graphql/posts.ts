import pkg from '@apollo/client'
const { gql } = pkg
import client  from './apollo-client'

export type OIAC_PostImage = {
    url:string
}

export type OIAC_Post = {
    id:string,
    title:string,
    description:string,
    image:Array<OIAC_PostImage>
}

export async function getPosts() {
    const result = await client.query({
        query: gql`
        query MyQuery {
            posts {
              title
              description
              image {
                url
              }
            }
          }`
  })
//   console.log('POSTS: ', JSON.stringify(result.data.posts))
  let posts : Array<OIAC_Post> = []

  posts = result.data.posts
  
  return posts
}