export const completeUser = async(setUser, session, setLoader) => {

    let userInfo

    try{
        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/users/~${session.user.name}?fields=organizations,id,firstName,lastName,mugshotUrl`, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                // 'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            },
        })
        let data = await response.json()
        userInfo = {
            name: session.user.name,
            email: session.user.email,
            id: data.id,
            photo: data.mugshotUrl ? data.mugshotUrl : undefined,
            fistName: data.firstName,
            lastName: data.lastName,
            organizations: data.organizations,
            role: data.organizations[0].role.label
        }
    } catch(e){
        return{"status": "error", "message": "There was an error requesting the user: " + e}
    } finally{
        let monkeys = []
        let usersMain = []
        for(let i = 0; i < userInfo.organizations.length; i++){
            let users = []
            let devices = ''
            try{
                let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/?deviceType=watermonkeyv2.0&organization__id=${userInfo.organizations[i].id}&page_size=50000`, {
                    method: 'GET',
                    headers:{
                        'Content-Type':'application/json',
                        'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                        // 'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
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
                
                let response1 = await fetch(`https://cs.api.ubidots.com/api/v2.0/users/?organization__label=${userInfo.organizations[i].label}`, {
                    method: 'GET',
                    headers:{
                        'Content-Type':'application/json',
                        'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                        // 'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
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
               return {"status": "error", "message": "There was an error requesting the Water Monkey devices:" + e}
            }finally{
                if(userInfo.organizations.length === (i+1)){
                    userInfo.devices = monkeys
                    userInfo.users = usersMain
                    setUser(userInfo)
                    setTimeout(()=>{
                        setLoader(false)
                    }, 2000)
                }
            }
        }
        return {"status": "ok"}   
    }
}

