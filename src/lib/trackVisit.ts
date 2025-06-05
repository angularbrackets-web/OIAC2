import { gql } from '@apollo/client';
import { client } from '../graphql/apollo-client';

const CREATE_UTM_HIT = gql`
  mutation CreateUtmHit($source: UtmSourceType!) {
    createUtmHit(data: {
      source: $source,
      timestamp: "${new Date().toISOString()}"
    }) {
      id
    }
  }
`;

const PUBLISH_UTM_HIT = gql`
  mutation PublishUtmHit($id: ID!) {
    publishUtmHit(where: { id: $id }, to: PUBLISHED) {
      id
    }
  }
`;

export async function trackVisit(source: string): Promise<string | null> {
  try {
    const result = await client.mutate({
      mutation: CREATE_UTM_HIT,
      variables: { source }
    });

    const id = result?.data?.createUtmHit?.id;

    if (id) {
      await client.mutate({
        mutation: PUBLISH_UTM_HIT,
        variables: { id }
      });
      return id;
    }
  } catch (err) {
    console.error('trackVisit error:', err);
  }

  return null;
}
