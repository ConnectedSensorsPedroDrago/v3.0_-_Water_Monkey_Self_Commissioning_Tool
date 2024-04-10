export async function GET(req){

    let label = req.nextUrl.searchParams.get("label")
    let org = req.nextUrl.searchParams.get("org")

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
                let response1 = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/~${label}/`, {
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
                let data1 = await response1.json()
                if(data1.properties){
                    return new Response(JSON.stringify({"status": "ok", "monkey": label}))
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

