export async function GET(req){

    let id = req.nextUrl.searchParams.get("id")
    console.log(`https://cs.api.ubidots.com/api/v2.0/devices/~${id}/`)

    try{
        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/~${id}/`, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
            }
        })
        let data = await response.json()
        console.log(data)
        if(data.properties){
            return new Response(JSON.stringify({"status": "ok", "device": data}))
        } else {
            return new Response(JSON.stringify({"status": "error", "message": "There was an error retrieving the data for this Water Monkey. Please try again or contact support"}))
        }
    }catch(e){
        console.log("There was an error requesting the Water Monkey data: " + e + ". Please try again or contact support")
        return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the Water Monkey data: " + e + ". Please try again or contact support"}))
    }

}

