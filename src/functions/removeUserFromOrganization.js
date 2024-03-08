export default async function removeUserFromOrganization(userToRemove, setLoad, orgSelected, setError){
    setLoad(true)
    try{
        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/users/~${userToRemove}/_/remove_organizations/`, {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                // 'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            },
            body: JSON.stringify([{
                label: orgSelected,
                role: "viewer"   
            }])
        })
        let data = await response.json()
        if(response.ok){
            return {message: "User removed"}
        } else {
            setError("There was an error removing the user from the organization: " + data.message + " Please try again or contact support")
        }
    }catch(e){
        setError("There was an error removing the user from the organization. Please try again or contact support")
        return {message: "There was an error removing the user from the organization. Please try again or contact support"}
    }finally{
        setLoad(false)
    }
}