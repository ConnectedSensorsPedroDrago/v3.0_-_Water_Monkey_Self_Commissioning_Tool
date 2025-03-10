export async function POST(req){

    const { meterType, lowSideFirst, dateFirst, lowSideFirstUnit, picFirst, highSideFirst, highSideFirstUnit, picURL, params, commStage, deviceId } = await req.json()

    if(meterType === "Single" && lowSideFirst && dateFirst && lowSideFirstUnit && picFirst || meterType === "Compound" && lowSideFirst && highSideFirst && lowSideFirstUnit && highSideFirstUnit && dateFirst && picFirst){
            let newLowSideFirst = lowSideFirstUnit === "m3" ? lowSideFirst : lowSideFirstUnit === "liters" ? Number(lowSideFirst)*0.001 : lowSideFirstUnit === "gallons" && Number(lowSideFirst)*0.00378541
            let newHighSideFirst = highSideFirstUnit === "m3" ? highSideFirst : highSideFirstUnit === "liters" ? Number(highSideFirst)*0.001 : highSideFirstUnit === "gallons" && Number(highSideFirst)*0.00378541        

            try{
                let payload = meterType === "Single" ? 
                    {"date_time": dateFirst, "low": lowSideFirst, "low_unit": lowSideFirstUnit, "pic": picURL}
                    : 
                    {"date_time": dateFirst, "low": lowSideFirst, "low_unit": lowSideFirstUnit, "high": highSideFirst, "high_unit": highSideFirstUnit, "pic": picURL}

                let properties = meterType === "Single" ?
                    {"properties": {
                        "commission_stage": JSON.stringify({
                            "stage": "first reading",
                            "first": payload,
                            "second": commStage.second
                        }),
                        "initial_meter_reading_primary": Number(newLowSideFirst),
                    }}
                    :
                    {"properties": {
                        "commission_stage": JSON.stringify({
                            "stage": "first reading",
                            "first": payload,
                            "second": commStage.second
                        }),
                        "initial_meter_reading_primary": Number(newLowSideFirst),
                        "initial_meter_reading_secondary": Number(newHighSideFirst)
                    }}

                let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/~${params.id}/`, {
                    method: 'PATCH',
                    headers:{
                        'Content-Type':'application/json',
                        'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                    },
                    body: JSON.stringify(properties)
                })
                let data = await response.json()
                if(data.label === params.id){
                    return new Response(JSON.stringify({"status": "ok", "commission_stage": JSON.parse(data.properties.commission_stage)}))
                }else{
                    return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the first readings. Please try again or contact support."}))
                }
            }catch(e){
                return new Response(JSON.stringify({"status": "error", "message": `There was an error writting the first readings: ${e}. Please try again or contact support.`}))
            }
    }else{
        return new Response(JSON.stringify({"status": "error", "message": "Please complete all the required fields to submit the first readings"}))
    }
}