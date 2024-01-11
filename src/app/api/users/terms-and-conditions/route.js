import { toTimestamp } from "@/src/functions/toTimestamp"

export async function POST(req){

    const { user, timezone } = await req.json()

    try{
        let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/users/${user}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
            },
            body: JSON.stringify({
                "properties": {
                    "terms": {
                        "status": "accepted",
                        "date": new Date(),
                        "timezone": timezone,
                        "timestamp": toTimestamp(new Date())
                    }
                }
            })
        })
        let data = await response.json()
        if(data.properties.terms.status === "accepted"){
            return new Response(JSON.stringify({"status": "ok"}))
        }else{
            return new Response(JSON.stringify({"status": "error", "message": "There was an error recording your acceptance of the Terms & Conditions, please refresh and try again"}))
        }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "message": "There was an error recording your acceptance of the Terms & Conditions: " + e + ". Please refresh and try again"}))
    }
}