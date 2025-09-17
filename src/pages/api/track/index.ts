import { client } from '../../../graphql/apollo-client';
import type { APIRoute } from 'astro';
// @ts-ignore - Handle CommonJS/ESM compatibility
import pkg from '@apollo/client';
// @ts-ignore
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

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const source = url.searchParams.get('source') || 'other';
    const timestamp = url.searchParams.get('ts') || new Date().toISOString();
    const donateButtonClicked = true; // GET requests from image pings are always for donations

    // Map invalid sources to 'other' instead of failing
    const validSource = allowedSources.includes((source || '').toLowerCase() as AllowedSource) ? (source || '').toLowerCase() : 'other';

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

    console.log('Creating UTM hit (GET) with source:', validSource, 'timestamp:', timestamp, 'donateButtonClicked:', donateButtonClicked);

    const result = await client.mutate({
      mutation: createMutation,
      variables: {
        source: validSource,
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
    console.error('UtmHit tracking error (GET):', error);
    return new Response(
      JSON.stringify({ status: 'error', message: 'Failed to track visit' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { source, timestamp, donateButtonClicked = false } = body as TrackPayload;

    // Map invalid sources to 'other' instead of failing
    const validSource = allowedSources.includes((source || '').toLowerCase() as AllowedSource) ? (source || '').toLowerCase() : 'other';

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

    console.log('Creating UTM hit with source:', validSource, 'timestamp:', timestamp, 'donateButtonClicked:', donateButtonClicked);

    const result = await client.mutate({
      mutation: createMutation,
      variables: {
        source: validSource,
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
