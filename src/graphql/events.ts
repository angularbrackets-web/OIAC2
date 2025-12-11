// @ts-ignore - Handle CommonJS/ESM compatibility
import pkg from '@apollo/client';
// @ts-ignore
const { gql } = pkg;

import {client}  from './apollo-client'
// MarkdownContent removed in Astro 5, using string instead
import type { HTMLString } from 'astro/runtime/server/escape.js'

export type OIAC_EventSchedule = {
  date:string,
  time:string
}

export type OIAC_Event = {
    id:string,
    title:string,
    description:{
      html:HTMLString,
      markdown:string
    },
    schedules:Array<OIAC_EventSchedule>,
    month:Array<number>,
}

export async function getEventsForMonths(months: Array<number>) {
    const result = await client.query({
        query: gql`
        query MyQuery($month:[Int!]!) {
            events(where: {month_contains_all: $month}, orderBy: priority_ASC) {
              title
              month
              day
              description {
                html
                markdown
              }
              schedules {
                date
                time
              }
            }
          }`, variables:{month: months}
  })

  let events : Array<OIAC_Event> = []

  events = result.data.events
  
  return events
}