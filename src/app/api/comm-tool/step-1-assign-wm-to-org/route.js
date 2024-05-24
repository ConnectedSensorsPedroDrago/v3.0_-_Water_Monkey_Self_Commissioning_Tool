export async function GET(req){

    let label = req.nextUrl.searchParams.get("label")
    let org = req.nextUrl.searchParams.get("org")
    let meter_type = req.nextUrl.searchParams.get("meter_type")

    try{
        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/~${label}` , {
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
            },
            body: JSON.stringify({
                "organization": org
            })
        })
        let data = await response.json()
        if(data.label === label && data.organization.id === org){
            try{
                let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/~${label}/`, {
                    method: 'PATCH',
                    headers:{
                        'Content-Type':'application/json',
                        'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                    },
                    body: JSON.stringify({
                        "properties": {
                            "commission_stage": null
                        }
                    })
                })
                let data = await response.json()
                if(data.properties){
                    try{
                        let response = await fetch(`https://cs.ubidots.site/api/v2.0/device_types/${meter_type === "Single" ? '663cd699074996003f4bd9db' : '65fb078ffcc811003edb2ba4'}/_/devices/apply/`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                            },
                            body: JSON.stringify({
                                "devices": [`~${label}`],
                                "applyTasks": false
                            })
                        })
                        let data = await response.json()
                        if(data.succeed_count && data.succeed_count === 1){
                            try{
                                let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/~${label}/`, {
                                    method: 'PATCH',
                                    headers:{
                                        'Content-Type':'application/json',
                                        'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                                    },
                                    body: JSON.stringify({
                                        "properties": {
                                            "meter_type": meter_type,
                                            "secondary_enable": meter_type === "Single" ? 0 : 1
                                        }
                                    })
                                })
                                let data = await response.json()
                                if(data.properties){
                                    return new Response(JSON.stringify({"status": "ok", "monkey": label}))
                                }
                            }catch(e){
                                return new Response(JSON.stringify({"status": "error", "message": "There was an error assigning the meter type to the properties: " + e + ". Please try again or contact support"}))
                            }
                        }
                    }catch(e){
                        return new Response(JSON.stringify({"status": "error", "message": "There was an error assigning the Water Monkey to correct device type: " + e + ". Please try again or contact support"}))
                    }
                }else{
                    return new Response(JSON.stringify({"status": "error", "message": "There was an error assigning the Water Monkey to the selected organization. Please try again or contact support"}))
                }
            }catch(e){
                return new Response(JSON.stringify({"status": "error", "message": "There was an error assigning the Water Monkey to the selected organization: " + e + ". Please try again or contact support"}))
            }
        }else{
            return new Response(JSON.stringify({"status": "error", "message": "There was an error assigning the Water Monkey to the selected organization. Please try again or contact support"}))
        }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "message": "There was an error assigning the Water Monkey to the selected organization. Please try again or contact support"}))
    }
}

