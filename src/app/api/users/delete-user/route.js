export async function DELETE(req){

    const { user } = await req.json()

    try{
        let response = await fetch (`https://industrial.api.ubidots.com/api/v2.0/users/${user}`, {
            method: 'DELETE',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            },
        })
        if(response.ok){
            return new Response(JSON.stringify({"status": "ok"}))
        } else {
            return new Response(JSON.stringify({"status": "error", "message": "There was an error deleting the user. Please try again or contact support."}))
        }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "message": "There was an error deleting the user: " + e + ". Please try again or contact support."}))
    }
    
}