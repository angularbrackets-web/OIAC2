import { gql } from '@apollo/client';
import { client } from '../graphql/apollo-client';

export async function trackVisit(source: string, donateButtonClicked = false) {
  const cleanedSource = (source || 'direct').toLowerCase();

  const CREATE_UTM_HIT = gql`
    mutation CreateUtmHit($source: UtmSourceType!, $donateButtonClicked: Boolean!, $timestamp: DateTime!) {
      createUtmHit(data: {
        source: $source,
        donateButtonClicked: $donateButtonClicked,
        timestamp: $timestamp
      }) {
        id
      }
    }
  `;

  try {
    const timestamp = new Date().toISOString();

    const result = await client.mutate({
      mutation: CREATE_UTM_HIT,
      variables: {
        source: cleanedSource,
        donateButtonClicked,
        timestamp
      }
    });

    const createdId = result?.data?.createUtmHit?.id;

    if (createdId) {
      await client.mutate({
        mutation: gql`
          mutation PublishUtmHit($id: ID!) {
            publishUtmHit(where: { id: $id }, to: PUBLISHED) {
              id
            }
          }
        `,
        variables: {
          id: createdId
        }
      });
    }
  } catch (err) {
    console.error('trackVisit error:', err);
  }
}
