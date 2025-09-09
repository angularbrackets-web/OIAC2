import pkg from '@apollo/client';
const { gql } = pkg;

import {client} from './apollo-client'

export type Volunteer = {
    "name": string,
    "email": string,
    "phone": string,
    "expertise": string,
    "message": string
}

export const volunteerTest = () => {
    return 'success'
}

export const addVolunteer = async (volunteer:Volunteer) => {
    // await console.log('111111')
    const mutationAddVolunteer = `
        mutation AddVolunteer {
            createVolunteer(
                data:{
                    name: "${volunteer.name}",
                    email: "${volunteer.email}",
                    phone: "${volunteer.phone}",
                    expertise: "${volunteer.expertise}",
                    message: "${volunteer.message}"
                }
            ){
                id
            }
        }
    `
    
    const ADD_VOLUNTEER = gql`${mutationAddVolunteer}`

    const result = await client.mutate({mutation:ADD_VOLUNTEER})
    // await console.log('22222')
    // await console.log('createVolunteer.id', result.data?.createVolunteer.id)
    //await console.log('createVolunteer.duplicateError', result.networkError?.result?.errors[0]?.message)
    
    // const mutationPublishVolunteer = `
    //     mutation PublishVolunteer {
    //         publishVolunteer(where: {id: "clpjwn43pm3vw0cn48b4t01ei"}, to: PUBLISHED) {
    //         id
    //         }
    //     }
    // `

    // await console.log('ADD VOLUNTEER RESULT : ', JSON.stringify(result))

    return result
}

export default addVolunteer