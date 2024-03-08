export async function POST(req){

    let { name, address, description, user } = await req.json()

    let newOrgId

    try{
        let response = await fetch('https://industrial.api.ubidots.com/api/v2.0/organizations/', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            },
            body: JSON.stringify({
                label: name.toLowerCase().replaceAll(' ', '-'),
                name: name,
                description: description,
                properties:{
                    address: address
                }
            })
        })
        let data = await response.json()
        if(data.name === name){
            newOrgId = data.id
            try{
                let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/users/~${user.name}/_/assign_organizations/`, {
                    method: 'POST',
                    headers:{
                        'Content-Type':'application/json',
                        'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                    },
                    body: JSON.stringify([{
                        label: name.toLowerCase().replaceAll(' ', '-'),
                        role: "super-viewer-test",
                    }])
                })
                let data = await response.json()
                if(response.ok){
                    return new Response(JSON.stringify({"status": "ok", "message": "Org created", "id": newOrgId}))
                } else {
                    return new Response(JSON.stringify({"status": "error", "message": "There was an error assigning the organization to you: " + data.message + ". Please try again or contact support"}))
                }
            }catch(e){
                return new Response(JSON.stringify({"status": "error", "message": "There was an error assigning the organization to you. Please try again or contact support"}))
            }
        } else {
            return new Response(JSON.stringify({"status": "error", "message": "There was an error creating the organization. Please try again or contact support"}))
        }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "message": "There was an error creating the organization: " + e + " . Please try again or contact support"}))
    }
}

