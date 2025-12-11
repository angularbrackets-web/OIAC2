import { getCollection } from 'astro:content';

export type OIAC_PostImage = {
  url: string;
};

export type OIAC_Hyperlink = {
  text: string;
  url: string;
};

export type OIAC_Post = {
  id: string;
  title: string;
  image: Array<OIAC_PostImage>;
  link: OIAC_Hyperlink;
  content: Array<string>;
};

export async function getPosts(): Promise<OIAC_Post[]> {
  const posts = await getCollection('posts');

  // Sort by priority if available
  const sortedPosts = posts.sort((a, b) => {
    const priorityA = a.data.priority ?? 999;
    const priorityB = b.data.priority ?? 999;
    return priorityA - priorityB;
  });

  return sortedPosts.map(post => ({
    id: post.id,
    title: post.data.title,
    image: post.data.image,
    link: post.data.link,
    content: post.data.content ?? [],
  }));
}
