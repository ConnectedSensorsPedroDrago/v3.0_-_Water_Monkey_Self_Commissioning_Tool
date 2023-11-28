export async function GET(req){

    let device = req.nextUrl.searchParams.get("device")
    console.log(device)

    try{
        let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/devices/${device}/_/values/last`, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            },
        })
        let data = await response.json()
        if(data){
            return new Response(JSON.stringify({"status": "ok", "data": data}))
        }else{
            return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the last values for the device " + device + ". Please try again or contact support"}))
        }
    } catch(e){
        console.log("There was an error requesting alerts for the device " + device + ": " + e )
        return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the last values for the device " + device + ": " + e }))
    }

}

