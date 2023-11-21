export async function PATCH(req){

    const { org, address, description } = await req.json()

    let reqBody = {}
    if(address){
        reqBody.properties = {address: address}
    }
    if(description){
        reqBody.description = description
    }
    try {
        let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/organizations/${org}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            },
            body: JSON.stringify(reqBody)
        })
        let data = await response.json()
        if(data.id === org){
            return new Response(JSON.stringify({"status": "ok", "data": data}))
        }else{
            return new Response(JSON.stringify({"status": "error", "message": "There was an error updating the organization's details. Please try again or contact support"}))
        }
    } catch (e) {
        console.log("There was an error updating the organization's details: " + e + " . Please try again or contact support")
        return new Response(JSON.stringify({"status": "error", "message": "There was an error updating the organization's details: " + e + " . Please try again or contact support"}))
    }
}

