// @ts-ignore - Handle CommonJS/ESM compatibility
import pkg from '@apollo/client';
// @ts-ignore
const { gql } = pkg;

import {client} from '../../../graphql/apollo-client'
import type { APIRoute } from 'astro'

export type Volunteer = {
    "name": string,
    "email": string,
    "phone": string,
    "expertise": string,
    "message": string
}

export type AddVolunteerApiResponse = {
    "status" : string,
    "error_message" : string
}

type AddVolunteerSuccessResponse = {
    "data": {
        "createVolunteer" : {
            "id" : string,
            "__typename" : string
        }
    },
    "extensions" : {
        "Complexity-Cost-Left" : number,
        "Effective-Complexity-Limit" : number
    }
}

type AddVolunteerErrorResponse = {
    "name" : string,
    "graphQLErrors" : Array<object>,
    "protocolErrors" : Array<object>,
    "clientErrors" : Array<object>,
    "networkError" : {
        "name" : string,
        "response" : object,
        "statusCode" : number,
        "result" : {
            "errors" : [{"message":string}],
            "data" : null
        }
    },
}

export const POST: APIRoute = async ({request}) => {
    const volunteer : Volunteer = await request.json()
    
    try{
        
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

        const addVolunteerResult = await client.mutate({mutation:ADD_VOLUNTEER})
        // console.log('addVolunteerResult => ', JSON.stringify(addVolunteerResult))
        const successResult = addVolunteerResult as AddVolunteerSuccessResponse
        // console.log('addVolunteerSuccessResult => ', JSON.stringify(successResult))
        
        if(successResult){
            const mutationPublishVolunteer = `
                mutation PublishVolunteer {
                    publishVolunteer(where: {id: "${successResult.data.createVolunteer.id}"}, to: PUBLISHED) {
                    id
                    }
                }
            `
            const PUBLISH_VOLUNTEER = gql`${mutationPublishVolunteer}`
            const publishVolunteerResult = await client.mutate({mutation:PUBLISH_VOLUNTEER})
            // console.log('publishVolunteerResult => ', JSON.stringify(publishVolunteerResult))
        }

        let success_response : AddVolunteerApiResponse = {
                status : "success",
                error_message : ""
            }
            return new Response(JSON.stringify(success_response),{
                status:200,
                headers:{
                            'Content-Type':'application/json'
                        }
        })
        
    } catch(err){
        const errorResponse = err as AddVolunteerErrorResponse
        console.error('err => ', JSON.stringify(errorResponse))
        const indexOfColon = errorResponse.networkError.result.errors[0].message.indexOf('"')
        const duplicateEntity = errorResponse.networkError.result.errors[0].message.substring(indexOfColon)
        let error_response : AddVolunteerApiResponse = {
            status : "error",
            error_message : `Entered ${duplicateEntity} already registered for volunteering!`
        }

        return new Response(JSON.stringify(error_response),{
            status:500,
            headers:{
                        'Content-Type':'application/json'
                    }
                })
    }
    


    
    

}