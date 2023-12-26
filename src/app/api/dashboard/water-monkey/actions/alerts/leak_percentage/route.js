import { toTimestamp } from "@/src/functions/toTimestamp"

export async function POST(req){

    const { device, prev_status } = await req.json()

    try{
        let response = await fetch(`https://cs.api.ubidots.com/api/v1.6/devices/${device}/leak_percentage_alert/values`, {
            method: 'POST',
            headers: {
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            },
            body: JSON.stringify({
                "value": prev_status === undefined ? 1 : prev_status === 0 ? 1 : 0,
                "timestamp": toTimestamp(Date.now())
            })
        })
        let data = await response.json()
        if(data.value !== prev_status){
            return new Response(JSON.stringify({"status": "ok", "data": data}))
        }else{
            return new Response(JSON.stringify({"status": "error", "message": "There was an error changing the status of the Leak Percentage alert. Please try again or contact support."}))
        }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "message": "There was an error changing the status of the Leak Percentage alert: " + e + ". Please try again or contact support."}))
    }

}