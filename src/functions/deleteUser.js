export default async function deleteUser(user, setLoad, setMessage, setReloadUser, reloadUser){
    setLoad(true)
    let response = await fetch (`https://cs.api.ubidots.com/api/v2.0/users/${user}`, {
        method: 'DELETE',
        headers:{
            'Content-Type':'application/json',
            'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
            // 'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
        },
    })
    if(response.ok){
        setReloadUser(!reloadUser)
        setMessage('User successfully deleted, redirecting you to Users...')
        setLoad(false)
        return {message: "user deleted"}
    } else {
        setLoad(false)
        return {message: "error"}
    }
}