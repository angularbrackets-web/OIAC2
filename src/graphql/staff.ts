import pkg from '@apollo/client'
import {client} from './apollo-client'
const {gql} = pkg

export interface Staff {
    id: string;
    name: string;
    profilePicture?: {
      url: string;
    } | null;
    staffType: {
      name: string;
    };
    description?: {
      html: string;
    } | null;
  }

  export async function getStaffMembers() {
    const result = await client.query({
        query: gql`
        query StaffMembers {
        staffs(first: 100) {
          id
          name
          profilePicture {
            url
          }
          staffType {
            name
          }
          description {
            html
          }
        }
      }
        `
  })

  let staffMembers : Array<Staff> = []

  staffMembers = result.data.staffs
  
  return staffMembers
}