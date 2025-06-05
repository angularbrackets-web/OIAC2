import { gql } from '@apollo/client';
import { client } from './apollo-client';

export type UtmSourceCount = {
  source: string;
  visits: number;
  donations: number;
  conversionRate: string;
};

export async function getUtmCounts(): Promise<UtmSourceCount[]> {
  const result = await client.query({
    query: gql`
      query GetUtmHits {
        utmHits {
          source
          donateButtonClicked
        }
      }
    `
  });

  const rawHits = result.data.utmHits as { source: string; donateButtonClicked: boolean }[];

  const countMap: Record<string, { visits: number; donations: number }> = {};

  for (const hit of rawHits) {
    const src = hit.source.toLowerCase();
    if (!countMap[src]) {
      countMap[src] = { visits: 0, donations: 0 };
    }
    countMap[src].visits++;
    if (hit.donateButtonClicked) {
      countMap[src].donations++;
    }
  }

  return Object.entries(countMap).map(([source, data]) => ({
    source,
    visits: data.visits,
    donations: data.donations,
    conversionRate: `${((data.donations / data.visits) * 100).toFixed(1)}%`
  }));
}
