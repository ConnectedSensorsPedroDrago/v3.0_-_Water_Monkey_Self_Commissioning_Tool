export default async function updateUser(user, firstName, lastName, setLoad){
    setLoad(true)
    try {
        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/users/${user}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                // 'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName
            })
        })
        let data = await response.json()
        setLoad(false)
        return { data: data }
    } catch (e) {
        console.log("There was an error updating the user's detail: " + e + " . Please try again or contact support")
    }
}