export async function GET(req){

    let code = req.nextUrl.searchParams.get("code")

    try{
        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/?description=${code.toUpperCase()}`, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
            }
        })
        let data = await response.json()
        if(data.results && data.results[0] && data.results[0].description == code.toUpperCase()){
            return new Response(JSON.stringify({"status": "ok", "device": data.results[0]}))
        } else if(data.count == 0) {
            return new Response(JSON.stringify({"status": "error", "message": `We could not find a Water Monkey with the QR Code you submitted (${code.toUpperCase()}). Please try again or contact support`}))
        }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "message": `There was an error requesting the WM from the QR Code: ${e}. Please try again or contact support`}))
    }

}