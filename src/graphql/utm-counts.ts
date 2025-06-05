// src/graphql/utm-counts.ts
import pkg from '@apollo/client';
const { gql, client } = pkg;


export type DailyUtmCount = {
  date: string;
  source: string;
  visits: number;
  donations: number;
  conversionRate: string;
};

export async function getUtmCounts(): Promise<DailyUtmCount[]> {
    // await client.clearStore();
    const result = await client.query({
    query: gql`
      query GetUtmHits {
        utmHits(orderBy: timestamp_ASC) {
          source
          donateButtonClicked
          timestamp
        }
      }
    `
//     ,
//   fetchPolicy: 'no-cache'
  });

  const rawHits = result.data.utmHits as {
    source: string;
    donateButtonClicked: boolean;
    timestamp: string;
  }[];

  const grouped: Record<string, Record<string, { visits: number; donations: number }>> = {};

  for (const hit of rawHits) {
    const date = new Date(hit.timestamp).toISOString().split('T')[0];
    const source = hit.source.toLowerCase();

    if (!grouped[date]) grouped[date] = {};
    if (!grouped[date][source]) grouped[date][source] = { visits: 0, donations: 0 };

    grouped[date][source].visits++;
    if (hit.donateButtonClicked) grouped[date][source].donations++;
  }

  const results: DailyUtmCount[] = [];

  for (const date in grouped) {
    for (const source in grouped[date]) {
      const { visits, donations } = grouped[date][source];
      results.push({
        date,
        source,
        visits,
        donations,
        conversionRate: `${((donations / visits) * 100).toFixed(1)}%`
      });
    }
  }

  return results;
}
