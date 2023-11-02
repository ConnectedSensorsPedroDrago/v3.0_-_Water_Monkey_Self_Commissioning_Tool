import { toTimestamp } from "./toTimestamp"

export default async function assignPropertiesToNewWM(props, meterType, id){
    let payload = {
        "properties": {
            "country": props.country.value,
            "state": props.state.value,
            "city": props.city.value,
            "zip_code": props.zip_code.value,
            "address": props.address.value,
            "building_name": props.building_name.value,
            "property_type":  props.property_type.value,
            "meter_type": props.meter_type.value,
            "zone": props.zone.value,
            "cost_per_unit": props.cost_per_unit.value,
            "cost_unit": props.cost_unit.value,
            "room_details": props.room_details.value,
            "flow_details": props.flow_details.value,
            "floor": props.floor.value,
            "unit": props.unit.value,
            "meter_brand": props.meter_brand.value,
            "meter_model": props.meter_model.value,
            "low_side": props.low_side.value,
            "high_side": props.high_side.value,
            "terms": props.terms.value,
            "commission_stage": props.commission_stage.value
        }
    }
    try{
        let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/devices/~${id}/`, {
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
            },
            body: JSON.stringify({
                "properties": {
                    "_config": props
                }
            })
        })
        let data = await response.json()
        console.log(data)
        if(!data.properties){
            return {"status": "error", "message": "There was an error updating the properties of this Water Monkey. Please try again or contact support"}
        }
        try{
            console.log(payload)
            let response1 = await fetch(`https://industrial.api.ubidots.com/api/v2.0/devices/~${id}/`, {
                method: 'PATCH',
                headers:{
                    'Content-Type':'application/json',
                    'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                },
                body: JSON.stringify(payload)
            })
            let data1 = await response1.json()
            console.log(data1)
            if(data1.properties){
                if(meterType !== undefined){
                    try{
                        let response = await fetch(`https://industrial.api.ubidots.com/api/v1.6/devices/${id}/`, {
                            method: 'POST',
                            headers:{
                                'Content-Type':'application/json',
                                'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                            },
                            body: JSON.stringify({
                                "meter_type": {
                                    "timestamp": toTimestamp(new Date()),
                                    "value": meterType
                                }
                            })
                        })
                        let data = await response.json()
                        console.log(data)
                        if(data.meter_type){
                            return {"status": "ok"}
                        }else{
                            return {"status": "error", "message": "There was an error writing the meter type property. Please try again or contact support"}
                        }
                    }catch(e){
                        console.log("There was an error writing the meter type property" + e +  ". Please try again or contact support")
                    }
                }else{
                    return {"status": "ok"}
                }
            }else{
                return {"status": "error", "message": "There was an error assigning the properties to the Water Monkey. Please try again or contact support"}
            }
        }catch(e){
            console.log("There was an error assigning the properties to the Water Monkey: " + e + ". Please try again or contact support")
        }
    }catch(e){
        console.log("There was an error assigning the properties to the Water Monkey: " + e + ". Please try again or contact support")
    }
}