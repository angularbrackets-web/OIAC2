import { client } from '../../../graphql/apollo-client';
import type { APIRoute } from 'astro';
// @ts-ignore - Handle CommonJS/ESM compatibility
import pkg from '@apollo/client';
// @ts-ignore
const { gql } = pkg;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const source = url.searchParams.get('source') || 'gtag_report_conversion';
    const timestamp = url.searchParams.get('ts') || new Date().toISOString();
    const donateButtonClicked = url.searchParams.get('donate') === '1' ? true : true;

    const allowedSources = ['facebook','instagram','youtube','email','whatsapp','other'];
    const src = allowedSources.includes((source || '').toLowerCase()) ? source : 'other';

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
        source: src,
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

      await client.mutate({ mutation: publishMutation, variables: { id: newId } });

      return new Response(JSON.stringify({ status: 'success', utmId: newId }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ status: 'error', message: 'no id' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('ping endpoint error', err);
    return new Response(JSON.stringify({ status: 'error', message: 'server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
