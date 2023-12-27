import { toTimestamp } from "@/src/functions/toTimestamp"

export async function POST(req){
    const {device, email, start, end, timezone} = await req.json()
    
    try{
        let response = await fetch('https://functions.cs.api.ubidots.com/prv/ConnectedSensors/new-function', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
            },
            body: JSON.stringify({
                    "id": device,
                    "emails": email,
                    "timezone": timezone,
                    "start": toTimestamp(start),
                    "end": toTimestamp(end)
                })
        })
        let data = await response.json()
        console.log(data)
        if(data.status === "Ok"){
            return new Response(JSON.stringify({"status": "ok", "message": "Report requested, you should receive the report shortly."})) 
        }else{
            return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the CSV report. Please try again or contact support"}))
        }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the CSV report: " + e + ". Please try again or contact support"}))
    }
}