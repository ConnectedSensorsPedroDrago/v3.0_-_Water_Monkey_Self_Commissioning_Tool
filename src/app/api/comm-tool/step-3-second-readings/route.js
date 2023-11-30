import { toTimestamp } from "@/src/functions/toTimestamp"

export async function POST(req){

    const { meterType, lowSideSecond, dateSecond, lowSideSecondUnit, picSecond, highSideSecond, highSideSecondUnit, picURL, params, commStage } = await req.json()

    let timestamp = toTimestamp(new Date(dateSecond))

    if(meterType === "Single" && lowSideSecond && dateSecond && lowSideSecondUnit && picSecond || meterType === "Compound" && lowSideSecond && highSideSecond && lowSideSecondUnit && highSideSecondUnit && dateSecond && picSecond){
            let newLowSideSecond = lowSideSecondUnit === "m3" ? lowSideSecond : lowSideSecondUnit === "liters" ? Number(lowSideSecond)*0.001 : lowSideSecondUnit === "gallons" && Number(highSideSecond)*0.00378541
            let newHighSideSecond = highSideSecondUnit === "m3" ? highSideSecond : highSideSecondUnit === "liters" ? Number(highSideSecond)*0.001 : highSideSecondUnit === "gallons" && Number(highSideSecond)*0.00378541        
        try{
            let payload = {"final_meter_reading_primary": {"value": newLowSideSecond, "timestamp": timestamp, "context": {"pic": picURL, "date_time": dateSecond}}}
            meterType === "Compound" && (payload = {"final_meter_reading_primary": {"value": newLowSideSecond, "timestamp": timestamp, "context": {"pic": picURL, "date_time": dateSecond}}, "final_meter_reading_secondary": {"value": newHighSideSecond, "timestamp": timestamp, "context": {"pic": picURL, "date_time": dateFirst}}})
            console.log(payload)
            let response = await fetch(`https://industrial.api.ubidots.com/api/v1.6/devices/${params.id}/`, {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                },
                body: JSON.stringify(payload)
            })
            let data = await response.json()
            if(!data.final_meter_reading_primary){
                return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings. Please try again or contact support."}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings: " + e + ". Please try again or contact support."}))
        }finally{
            try{
                let payload = meterType === "Single" ? 
                    {"date_time": dateSecond, "low": newLowSideSecond, "low_unit": lowSideSecondUnit, "pic": picURL}
                    : 
                    {"date_time": dateSecond, "low": newLowSideSecond, "low_unit": lowSideSecondUnit, "high": newHighSideSecond, "high_unit": highSideSecondUnit, "pic": picURL}
                let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/~${params.id}/`, {
                    method: 'PATCH',
                    headers:{
                        'Content-Type':'application/json',
                        'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                    },
                    body: JSON.stringify({
                        "properties": {
                            "commission_stage": JSON.stringify({
                                "stage": "second reading",
                                "first": commStage.first,
                                "second": payload
                            })
                        }
                    })
                })
                let data = await response.json()
                if(data.label === params.id){
                    return new Response(JSON.stringify({"status": "ok", "commission_stage": data.properties.commission_stage}))

                }else{
                    return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings. Please try again or contact support."}))
                }
            }catch(e){
                return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings: " + e + ". Please try again or contact support."}))
            }
        }
    }else{
        return new Response(JSON.stringify({"status": "error", "message": "Please complete all the required fields to submit the second readings"}))
    }
}

