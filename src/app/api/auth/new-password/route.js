export async function POST(req){
    const { password, id } = await req.json()
    try{
        let response = await fetch(`https://connectedwater.ca/api/v2.0/users/${id}/_/change_password/`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "X-Auth-Token": process.env.UBIDOTS_AUTHTOKEN
            },
            "body": JSON.stringify({
                "password": password
            })
        })
        if(response.status == 204){
            return new Response(JSON.stringify({"status": "ok"}))
        }else{
            return new Response(JSON.stringify({"status": "error", "message": "There was an error creating your new password. Please try again or contact support."}))
        }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "message": "There was an error creating your new password: " + e + ". Please try again or contact support."}))
    }
}