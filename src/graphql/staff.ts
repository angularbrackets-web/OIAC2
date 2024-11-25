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
  
export async function getStaffMembers(staffType?: string): Promise<any> {
    const query = staffType
      ? gql`
          query StaffMembers($staffType: String) {
            staffs(
              first: 100
              where: { staffType: { name: $staffType } }
            ) {
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
      : gql`
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
        `;
  
    const variables = staffType ? { staffType } : {};
  
    try {
      const result = await client.query({
        query,
        variables,
      });
  
                let staffMembers : Array<Staff> = [];

  staffMembers = result.data.staffs;
  
  return staffMembers;
    } catch (error) {
      console.error("Error fetching staff members:", error);
      throw new Error("Failed to fetch staff members");
    }
  }
  