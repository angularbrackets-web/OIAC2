import { gql } from '@apollo/client'
import {client} from './apollo-client'

export interface Job {
    id: string;
    title: string;
    postedDate: Date;
    description?: {
      html: string;
    } | null;
  }
  
export async function getJobs() {
    const result = await client.query({
        query: gql`
        query Jobs {
  jobs(where: {active: true}) {
    id
    title
    postedDate
    description {
      html
    }
  }
}
        `
  })
  let jobs : Array<Job> = [];

  jobs = result.data.jobs;
  
  return jobs;
  }
  
  export async function getJob(id: string) {
    const result = await client.query({
        query: gql`
        query Job($id: ID!) {
            job(where: {id: $id}) {
                title
                postedDate
                description {
                    html
                }
            }
        }
        `,
        variables: {
            id, // Pass the id to the query
        },
    });

    // If you want to handle the case where no job is found
    if (!result.data.job) {
        throw new Error(`Job with id ${id} not found.`);
    }
    
    return result.data.job;
}


//   export async function getJob(id?: string) {
//     const query = gql`
//         query Job {
//   job(where: {id: { name: $id }}) {
//     title
//     postedDate
//     description {
//       html
//     }
//   }
// }
//         `;
//   let job : Job;
//   const result = await client.query({
//     query,
//     id,
//   });
//   job = result.data.job;
//   console.log('###JOB : ', JSON.stringify(job));
//   return job;
//   }
  