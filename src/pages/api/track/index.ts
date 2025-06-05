import { client } from '../../../graphql/apollo-client';
import type { APIRoute } from 'astro';
import { gql } from '@apollo/client';

const allowedSources = ['facebook', 'instagram', 'youtube', 'email', 'whatsapp', 'other'] as const;
type AllowedSource = typeof allowedSources[number];

type TrackPayload = {
  source: AllowedSource;
  timestamp: string;
  donateButtonClicked?: boolean;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { source, timestamp, donateButtonClicked = false } = body as TrackPayload;

    // Validate source
    if (!allowedSources.includes(source)) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Invalid source' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const createMutation = gql`
      mutation CreateUtmHit {
        createUtmHit(
          data: {
            source: ${JSON.stringify(source)}
            timestamp: ${JSON.stringify(timestamp)}
            donateButtonClicked: ${donateButtonClicked}
          }
        ) {
          id
        }
      }
    `;

    const result = await client.mutate({ mutation: createMutation });
    const newId = result?.data?.createUtmHit?.id;

    if (newId) {
      const publishMutation = gql`
        mutation PublishUtmHit {
          publishUtmHit(where: { id: "${newId}" }, to: PUBLISHED) {
            id
          }
        }
      `;
      await client.mutate({ mutation: publishMutation });
    }

    return new Response(JSON.stringify({ status: 'success' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('UtmHit tracking error:', error);
    return new Response(JSON.stringify({ status: 'error', message: 'Failed to track visit' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
