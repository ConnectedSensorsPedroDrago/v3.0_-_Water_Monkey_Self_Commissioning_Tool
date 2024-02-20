export async function POST(req){

    const { meterType, lowSideSecond, dateSecond, lowSideSecondUnit, picSecond, highSideSecond, highSideSecondUnit, picURL, params, commStage, propertyType } = await req.json()

    let newCommStage

    let readingsVariables = []

    let firstLowToCompare = commStage.first.low_unit === "m3" ? Number(commStage.first.low) : commStage.first.low_unit === "liters" ? Number(commStage.first.low)*0.001 : commStage.first.low_unit === "gallons" && Number(commStage.first.low)*0.00378541

    let secondLowToCompare = lowSideSecondUnit === "m3" ? lowSideSecond : lowSideSecondUnit === "liters" ? Number(lowSideSecond)*0.001 : lowSideSecondUnit === "gallons" && Number(lowSideSecond)*0.00378541

    let firstHighToCompare

    let secondHighToCompare

    if(meterType === 'Compound'){
        firstHighToCompare = commStage.first.high_unit === "m3" ? Number(commStage.first.high) : commStage.first.high_unit === "liters" ? Number(commStage.first.high)*0.001 : commStage.first.high_unit === "gallons" && Number(commStage.first.high)*0.00378541
        secondHighToCompare = highSideSecondUnit === "m3" ? highSideSecond : highSideSecondUnit === "liters" ? Number(highSideSecond)*0.001 : highSideSecondUnit === "gallons" && Number(highSideSecond)*0.00378541
    }

    if((propertyType !== "Residential - Single Family Home") && (secondLowToCompare - firstLowToCompare < 10)){
        return new Response(JSON.stringify({"status": "error", "message": "Not enough water has flown through the meter. Please let more time go by and make sure that at least 10m3 (or it's equivalent) of water has flown through the meter. If the meter is Compound, 10m3 (or it's equivalent) should flow per side."}))
    }else if(meterType === 'Compound' && secondHighToCompare - firstHighToCompare < 10){
        return new Response(JSON.stringify({"status": "error", "message": "Not enough water has flown through the meter. Please let more time go by and make sure that at least 10m3 (or it's equivalent) of water has flown through the meter. If the meter is Compound, 10m3 (or it's equivalent) should flow per side."}))
    }else{
        try{
            let response = await fetch(`https://cs.ubidots.site/api/v2.0/variables/?label__in=initial_meter_reading_primary,initial_meter_reading_secondary,final_meter_reading_primary,final_meter_reading_secondary,&fields=id,label&device__label__in=${params.id}`, {
                method: 'GET',
                headers:{
                    'Content-Type':'application/json',
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                }
            })
            let data = await response.json()
            if(data.results){
                data.results.forEach(variable => 
                    readingsVariables.push([variable.id, variable.label])
                )
                for(let i = 0; i <= readingsVariables.length; i++){
                    try{
                        let response = fetch(`https://industrial.api.ubidots.com/api/v2.0/variables/${readingsVariables[i][0]}/_/values/delete/?startDate=1546300800000&endDate=${Number(commStage.first.date_time.timestamp) - 10000}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type':'application/json',
                                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                            }
                        })
                        let data = await response.json()
                        if(!data.task){
                            return new Response({"status": "error", "message": "There was an error clearing the previous data of your " + readingsVariables[i][1] + "varaible. Please try again or contact support"})
                        }
                    }catch(e){
                        return new Response({"status": "error", "message": "There was an error clearing the previous data of your " + readingsVariables[i][1] + "variable: " + e + ". Please try again or contact support"})
                    }
                }
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was an error retrieving the variables for the meter readings, please try again or contact support."}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was an error retrieving the variables for the meter readings: " + e + ". Please try again or contact support."}))
        }finally{
            if(meterType === "Single" && lowSideSecond && dateSecond && lowSideSecondUnit && picSecond || meterType === "Compound" && lowSideSecond && highSideSecond && lowSideSecondUnit && highSideSecondUnit && dateSecond && picSecond){
                let newLowSideSecond = lowSideSecondUnit === "m3" ? lowSideSecond : lowSideSecondUnit === "liters" ? Number(lowSideSecond)*0.001 : lowSideSecondUnit === "gallons" && Number(highSideSecond)*0.00378541
                let newHighSideSecond = highSideSecondUnit === "m3" ? highSideSecond : highSideSecondUnit === "liters" ? Number(highSideSecond)*0.001 : highSideSecondUnit === "gallons" && Number(highSideSecond)*0.00378541        
                let payload = {"final_meter_reading_primary": {"value": newLowSideSecond, "timestamp": dateSecond.timestamp, "context": {"pic": picURL, "date_time": dateSecond}}, "wu_s": {"value": 0, "timestamp": dateSecond.timestamp}}
                    meterType === "Compound" && (payload = {"final_meter_reading_primary": {"value": newLowSideSecond, "timestamp": dateSecond.timestamp, "context": {"pic": picURL, "date_time": dateSecond}}, "final_meter_reading_secondary": {"value": newHighSideSecond, "timestamp": dateSecond.timestamp, "context": {"pic": picURL, "date_time": dateSecond}}})
                try{
                    let response = await fetch(`https://cs.ubidots.site/api/v2.0/variables/?label__in=tc_p,tc_s&fields=label,lastValue,device&device__label__in=${params.id}`, {
                        method: 'GET',
                        headers:{
                            'Content-Type':'application/json',
                            'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                        }
                    })
                    let data = await response.json()
                    if(data.count === 2){
                        if(meterType === "Single"){
                            let check
                            data.results.forEach(x => {
                                if((x.label === "tc_p") && x.lastValue.value >= 0){
                                    check = 1
                                }
                            })
                            if(check === 1){
                                try{
                                    let response = await fetch('http://localhost:3000/api/comm-tool/step-3-calculate-volume-per-pulse', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            meterType: meterType, 
                                            label: params.id, 
                                            commStage: {
                                                "stage": "second reading",
                                                "first": commStage.first,
                                                "second": meterType === "Single" ? 
                                                    {"date_time": dateSecond, "low": newLowSideSecond, "low_unit": lowSideSecondUnit, "pic": picURL}
                                                    : 
                                                    {"date_time": dateSecond, "low": newLowSideSecond, "low_unit": lowSideSecondUnit, "high": newHighSideSecond, "high_unit": highSideSecondUnit, "pic": picURL}
                                            }
                                        })
                                    })
                                    let data1 = await response.json()
                                    if(data1.status === 'ok'){
                                        try{
                                            let response2 = await fetch(`https://industrial.api.ubidots.com/api/v1.6/devices/${params.id}/`, {
                                                method: 'POST',
                                                headers:{
                                                    'Content-Type':'application/json',
                                                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                                                },
                                                body: JSON.stringify(payload)
                                            })
                                            let data2 = await response2.json()
                                            if(!data2.final_meter_reading_primary){
                                                return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings. Please try again or contact support."}))
                                            }else{
                                                try{
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
                                                                    "second": meterType === "Single" ? 
                                                                        {"date_time": dateSecond, "low": newLowSideSecond, "low_unit": lowSideSecondUnit, "pic": picURL}
                                                                        : 
                                                                        {"date_time": dateSecond, "low": newLowSideSecond, "low_unit": lowSideSecondUnit, "high": newHighSideSecond, "high_unit": highSideSecondUnit, "pic": picURL}
                                                                })
                                                            }
                                                        })
                                                    })
                                                    let data = await response.json()
                                                    if(data.label == params.id){
                                                        for(let i = 0; i <= readingsVariables.length; i++){
                                                            try{
                                                                let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/variables/${readingsVariables[i][0]}/_/values/delete/?startDate=1546300800000&endDate=${Number(commStage.first.date_time.timestamp) - 10000}`, {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'Content-Type':'application/json',
                                                                        'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                                                                    }
                                                                })
                                                                let data = await response.json()
                                                                if(!data.task){
                                                                    return new Response({"status": "error", "message": "There was an error clearing the previous data of your " + readingsVariables[i][1] + "varaible. Please try again or contact support"})
                                                                }
                                                            }catch(e){
                                                                return new Response({"status": "error", "message": "There was an error clearing the previous data of your " + readingsVariables[i][1] + "variable: " + e + ". Please try again or contact support"})
                                                            }finally{
                                                                if(i == readingsVariables.length){
                                                                    let responseObject = JSON.stringify({"status": "ok", "commission_stage": {
                                                                        "stage": "second reading",
                                                                        "first": commStage.first,
                                                                        "second": meterType === "Single" ? 
                                                                            {"date_time": dateSecond, "low": newLowSideSecond, "low_unit": lowSideSecondUnit, "pic": picURL}
                                                                            : 
                                                                            {"date_time": dateSecond, "low": newLowSideSecond, "low_unit": lowSideSecondUnit, "high": newHighSideSecond, "high_unit": highSideSecondUnit, "pic": picURL}
                                                                    }})
                                                                    return new Response(responseObject)
                                                                }
                                                            }
                                                        }
                                                    }else{
                                                        return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings. Please try again or contact support."}))
                                                    }
                                                }catch(e){
                                                    return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings: " + e + ". Please try again or contact support."}))
                                                }
                                            }
                                        }catch(e){
                                            return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings: " + e + " Please try again or contact support."}))
                                        }
                                    }else if(data1.status === 'error'){
                                        return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings: " + data1.message + ". Please try again or contact support."}))
                                    }
                                }catch(e){
                                    return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings: " + e + ". Please try again or contact support."}))
                                }
                            }else{
                                return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings: 'tc_p and/or tc_s value missing'. Please try again or contact support."}))
                            }
                        }else if(meterType === "Compound"){
                            let check = 0
                            data.results.forEach(x => {
                                if((x.label === "tc_p") && Number(x.lastValue.value) >= 0){
                                    check = check + 1
                                }else if((x.label === "tc_s") && Number(x.lastValue.value) >= 0){
                                    check = check + 1
                                }
                            })
                            if(check === 2){
                                try{
                                    let response = await fetch('/api/comm-tool/step-3-calculate-volume-per-pulse', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            meterType: meterType, 
                                            label: params.id, 
                                            commStage:  {
                                                "stage": "second reading",
                                                "first": commStage.first,
                                                "second": meterType === "Single" ? 
                                                    {"date_time": dateSecond, "low": newLowSideSecond, "low_unit": lowSideSecondUnit, "pic": picURL}
                                                    : 
                                                    {"date_time": dateSecond, "low": newLowSideSecond, "low_unit": lowSideSecondUnit, "high": newHighSideSecond, "high_unit": highSideSecondUnit, "pic": picURL}
                                            }
                                        })
                                    })
                                    let data1 = await response.json()
                                    if(data1.status === 'ok'){
                                        try{
                                            let payload = {"final_meter_reading_primary": {"value": newLowSideSecond, "timestamp": dateSecond.timestamp, "context": {"pic": picURL, "date_time": dateSecond}}}
                                            meterType === "Compound" && (payload = {"final_meter_reading_primary": {"value": newLowSideSecond, "timestamp": dateSecond.timestamp, "context": {"pic": picURL, "date_time": dateSecond}}, "final_meter_reading_secondary": {"value": newHighSideSecond, "timestamp": dateSecond.timestamp, "context": {"pic": picURL, "date_time": dateSecond}}})
                                            let response2 = await fetch(`https://industrial.api.ubidots.com/api/v1.6/devices/${params.id}/`, {
                                                method: 'POST',
                                                headers:{
                                                    'Content-Type':'application/json',
                                                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                                                },
                                                body: JSON.stringify(payload)
                                            })
                                            let data2 = await response2.json()
                                            if(!data2.final_meter_reading_primary){
                                                return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings. Please try again or contact support."}))
                                            }else{
                                                try{
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
                                                                    "second": meterType === "Single" ? 
                                                                        {"date_time": dateSecond, "low": newLowSideSecond, "low_unit": lowSideSecondUnit, "pic": picURL}
                                                                        : 
                                                                        {"date_time": dateSecond, "low": newLowSideSecond, "low_unit": lowSideSecondUnit, "high": newHighSideSecond, "high_unit": highSideSecondUnit, "pic": picURL}
                                                                })
                                                            }
                                                        })
                                                    })
                                                    let data = await response.json()
                                                    if(data.label === params.id){
                                                        for(let i = 0; i <= readingsVariables.length; i++){
                                                            try{
                                                                let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/variables/${readingsVariables[i][0]}/_/values/delete/?startDate=1546300800000&endDate=${Number(commStage.first.date_time.timestamp) - 10000}`, {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'Content-Type':'application/json',
                                                                        'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                                                                    }
                                                                })
                                                                let data = await response.json()
                                                                if(!data.task){
                                                                    return new Response({"status": "error", "message": "There was an error clearing the previous data of your " + readingsVariables[i][1] + "varaible. Please try again or contact support"})
                                                                }
                                                            }catch(e){
                                                                return new Response({"status": "error", "message": "There was an error clearing the previous data of your " + readingsVariables[i][1] + "variable: " + e + ". Please try again or contact support"})
                                                            }finally{
                                                                if(i == readingsVariables.length){
                                                                    let responseObject = JSON.stringify({"status": "ok", "commission_stage": {
                                                                        "stage": "second reading",
                                                                        "first": commStage.first,
                                                                        "second": meterType === "Single" ? 
                                                                            {"date_time": dateSecond, "low": newLowSideSecond, "low_unit": lowSideSecondUnit, "pic": picURL}
                                                                            : 
                                                                            {"date_time": dateSecond, "low": newLowSideSecond, "low_unit": lowSideSecondUnit, "high": newHighSideSecond, "high_unit": highSideSecondUnit, "pic": picURL}
                                                                    }})
                                                                    return new Response(responseObject)
                                                                }
                                                            }
                                                        }
                                                    }else{
                                                        return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings. Please try again or contact support."}))
                                                    }
                                                }catch(e){
                                                    return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings: " + e + ". Please try again or contact support."}))
                                                }
                                            }
                                        }catch(e){
                                            return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings: " + e + " Please try again or contact support."}))
                                        }
                                    }else if(data1.status === 'error'){
                                        return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings: " + data1.message + ". Please try again or contact support."}))
                                    }
                                }catch(e){
                                    return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings: " + e + ". Please try again or contact support."}))
                                }
                            }else{
                                return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings: 'tc_p and/or tc_s value missing'. Please try again or contact support."}))
                            }
                        }
                    }else{
                        return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings: 'tc_p and/or tc_s value missing'. Please try again or contact support."}))
                    }
                }catch(e){
                    return new Response(JSON.stringify({"status": "error", "message": "There was an error writting the second readings: " + e + ". Please try again or contact support."}))
                }
                    
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "Please complete all the required fields to submit the second readings"}))
            }
        }
    }
}