import type { APIRoute } from "astro"
// import { getXataClient } from "../../../xata"

// const client = getXataClient()

import { XataClient } from '../../../xata'
 
const client = new XataClient({
  apiKey: import.meta.env.XATA_API_KEY,
  branch: import.meta.env.XATA_BRANCH
})

export const GET: APIRoute = async () => {
    try{
        const testEvents = await client.db.TestEvents.getAll()
        return new Response(JSON.stringify(testEvents),{
            status:200,
            headers:{
                        'Content-Type':'application/json'
                    }
                })
    }
    catch(error){
        return new Response(JSON.stringify(error),{
            status:500,
            headers:{
                        'Content-Type':'application/json'
                    }
                })
    }
    
}

