export default async function assignWMToOrg(code, org){
    console.log("Code: " + code + ' | Org: ' + org)
    try{
        let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/devices/?description=${code}`, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
            }
        })
        let data = await response.json()
        // console.log(data)
        if(data.results[0]){
            try{
                let response1 = await fetch(`https://industrial.api.ubidots.com/api/v2.0/devices/~${data.results[0].label}` , {
                    method: 'PATCH',
                    headers:{
                        'Content-Type':'application/json',
                        'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                    },
                    body: JSON.stringify({
                        "organization": org
                    })
                })
                let data1 = await response1.json()
                console.log(data1)
                if(data1.label === data.results[0].label && data1.organization.id === org){
                    return {"status": "ok", "monkey": data1.label}
                }else{
                    return {"status": "error", "message": "There was an error assigning the Water Monkey to the selected organization: " + e + ". Please try again or contact support"}
                }
            }catch(e){
                console.log("There was an error assigning the Water Monkey to the selected organization. Please try again or contact support")
            }
        } else {
            return {"status": "error", "message": "There was an error requesting the Water Monkey from the QR Code. Please check the code and try again or contact support"}
        }
    }catch(e){
        console.log("There was an error requesting the WM from the QR Code. Please try again or contact support")
    }
}