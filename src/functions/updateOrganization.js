export default async function updateOrganization(org, address, description, setLoad){
    setLoad(true)
    let reqBody = {}
    if(address){
        reqBody.properties = {address: address}
    }
    if(description){
        reqBody.description = description
    }
    try {
        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/organizations/${org}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                // 'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            },
            body: JSON.stringify(reqBody)
        })
        let data = await response.json()
        return { data: data }
    } catch (e) {
        return { message: "There was an error updating the organization's details: " + e + " . Please try again or contact support" }
    }finally{
        setLoad(false)
    }
}