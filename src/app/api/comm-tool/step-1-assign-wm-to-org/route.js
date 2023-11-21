export async function GET(req){

    let code = req.nextUrl.searchParams.get("code")
    let org = req.nextUrl.searchParams.get("org")

    try{
        let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/devices/?description=${code}`, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
            }
        })
        let data = await response.json()
        if(data.results[0]){
            try{
                let response1 = await fetch(`https://industrial.api.ubidots.com/api/v2.0/devices/~${data.results[0].label}` , {
                    method: 'PATCH',
                    headers:{
                        'Content-Type':'application/json',
                        'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                    },
                    body: JSON.stringify({
                        "organization": org
                    })
                })
                let data1 = await response1.json()
                if(data1.label === data.results[0].label && data1.organization.id === org){
                    return new Response(JSON.stringify({"status": "ok", "monkey": data1.label}))
                }else{
                    return new Response(JSON.stringify({"status": "error", "message": "There was an error assigning the Water Monkey to the selected organization: " + e + ". Please try again or contact support"}))
                }
            }catch(e){
                console.log("There was an error assigning the Water Monkey to the selected organization. Please try again or contact support")
                return new Response(JSON.stringify({"status": "error", "message": "There was an error assigning the Water Monkey to the selected organization. Please try again or contact support"}))
            }
        } else {
            return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the Water Monkey from the QR Code. Please check the code and try again or contact support"}))
        }
    }catch(e){
        console.log("There was an error requesting the WM from the QR Code. Please try again or contact support")
        return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the WM from the QR Code. Please try again or contact support"}))
    }
}

