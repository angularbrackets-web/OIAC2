import { client } from '../../../graphql/apollo-client';
import type { APIRoute } from 'astro';
import pkg from '@apollo/client';
const { gql } = pkg;


const allowedSources = [
  'facebook',
  'instagram',
  'youtube',
  'email',
  'whatsapp',
  'other',
] as const;

type AllowedSource = typeof allowedSources[number];

type TrackPayload = {
  source: string;
  timestamp: string;
  donateButtonClicked?: boolean;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { source, timestamp, donateButtonClicked = false } = body as TrackPayload;

    // ✅ Validate `source` is one of the allowed enum values
    if (!allowedSources.includes(source as AllowedSource)) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Invalid source' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ✅ Use proper variables in GraphQL mutation
    const createMutation = gql`
      mutation CreateUtmHit($source: UtmSourceType!, $timestamp: DateTime!, $donateButtonClicked: Boolean!) {
        createUtmHit(
          data: {
            source: $source,
            timestamp: $timestamp,
            donateButtonClicked: $donateButtonClicked
          }
        ) {
          id
        }
      }
    `;

    const result = await client.mutate({
      mutation: createMutation,
      variables: {
        source,
        timestamp,
        donateButtonClicked,
      },
    });

    const newId = result?.data?.createUtmHit?.id;

    if (newId) {
      const publishMutation = gql`
        mutation PublishUtmHit($id: ID!) {
          publishUtmHit(where: { id: $id }, to: PUBLISHED) {
            id
          }
        }
      `;

      await client.mutate({
        mutation: publishMutation,
        variables: { id: newId },
      });

      return new Response(
        JSON.stringify({ status: 'success', utmId: newId }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ status: 'error', message: 'Create mutation returned no ID' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('UtmHit tracking error:', error);
    return new Response(
      JSON.stringify({ status: 'error', message: 'Failed to track visit' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
