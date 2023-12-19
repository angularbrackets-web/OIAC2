export const prerender = false
import type { APIRoute } from "astro"
import { isObjectEmpty } from "../../../helper";
const maichimp_api_key = (await import.meta.env.PUBLIC_MAILCHIMP_API_KEY) as string
    

export type MailChimpApiError = {
    "email_address" : string,
    "error" : string,
    "error_code" : string,
    "field" : string,
    "field_message" : string
}

export type MailChimpApiResponse = {
    "status" : string,
    "error_message" : string
}

export const POST: APIRoute = async ({request}) => {
    const subscriber = await request.json()
    
    try{
        const apiResponse = await fetch('https://us5.api.mailchimp.com/3.0/lists/813c461f9a',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization: `auth ${maichimp_api_key}`
            },
            body: JSON.stringify(subscriber)
        })
        
        
        const jsonResponse = await apiResponse.json()
        
        

        if(jsonResponse.error_count > 0){
            let error_response : MailChimpApiResponse = {
                status : "error",
                error_message : JSON.stringify(jsonResponse.errors[0].error)
            }
            return new Response(JSON.stringify(error_response),{
            status:500,
            headers:{
                        'Content-Type':'application/json'
                    }
                })
        }

        if(jsonResponse.title.length > 0){
            let error_response : MailChimpApiResponse = {
                status : "error",
                error_message : JSON.stringify('Something went wrong!')
            }
            return new Response(JSON.stringify(error_response),{
            status:500,
            headers:{
                        'Content-Type':'application/json'
                    }
                })
        }

        let success_response : MailChimpApiResponse = {
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
        return new Response(JSON.stringify(err),{
            status:500,
            headers:{
                        'Content-Type':'application/json'
                    }
                })
    }
    


    
    

}