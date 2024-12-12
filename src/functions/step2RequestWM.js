export default async function requestWM(id){
    try{
        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/~${id}/`, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
            }
        })
        let data = await response.json()
        if(data.properties){
            return {"status": "ok", "device": data}
        } else {
            return {"status": "error", "message": "There was an error retrieving the data for this Water Monkey. Please try again or contact support"}
        }
    }catch(e){
        return {"status": "error", "message": "There was an error requesting the Water Monkey data: " + e + ". Please try again or contact support"}
    }
}