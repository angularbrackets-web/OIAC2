// @ts-ignore - Handle CommonJS/ESM compatibility
import pkg from '@apollo/client';
// @ts-ignore
const { gql } = pkg;

import {client}  from './apollo-client'

export type OIAC_PostImage = {
    url:string
}

export type OIAC_Hyperlink = {
  text: string,
  url: string
}

export type OIAC_Post = {
    id:string,
    title:string,
    image:Array<OIAC_PostImage>,
    link:OIAC_Hyperlink,
    content: Array<string>
}

export async function getPosts() {
    const result = await client.query({
        query: gql`
        query MyQuery {
            posts(orderBy: priority_ASC) {
              title
              image {
                url
              }
              link {
                text
                url
              }
              content
            }
          }`
  })
   //console.log('POSTS: ', JSON.stringify(result.data.posts))
  let posts : Array<OIAC_Post> = []

  posts = result.data.posts
  
  return posts
}