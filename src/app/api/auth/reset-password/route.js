async function getUserFromEmail(email){
    try{
        let response = await fetch('https://cs.api.ubidots.com/api/v2.0/users/?email=' + email, {
            headers: {
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            }
        })
        let data = await response.json()
        if(data.results && data.results[0] && data.results[0].email === email){
            return {"status": "ok", "id": data.results[0].id}
        }else{
            return {"status": "error", "message": "No user found with email: " + email + " . Please check it was well written and try again."}
        }
    }catch(e){
        return {"status": "error", "message":"There was an error looking for your user: " + e + ". Please try again or contact support"}
    }
}

export async function POST(req){
    const { email } = await req.json()

    let check =  await getUserFromEmail(email)
    if(check.status === "ok"){
        try{
            let response = await fetch('https://cs.api.ubidots.com/api/-/analysis/reports/6672e723ba7792000bda70a4/_/build_report/', {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "X-Auth-Token": process.env.UBIDOTS_AUTHTOKEN
                },
                "body": JSON.stringify({
                    "devices": ["63333441270475000b9cad80"],
                    "emails": email,
                    "bodyMessage": "Hi there. Please enter the following link to reset your password: https://main.d3cdq3qwwclosa.amplifyapp.com/auth/new_password/" + check.id,
                    "subject": "Connected Sensors | Password Reset",
                    "format": "pdf",
                    "timezone": "Canda/Eastern",
                    "context": {
                        "datetimeRange": {
                            "start": 1718729873000,
                            "end": 1718816273000
                        }
                    }
                })
            })
            let data = await response.json()
            console.log(data)
            if(data.task.id){
                return new Response(JSON.stringify({"status": "ok", "email": email}))
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was an error trying to send your pssword reset email. Please try again or contact support."}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was an error sending the reset password email: " + e}))
        }
    }else{
        return new Response(JSON.stringify({"status": "error", "message": response.message}))
    }
}