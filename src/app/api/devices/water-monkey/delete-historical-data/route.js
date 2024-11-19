import { toTimestamp } from "@/src/functions/toTimestamp"

export async function POST(req){

    const { label } = await req.json()

    let now = new Date()


    try{
        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/~${label}/_/values/delete/?startDate=${toTimestamp(now)-63113904000}&endDate=${toTimestamp(now)-10000}`, {
            method: 'POST',
                headers: {
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            }
        })
        let data = await response.json()
        console.log(data)
        if(!data.task.id){
            return new Response({"status": "error", "message": "There was an error deleting the historical data of your device, please try again or contact support."})
        }else{
            try{
                let response = await fetch(`https://cs.api.ubidots.com/api/v1.6/devices/${label}/_/bulk/values`, {
                    method: 'POST',
                        headers: {
                        'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify([{
                                rc: 1, timestamp: toTimestamp(now)
                            },{
                                rb: 0, timestamp: toTimestamp(now)
                            },{
                                fce: 0, timestamp: toTimestamp(now)
                            },{
                                shutdown: 0, timestamp: toTimestamp(now)
                            },{
                                ti: 10, timestamp: toTimestamp(now)
                            },{
                                ui: 360, timestamp: toTimestamp(now)
                        }])
                })
                let data = await response.json()
                console.log(data)
                if(data.results){
                    return new Response(JSON.stringify({"status": "ok"}))
                } else {
                    return new Response(JSON.stringify({"status": "error", "message": "There was an error preparing the Water Monkey for commissioning stage deleting the historical data. Please try again or contact support."}))
                }
            }catch(e){
                return new Response(JSON.stringify({"status": "error", "message": "There was an error preparing the Water Monkey for commissioning stage deleting the historical data: " + e + ". Please try again or contact support."}))
            }
        }
    }catch(e){
        return new Response({"status": "error", "message": "There was an error deleting the historical data of your device: " + e + ". Please try again or contact support."})
    }finally{

    }
}