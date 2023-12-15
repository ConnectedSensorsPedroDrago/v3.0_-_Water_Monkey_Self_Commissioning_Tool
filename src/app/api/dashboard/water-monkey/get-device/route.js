export async function GET(req){

    let id = req.nextUrl.searchParams.get("id")

    let device

    try{
        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/${id}/`, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
            }
        })
        let data = await response.json()
        if(data.properties){
            device = data
            try{
                let response1 = await fetch(data.variables + '?page_size=1000', {
                    method: 'GET',
                    headers:{
                        'Content-Type':'application/json',
                        'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                    }
                })
                let data1 = await response1.json()
                if(data1.results){
                    let variables = []
                    data1.results.forEach(variable => {
                        if(variable.label === "water_consumption_per_update" || variable.label === "water_consumption_per_update_g" || variable.label === "leak_volume_per_update" || variable.label === "leak_volume_per_update_g" || variable.label === "actual_consumption_per_update" || variable.label === "actual_consumption_per_update_g" || variable.label === "water_cost_per_update" || variable.label === "leak_cost_per_update" || variable.label === "actual_cost_per_update"){
                            variables.push({label: variable.label, id: variable.id})
                        }
                    })
                    device.variables = variables
                    return new Response(JSON.stringify({"status": "ok", "device": device}))
                }else{
                    return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the Water Monkey variable data. Please try again or contact support"}))
                }
            }catch(e){
                return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the Water Monkey variable data: " + e + ". Please try again or contact support"}))
            }
        } else {
            return new Response(JSON.stringify({"status": "error", "message": "There was an error retrieving the data for this Water Monkey. Please try again or contact support"}))
        }
    }catch(e){
        console.log("There was an error requesting the Water Monkey data: " + e + ". Please try again or contact support")
        return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the Water Monkey data: " + e + ". Please try again or contact support"}))
    }
}
