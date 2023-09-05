export default async function createUserWithOrgs(username, email, name, lastName, password, role, organizations, setError, setLoad){

    try{
        let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/users/`, {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                // 'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            },
            body: JSON.stringify({
                username: username, 
                email: email, 
                firstName: name, 
                lastName: lastName, 
                password: password,
            })
        })
        let data = await response.json()
        if(data.username === username){
            let reqBody = []
            if(organizations.length > 1){
                organizations.forEach(org => reqBody.push({label: org, role: role}))
            } else {
                reqBody.push({label: organizations[0], role: role})
            }
            console.log(reqBody)
            try{
                let response = await fetch (`https://industrial.api.ubidots.com/api/v2.0/users/~${username}/_/assign_organizations/`, {
                    method: 'POST',
                    headers:{
                        'Content-Type':'application/json',
                        'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                        // 'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                },
                body: JSON.stringify(reqBody)
            })
            if(response.ok){
                setLoad(false)
                return {message: "User created", id: data.id}
            } else{
                let data = await response.json()
                setLoad(false)
                setError('The user was created but there was an error assigning the organization/s to the user: ' + data.message + ' Please contact support or try again.')
                return {message: 'There was an error assigning the organization/s to the user: ' + data.message + ' Please contact support or try again.'}
            }
        }catch(e){
                setLoad(false)
                setError('The user was created but there was an error assigning the organization/s to the user: ' + e + '. Please contact support or try again.')
                return {message: 'There was an error assigning the organization/s to the user: ' + e + '. Please contact support or try again.'}
            }
        } else {
            setLoad(false)
            setError('There was an error creating the user: ' + data.detail.non_field_errors + ' Please contact support or try again.')
            return {message: 'There was an error creating the user: ' + data.detail.non_field_errors + ' Please contact support or try again.'}
        }
    } catch(e){
        setLoad(false)
        setError('There was an error creating the user: ' + e + ' Please contact support or try again.')
        return {message: 'There was an error creating the user: ' + e + ' Please contact support or try again.'}
    }
}