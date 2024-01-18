export async function GET(req, res){

    let user = req.nextUrl.searchParams.get("user")
    let email = req.nextUrl.searchParams.get("email")

    let userInfo

    try{
        let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/users/~${user}?fields=username,organizations,id,firstName,lastName,mugshotUrl,properties`, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            },
        })
        let data = await response.json()
        if(data && data.username === user){
            userInfo = {
                name: user,
                email: email,
                id: data.id && data.id,
                photo: data.mugshotUrl ? data.mugshotUrl : undefined,
                fistName: data.firstName ? data.firstName : '',
                lastName: data.lastName ? data.lastName : '',
                organizations: data.organizations ? data.organizations : [],
                role: (data.properties && data.properties.role) ? data.properties.role : (data.organizations && data.organizations.length > 0) ? data.organizations[0].role.label : "viewer",
                terms: (data.properties && data.properties.terms && data.properties.terms.status === "accepted") ? data.properties.terms : "not accepted"
            }
        }else{
            return new Response(JSON.stringify({"status": "error", "message": "Your user was not found in our database, please try again or contact support."}))
        }
    } catch(e){
        return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the user: " + e + ". Please try again or contact support."}))
    } finally{
        let monkeys = []
        let usersMain = []
        if(userInfo.organizations && userInfo.organizations.length > 0){
            for(let i = 0; i < userInfo.organizations.length; i++){
                let users = []
                let devices = ''
                try{
                    let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/devices/?deviceType=watermonkeyv2.0&organization__id=${userInfo.organizations[i].id}&page_size=50000`, {
                        method: 'GET',
                        headers:{
                            'Content-Type':'application/json',
                            'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                        },
                    })
                    let data = await response.json()
                    data.results.length > 0 && data.results.forEach(device => {
                        let commission_stage = device.properties.commission_stage ? JSON.parse(device.properties.commission_stage) : undefined
                        device.properties.commission_stage = commission_stage
                    })
                    monkeys.push({
                        org_id: userInfo.organizations[i].id,
                        organization: userInfo.organizations[i].name,
                        monkeys: data.results.length > 0 ? data.results : undefined
                    })
                    if(userInfo.role === 'super-viewer-test'){
                        try{
                            let response1 = await fetch(`https://industrial.api.ubidots.com/api/v2.0/users/?organization__label=${userInfo.organizations[i].label}`, {
                                method: 'GET',
                                headers:{
                                    'Content-Type':'application/json',
                                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                                },
                            })
                            let data1 = await response1.json()
                            if(data1.results){
                                users.push(data1.results)
                                data1.results.forEach(user => {
                                    if(!usersMain.some(({id}) => id === user.id)){
                                        usersMain.push(user)
                                    }
                                })
                                userInfo.organizations[i].users = users
                            }
                        }catch(e){
                            return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the users associated with the organizations tied to your user:" + e + ". Please try again or contact support."}))
                        }
                    }
                }catch(e){
                    return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the Water Monkey devices:" + e}))
                }finally{
                    if(userInfo.organizations.length === (i+1)){
                        userInfo.devices = monkeys
                        userInfo.users = usersMain
                        return new Response(JSON.stringify({"status": "ok", "user_info": userInfo}))
                    }
                }
            }
        }else{
            return new Response(JSON.stringify({"status": "ok", "user_info": userInfo}))
        }
    }
}
