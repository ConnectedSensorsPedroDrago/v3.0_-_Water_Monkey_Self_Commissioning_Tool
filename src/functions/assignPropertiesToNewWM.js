export default async function assignPropertiesToNewWM(props, id){
    try{
        let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/devices/~${id}/`, {
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
            },
            body: JSON.stringify({
                "properties": props
            })
        })
        let data = await response.json()
        console.log(data)
        if(data.properties){
            return {"status": "ok", "properties": data}
        }else{
            return {"status": "error", "message": "There was an error updating the properties of this Water Monkey. Please try again or contact support"}
        }
        console.log(data)
    }catch(e){
        console.log("There was an error assigning the properties to the Water Monkey: " + e + ". Please try again or contact support")
    }
}