export async function GET(req){

    let id = req.nextUrl.searchParams.get("id")

    let comm_stage = JSON.stringify({stage: "none", first: {}, second: {}})

    try{
        let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/devices/~${id}/`, {
                method: 'PATCH',
                headers:{
                    'Content-Type':'application/json',
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                },
                body: JSON.stringify({
                    "properties": {
                        "commission_stage": comm_stage
                    }
                }),
            })
            let data = await response.json()
            if(data.properties){
                fetch('/api/devices/water-monkey/delete-historical-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        label: id,
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if(data.status === "ok"){
                        return new Response(JSON.stringify({"status": "ok"}))
                    }else{
                        return new Response(JSON.stringify({"status": "error", "message": data.message}))
                    }
                })
                .catch(e => {
                    return new Response(JSON.stringify({"status": "error", "message": "There was an error deleting the historical data of your Water Monkey to prepare it for commissioning: " + e + ". Please try again or contact support."}
                ))})
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was an error resetting the metrics. Please try again."}))
            }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "message": "There was an error resetting the metrics" + e + ". Please try again."}))
    }
}

