export async function POST(req){
    const { device, metric } = await req.json()

    try{
        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/~${device}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": process.env.UBIDOTS_AUTHTOKEN
            },
            body: JSON.stringify({
                "properties": {
                    "volume_measurement_unit": metric
                }
            })
        })
        let data = await response.json()
        if(data.label === device){
            return new Response(JSON.stringify({"status": "ok"}))
        }else{
            return new Response(JSON.stringify({"status": "error", "message": "There was an error changing the metric unit of the device. Please try again or contact support."}))
        }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "message": "There was an error changing the metric unit of the device: " + e + ". Please try again or contact support."}))
    }

}