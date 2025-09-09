import pkg from '@apollo/client';
const { gql } = pkg;

import { client } from '../graphql/apollo-client';

const UPDATE_UTM_HIT_DONATION = gql`
  mutation UpdateUtmHitDonation($id: ID!) {
    updateUtmHit(
      where: { id: $id },
      data: { donateButtonClicked: true }
    ) {
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

export async function trackDonation(id: string) {
  try {
    const result = await client.mutate({
      mutation: UPDATE_UTM_HIT_DONATION,
      variables: { id }
    });

    if (result?.data?.updateUtmHit?.id) {
      await client.mutate({
        mutation: PUBLISH_UTM_HIT,
        variables: { id }
      });
    }
  } catch (err) {
    console.error('trackDonation error:', err);
  }
}
