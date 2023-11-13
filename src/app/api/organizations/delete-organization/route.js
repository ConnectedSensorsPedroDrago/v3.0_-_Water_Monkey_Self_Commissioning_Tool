export async function DELETE(req){

    const { org } = await req.json()

    try{
        let response = await fetch (`https://industrial.api.ubidots.com/api/v2.0/organizations/${org}`, {
                method: 'DELETE',
                headers:{
                    'Content-Type':'application/json',
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            },
        })
        if(response.ok){
            return new Response(JSON.stringify({"status": "ok", "message": "Organization deleted"}))
        }
    }catch(e){
        console.log("There was an error deleting the organization: " + e + " . Please try again or contact support")
        return new Response(JSON.stringify({"status": "error", "message": "There was an error deleting the organization: " + e + " . Please try again or contact support"}))    }

}