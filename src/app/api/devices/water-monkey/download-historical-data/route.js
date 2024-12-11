export async function GET(req){

    let device_id = req.nextUrl.searchParams.get("device_id")
    let email = req.nextUrl.searchParams.get("email")
    let timezone = req.nextUrl.searchParams.get("timezone")
    let start = req.nextUrl.searchParams.get("start")
    let end = req.nextUrl.searchParams.get("end")

    let processed_data = {
        "device_id": device_id,
        "email": email,
        "timezone": timezone,
        "start": Number(start),
        "end": Number(end)
    }

    if(device_id && email && timezone && start && end){
        try{
            let response = await fetch('https://functions.cs.api.ubidots.com/prv/ConnectedSensors/new-function', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            },
            body: JSON.stringify({
                    "id": device_id,
                    "emails": [email],
                    "timezone": timezone,
                    "start": Number(start),
                    "end": Number(end)
                })
            })
            let data = await response.json()
            console.log(data)
            if(data.status == "Ok"){
                return new Response(JSON.stringify({"status": "ok", "data": processed_data}))
            }else{
                return new Response(JSON.stringify({"status": "error", "message": `There was an error requesting the historical data for this Water Monkey. Please try again or contact support.`}))
            }
        } catch(e){
            return new Response(JSON.stringify({"status": "error", "message": `There was an error requesting the historical data for this Water Monkey: ${e}. Please try again or contact support.`}))
        }
    }else{
        return new Response(JSON.stringify({"status": "error", "message": `Please complete all the requested fields to export historical data.`}))
    }

}