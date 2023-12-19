import type { APIRoute } from "astro"

export const GET: APIRoute = async () => {
    await console.log('TEST GET')
    return new Response('Hello World!',{
        status:200,
        headers:{
                    'Content-Type':'application/json'
                }
            })
}

