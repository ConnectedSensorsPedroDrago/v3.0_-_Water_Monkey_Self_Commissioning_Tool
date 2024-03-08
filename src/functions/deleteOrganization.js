export default async function deleteOrganization(org, setMessage, setLoad, setReloadUser, setError, reloadUser){
    setLoad(true)
    try{
        let response = await fetch (`https://cs.api.ubidots.com/api/v2.0/organizations/${org}`, {
                method: 'DELETE',
                headers:{
                    'Content-Type':'application/json',
                    'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                    // 'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            },
        })
        if(response.ok){
            // setReloadUser(!reloadUser)
            // setMessage('Organization successfully deleted, redirecting you to Users...')
            // setLoad(false)
            return new Response(JSON.stringify({"status": "ok", "message": "Organization deleted"}))
        }
    }catch(e){
        // setLoad(false)
        return new Response(JSON.stringify({"status": "error", "message": "There was an error deleting the organization: " + e + " . Please try again or contact support"}))
    }
}