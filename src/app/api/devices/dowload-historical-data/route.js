import { toTimestamp } from "@/src/functions/toTimestamp"

export async function POST(req){

    const {
        email,
        label,
        timezone,
        timestamp_start, 
        timestamp_end,
    } = await req.json()

    try{
        console.log(`https://cs.api.ubidots.com/api/v2.0/devices/~${label}/_/values/export/?email=${email}&startDate=${timestamp_start}&endDate=${timestamp_end}&timezone=${timezone}`)
        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/~${label}/_/values/export/?email=${email}&startDate=${timestamp_start}&endDate=${timestamp_end}&timezone=${timezone}`, {
            "method": "POST",
            "headers": {
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            }
        })
        let data = await response.json()
        console.log(data)
        if(data.task && data.task.id){
            return new Response(JSON.stringify({"status": "ok"}))
        }else{
            return new Response(JSON.stringify({"status": "error", "message": `There was an error requesting the historical data download. Please try again or contact support.`}))
        }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "message": `There was an error requesting the historical data download: ${e}. Please try again or contact support.`}))
    }
}