export async function POST(req){
    const { userToAdd, orgSelected } = await req.json()
    try{
        let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/users/~${userToAdd}/_/assign_organizations/`, {
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
        let data = await response.json()
        if(response.ok){
            return new Response(JSON.stringify({"status": "ok", "message": "User assigned"}))
        } else {
            return new Response(JSON.stringify({"status": "error", "message": "There was an error assigning the user to the organization: " + data.message + " Please try again or contact support"}))
        }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "message": "There was an error assigning the user to the organization. Please try again or contact support"}))
    }
}

