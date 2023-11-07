export const prerender = false
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({request}) => {
    const subscriber = await request.json()
    // console.log('Request : ', JSON.stringify(subscriber))

    try{
        const apiResponse = await fetch('https://us5.api.mailchimp.com/3.0/lists/813c461f9a',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization: 'auth 20964213599e7cf20af50c5d21291bdd-us5'
            },
            body: JSON.stringify(subscriber)
        })
        // if(!apiResponse.ok){
        //     throw new Error('Error',{
        //         cause: { apiResponse }
        //     })
        // }

        const jsonResponse = await apiResponse.json()
        
        // console.log('Response : ', JSON.stringify(jsonResponse))
        if(jsonResponse.errors.length>0){
            return new Response(JSON.stringify(jsonResponse),{
                status:500,
                headers:{
                                'Content-Type':'application/json'
                            }
                        })
        }

        return new Response(JSON.stringify(jsonResponse),{
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