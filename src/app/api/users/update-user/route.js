export async function POST(req){

    const { user, firstName, lastName } = await req.json()

    try {
        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/users/${user}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName
            })
        })
        let data = await response.json()
        if(data.id === user){
            return new Response(JSON.stringify({"status": "ok", "data": data}))
        }else{
            return new Response(JSON.stringify({"status": "error", "message": "There was an error updating the user's details. Please try again or contact support"}))
        }
    } catch (e) {
        return new Response(JSON.stringify({"status": "error", "message": "There was an error updating the user's details: " + e + " . Please try again or contact support"}))
    }
}

