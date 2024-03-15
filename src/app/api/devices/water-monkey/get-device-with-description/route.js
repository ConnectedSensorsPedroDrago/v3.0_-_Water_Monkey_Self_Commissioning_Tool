export async function GET(req){

    let code = req.nextUrl.searchParams.get("code")

    try{
        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/?description=${code}`, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
            }
        })
        let data = await response.json()
        if(data.results && data.results[0].description == code){
            return new Response(JSON.stringify({"status": "ok", "device": data.results[0]}))
        } else {
            return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the WM from the QR Code. Please try again or contact support"}))
        }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the WM from the QR Code. Please try again or contact support"}))
    }

}

