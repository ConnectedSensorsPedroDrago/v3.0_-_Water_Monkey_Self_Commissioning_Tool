export async function POST(req){

    const { meterType, lowSideFirst, dateFirst, lowSideFirstUnit, picFirst, highSideFirst, highSideFirstUnit, picURL, params, commStage, deviceId } = await req.json()

    if(meterType === "Single" && lowSideFirst && dateFirst && lowSideFirstUnit && picFirst || meterType === "Compound" && lowSideFirst && highSideFirst && lowSideFirstUnit && highSideFirstUnit && dateFirst && picFirst){
            let newLowSideFirst = lowSideFirstUnit === "m3" ? lowSideFirst : lowSideFirstUnit === "liters" ? Number(lowSideFirst)*0.001 : lowSideFirstUnit === "gallons" && Number(lowSideFirst)*0.00378541
            let newHighSideFirst = highSideFirstUnit === "m3" ? highSideFirst : highSideFirstUnit === "liters" ? Number(highSideFirst)*0.001 : highSideFirstUnit === "gallons" && Number(highSideFirst)*0.00378541        
        try{
            let payload = {"initial_meter_reading_primary": {"value": newLowSideFirst, "timestamp": dateFirst.timestamp, "context": {"pic": picURL, "date_time": dateFirst}}}
            meterType === "Compound" && (payload = {"initial_meter_reading_primary": {"value": newLowSideFirst, "timestamp": dateFirst.timestamp, "context": {"pic": picURL, "date_time": dateFirst}}, "initial_meter_reading_secondary": {"value": newHighSideFirst, "timestamp": dateFirst.timestamp, "context": {"pic": picURL, "date_time": dateFirst}}})

            let response = await fetch(`https://cs.api.ubidots.com/api/v1.6/devices/${params.id}/`, {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                },
                body: JSON.stringify(payload)
            })
            let data = await response.json()
            if(!data.initial_meter_reading_primary){
                return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the first readings. Please try again or contact support."}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the first readings: " + e + ". Please try again or contact support."}))
        }finally{
            try{
                let payload = meterType === "Single" ? 
                    {"date_time": dateFirst, "low": lowSideFirst, "low_unit": lowSideFirstUnit, "pic": picURL}
                    : 
                    {"date_time": dateFirst, "low": lowSideFirst, "low_unit": lowSideFirstUnit, "high": highSideFirst, "high_unit": highSideFirstUnit, "pic": picURL}
                let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/~${params.id}/`, {
                    method: 'PATCH',
                    headers:{
                        'Content-Type':'application/json',
                        'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                    },
                    body: JSON.stringify({
                        "properties": {
                            "commission_stage": JSON.stringify({
                                "stage": "first reading",
                                "first": payload,
                                "second": commStage.second
                            })
                        }
                    })
                })
                let data = await response.json()
                if(data.label === params.id){
                    let comm_stage = data.properties.commission_stage
                    let vars = []
                    try{
                        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/${deviceId}/variables?page_size=500`, {
                            'headers': {
                                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                            }
                        })
                        let data = await response.json()
                        if(data.count > 0){
                            data.results.forEach(variable => {
                                if(variable.label === 'wu_p' || variable.label === 'wu_s'){
                                    vars.push(variable.id)
                                }
                            })
                        }
                    }catch(e){
                        return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the wu_p and wu_s variables to clean the previous data"}))
                    }finally{
                        for(let i = 0; i < vars.length; i++){
                            try{
                                let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/variables/${vars[i]}/_/values/delete/?startDate=1546300800000&endDate=${dateFirst.timestamp}`, {
                                    'method': 'POST',
                                    'headers': {
                                        'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                                    }
                                })
                                let data = await response.json()
                                if(data.task.id){
                                    if(i == (vars.length -1)){
                                        return new Response(JSON.stringify({"status": "ok", "commission_stage": comm_stage}))
                                    }
                                }else{
                                    return new Response(JSON.stringify({"status": "error", "message": `There was an error deleting the previous data for variable id: ${deviceId}`}))
                                }
                            }catch(e){
                                return new Response(JSON.stringify({"status": "error", "message": `There was an error deleting the previous data for variable id: ${deviceId}: ${e}`}))
                            }
                        }
                    }
                }else{
                    return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the first readings. Please try again or contact support."}))
                }
            }catch(e){
                return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the first readings: " + e + ". Please try again or contact support."}))
            }
        }
    }else{
        return new Response(JSON.stringify({"status": "error", "message": "Please complete all the required fields to submit the first readings"}))
    }
}

