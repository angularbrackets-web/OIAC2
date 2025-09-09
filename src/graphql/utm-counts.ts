// src/graphql/utm-counts.ts
import { gql } from '@apollo/client';

import {client}  from './apollo-client'


export type DailyUtmCount = {
  date: string;
  source: string;
  visits: number;
  donations: number;
  conversionRate: string;
};

export async function getUtmCounts(): Promise<DailyUtmCount[]> {
    try {
      //console.log('Fetching UTM hits from Hygraph...');
      
      const result = await client.query({
        query: gql`
          query GetUtmHits {
            utmHits(
              orderBy: timestamp_ASC
            ) {
              source
              donateButtonClicked
              timestamp
              id
            }
          }
        `,
        fetchPolicy: 'network-only', // Bypass cache
      });
  
      //console.log('Raw response:', JSON.stringify(result.data, null, 2));
  
      if (!result.data?.utmHits) {
        console.error('No UTM hits found in response');
        return [];
      }
  
      const rawHits = result.data.utmHits as {
        source: string;
        donateButtonClicked: boolean;
        timestamp: string;
        id: string;
      }[];
  
      //console.log(`Processing ${rawHits.length} UTM hits...`);
  
      const grouped: Record<string, Record<string, { visits: number; donations: number }>> = {};
  
      for (const hit of rawHits) {
        if (!hit.timestamp) {
          console.warn(`Skipping hit ${hit.id} - missing timestamp`);
          continue;
        }
  
        const date = new Date(hit.timestamp).toISOString().split('T')[0];
        const source = hit.source?.toLowerCase() || 'unknown';
  
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
            conversionRate: visits > 0 ? `${((donations / visits) * 100).toFixed(1)}%` : '0.0%'
          });
        }
      }
  
      //console.log(`Processed ${results.length} daily UTM counts`);
      return results;
  
    } catch (error) {
      console.error('Error fetching UTM counts:', error);
      throw error;
    }
  }