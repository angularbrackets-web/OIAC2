import { gql } from '@apollo/client'
import {client} from './apollo-client'

export interface Staff {
    id: string;
    name: string;
    title: string;
    displayOrder: number;
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
              title
              displayOrder
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
              title
              displayOrder
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
  