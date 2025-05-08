export async function POST(req){
    const { meterType, label, commStage } = await req.json()

    
    let JSONCommStage = commStage

    if(meterType === 'Single'){
        let wu_p_sum = 0
        try{
            let response = await fetch(`https://cs.api.ubidots.com/api/v1.6/devices/${label}/wu_p/values?start=${JSONCommStage.first.date_time.timestamp}&end=${JSONCommStage.second.date_time.timestamp}&page_size=4000`, {
                headers: {
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                },
            })
            let data = await response.json()
            if(data.results){
                let volume_per_pulse
                data.results.forEach(x => {
                    wu_p_sum = wu_p_sum + x.value
                })
                if(wu_p_sum >= 0){
                    volume_per_pulse = ((JSONCommStage.second.low_unit === "gallons" ? Number(JSONCommStage.second.low)*3.78541 : JSONCommStage.second.low_unit === "liters" ? Number(JSONCommStage.second.low) : JSONCommStage.second.low_unit === "m3" && Number(JSONCommStage.second.low)*1000) - (JSONCommStage.first.low_unit === "gallons" ? Number(JSONCommStage.first.low)*3.78541 : JSONCommStage.first.low_unit === "liters" ? Number(JSONCommStage.first.low) : JSONCommStage.first.low_unit === "m3" && Number(JSONCommStage.first.low)*1000)) / wu_p_sum
                    try{
                        let response = await fetch(`https://cs.api.ubidots.com/api/v1.6/devices/${label}/`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                            },
                            body: JSON.stringify({
                                "wu_s": {
                                    "value": 0,
                                    "timestamp": JSONCommStage.first.date_time
                                }
                            })
                        })
                        let data = await response.json()
                        if(data.wu_s){
                            return new Response(JSON.stringify({"status": "ok", "data": {"primary_volume_per_pulse": volume_per_pulse, "wu_p_sum": wu_p_sum}}))
                        }else{
                            return new Response(JSON.stringify({"status": "error", "message": "There was an error resetting wu_s calculating the volume per pulse. Please try again or contact support"}))
                        }
                    }catch(e){
                        return new Response(JSON.stringify({"status": "error", "message": "There was an error resetting wu_s calculating the volume per pulse: " + e + ". Please try again or contact support"}))
                    }
                }else{
                    return new Response(JSON.stringify({"status": "error", "message": "Not enough pulses have gone through the low side, just " + wu_p_sum + ", we need at lest 100 . Please let more water flow and try again later."}))
                }

            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There were no results found for wu_p calculating the volume per pulse"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the wu_p information calculating the volume per pulse: " + e + ". Please try again or contact support"}))
        }
    }

    if(meterType === 'Compound'){
        let wu_p_sum = 0
        let wu_s_sum = 0
        let primary_volume_per_pulse
        let secondary_volume_per_pulse
        
        try{
            let response = await fetch(`https://cs.api.ubidots.com/api/v1.6/devices/${label}/wu_p/values?start=${JSONCommStage.first.date_time.timestamp}&end=${JSONCommStage.second.date_time.timestamp}&page_size=50000`, {
                headers: {
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                },
            })
            let data = await response.json()
            if(data.results[0]){
                data.results.forEach(x => {
                    wu_p_sum = wu_p_sum + x.value
                })
                if(wu_p_sum >= 0){
                        primary_volume_per_pulse = ((commStage.second.low_unit === "gallons" ? Number(JSONCommStage.second.low)*3.78541 : JSONCommStage.second.low_unit === "liters" ? Number(JSONCommStage.second.low) : JSONCommStage.second.low_unit === "m3" && Number(JSONCommStage.second.low)*1000) - (JSONCommStage.first.low_unit === "gallons" ? Number(JSONCommStage.first.low)*3.78541 : JSONCommStage.first.low_unit === "liters" ? Number(JSONCommStage.first.low) : JSONCommStage.first.low_unit === "m3" && Number(JSONCommStage.first.low)*1000)) / wu_p_sum 
                }else{
                    return new Response(JSON.stringify({"status": "error", "message": "Not enough pulses have gone through the low side, just " + wu_p_sum + ", we need at lest 100 . Please let more water flow and try again later."}))
                }

            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There were no results found for wu_p calculating the volume per pulse. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the wu_p information calculating the volume per pulse: " + e + ". Please try again or contact support"}))
        }finally{
            try{
                let response = await fetch(`https://cs.api.ubidots.com/api/v1.6/devices/${label}/wu_s/values?start=${JSONCommStage.first.date_time.timestamp}&end=${JSONCommStage.second.date_time.timestamp}&page_size=50000`, {
                    headers: {
                        'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                    },
                })
                let data = await response.json()
                if(data.results[0]){
                    data.results.forEach(x => {
                        wu_s_sum = wu_s_sum + x.value
                    })
                    if(wu_s_sum >= 0){
                        secondary_volume_per_pulse = ((JSONCommStage.second.high_unit === "gallons" ? Number(JSONCommStage.second.high)*3.78541 : JSONCommStage.second.high_unit === "liters" ? Number(JSONCommStage.second.high) : JSONCommStage.second.high_unit === "m3" && Number(JSONCommStage.second.high)*1000) - (JSONCommStage.first.high_unit === "gallons" ? Number(JSONCommStage.first.high)*3.78541 : JSONCommStage.first.high_unit === "liters" ? Number(JSONCommStage.first.high) : JSONCommStage.first.high_unit === "m3" && Number(JSONCommStage.first.high)*1000)) / wu_s_sum
                        return new Response(JSON.stringify({"status": "ok", "data": {"primary_volume_per_pulse": primary_volume_per_pulse === null ? 0.1 : primary_volume_per_pulse, "secondary_volume_per_pulse": secondary_volume_per_pulse === null ? 0.1 : secondary_volume_per_pulse, "wu_p_sum": wu_p_sum, "wu_s_sum": wu_s_sum}}))
                    }else{
                        return new Response(JSON.stringify({"status": "error", "message": "Not enough pulses have gone through the high side, just " + wu_s_sum + ", we need at lest 100 . Please let more water flow and try again later."}))
                    }

                }else{
                    return new Response(JSON.stringify({"status": "error", "message": "There were no results found for wu_s calculating the volume per pulse. Please try again or contact support"}))
                }
            }catch(e){
                return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the wu_s information calculating the volume per pulse: " + e + ". Please try again or contact support"}))
            }
        }
    }
}