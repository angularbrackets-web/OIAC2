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

//   export async function getStaffMembers() {
//     const result = await client.query({
//         query: gql`
//         query StaffMembers {
//         staffs(first: 100) {
//           id
//           name
//           profilePicture {
//             url
//           }
//           staffType {
//             name
//           }
//           description {
//             html
//           }
//         }
//       }
//         `
//   })

// export async function getStaffMembers(staffType?: string): Promise<any> {
//     const result = await client.query({
//       query: gql`
//         query StaffMembers($staffType: String) {
//           staffs(first: 100, where: { staffType: { name: $staffType } }) {
//             id
//             name
//             profilePicture {
//               url
//             }
//             staffType {
//               name
//             }
//             description {
//               html
//             }
//           }
//         }
//       `,
//       variables: staffType ? { staffType } : {}, // Only include staffType if provided
//     });
  
//     // const result = await client.query({
//     //   query,
//     //   variables,
//     // });
  
//     // return result;
//   //}
  

//   let staffMembers : Array<Staff> = []

//   staffMembers = result.data.staffs
  
//   return staffMembers
// }

// export async function getStaffMembers(staffType?: string): Promise<any> {
//     const query = gql`
//       query StaffMembers($staffType: String) {
//         staffs(
//           first: 100
//           where: { staffType: { name: $staffType } }
//         ) {
//           id
//           name
//           profilePicture {
//             url
//           }
//           staffType {
//             name
//           }
//           description {
//             html
//           }
//         }
//       }
//     `;
  
//     const variables = staffType ? { staffType } : { staffType: null };
  
//     const result = await client.query({
//       query,
//       variables,
//     });
  
//     //return result.data.staffs;

//     let staffMembers : Array<Staff> = []

//   staffMembers = result.data.staffs
  
//   return staffMembers
//   }
  
// export async function getStaffMembers(staffType?: string): Promise<any> {
//     const query = gql`
//       query StaffMembers($staffType: String) {
//         staffs(
//           first: 100
//           where: { staffType: { name: $staffType } }
//         ) {
//           id
//           name
//           profilePicture {
//             url
//           }
//           staffType {
//             name
//           }
//           description {
//             html
//           }
//         }
//       }
//     `;
  
//     // Build the variables object based on whether staffType is provided
//     const variables = staffType ? { staffType } : {};
  
//     try {
//       const result = await client.query({
//         query,
//         variables, // Pass variables dynamically
//       });
  
//       //return result.data.staffs; // Return the fetched staff members
//           let staffMembers : Array<Staff> = [];

//   staffMembers = result.data.staffs;
  
//   return staffMembers;

//     } catch (error) {
//       console.error("Error fetching staff members:", error);
//       throw new Error("Failed to fetch staff members");
//     }
//   }
  
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
  