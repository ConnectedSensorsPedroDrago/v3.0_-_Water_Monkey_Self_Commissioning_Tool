export async function POST(req){

    const { id } = await req.json()

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
                return new Response(JSON.stringify({"status": "ok"}))
            }else{
                console.log("There was an error resetting the metrics. Please try again.")
                return new Response(JSON.stringify({"status": "error", "message": "There was an error resetting the metrics. Please try again."}))
            }
    }catch(e){
        console.log("There was an error resetting the metrics" + e + ". Please try again.")
        return new Response(JSON.stringify({"status": "error", "message": "There was an error resetting the metrics" + e + ". Please try again."}))
    }
}