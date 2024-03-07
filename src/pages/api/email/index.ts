import type { APIRoute } from "astro"

export type EmailApiResponse = {
    status : string,
    error_message : string
}

export type EmailTemplateParameters = {
    subject:string,
    message:string,
    to:string,
    sender:string
}

export type EmailModel = {
    service_id : string,
    template_id : string,
    user_id : string,
    accessToken : string,
    template_params : EmailTemplateParameters
}

var templateParams : EmailTemplateParameters = {
        "subject": "Test Email",
        "message": "This is a test email 333",
        "to":"ibrahim_na@outlook.com",
        "sender":"info@oiacedmonton.ca"
    }

let emailModel : EmailModel = {
    service_id: "service_s0stxqp",
    template_id: "template_kyv86rq",
    user_id: "-jhHh_WH8nOiMuzsZ",
    accessToken : "Q1FVkKg7Evc0wtI2WCZ0M",
    template_params : templateParams
}

export const POST: APIRoute = async ({request}) => {
    const templateParameters = await request.json() as EmailTemplateParameters
    templateParameters.sender = "info@oiacedmonton.ca"
    try{
        
        emailModel.template_params = templateParameters

        const apiResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(templateParameters)
        })
        
        const jsonResponse = await apiResponse.json()

        let success_response : EmailApiResponse = {
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