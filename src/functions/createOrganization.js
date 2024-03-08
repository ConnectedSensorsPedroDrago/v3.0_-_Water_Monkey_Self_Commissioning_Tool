export default async function createOrganization(name, address, description, setLoad, setError, user){
    let newOrgId
    setLoad(true)
    try{
        let response = await fetch('https://cs.api.ubidots.com/api/v2.0/organizations/', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                // 'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
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
                let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/users/~${user.name}/_/assign_organizations/`, {
                    method: 'POST',
                    headers:{
                        'Content-Type':'application/json',
                        'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                        // 'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                    },
                    body: JSON.stringify([{
                        label: name.toLowerCase().replaceAll(' ', '-'),
                        role: "super-viewer-test",
                    }])
                })
                let data = await response.json()
                if(response.ok){
                    return {message: "Org created", id: newOrgId}
                } else {
                    setError("There was an error assigning the organization to you: " + data.message + ". Please try again or contact support")
                }
            }catch(e){
                setError("There was an error assigning the organization to you. Please try again or contact support")
                return {message: "There was an error assigning the organization to you. Please try again or contact support"}
            }
        } else {
            setError("There was an error creating the organization. Please try again or contact support")
            return {message: "There was an error creating the organization. Please try again or contact support"}
        }
    }catch(e){
        setError("There was an error creating the organization: " + e + " . Please try again or contact support")
        return {message: "There was an error creating the organization: " + e + " . Please try again or contact support"}
    }finally{
        setLoad(false)
    }
}