export async function POST(req){

    const { userToRemove, orgSelected } = await req.json()

    try{
        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/users/~${userToRemove}/_/remove_organizations/`, {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            },
            body: JSON.stringify([{
                label: orgSelected,
                role: "viewer"   
            }])
        })
        if(response.ok){
            return new Response(JSON.stringify({"status": "ok", "message": "User removed"}))
        } else {
            let data = await response.json()
            return new Response(JSON.stringify({"status": "error", "message": "There was an error removing the user from the organization: " + data.message + " Please try again or contact support"}))
        }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "message": "There was an error removing the user from the organization. Please try again or contact support"}))
    }
}

