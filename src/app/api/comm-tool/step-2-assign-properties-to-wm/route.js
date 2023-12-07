import { toTimestamp } from "@/src/functions/toTimestamp"

export async function POST(req){

    const { props, meterType, id } = await req.json()

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
            "cost_per_unit": props.cost_per_unit.value,
            "cost_unit": props.cost_unit.value,
            "room_details": props.room_details.value,
            "floor": props.floor.value,
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
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
            },
            body: JSON.stringify({
                "properties": {
                    "_config": props
                }
            })
        })
        let data = await response.json()
        if(!data.properties){
            return new Response(JSON.stringify({"status": "error", "message": "There was an error updating the properties of this Water Monkey. Please try again or contact support"}))
        }
        try{
            let response1 = await fetch(`https://industrial.api.ubidots.com/api/v2.0/devices/~${id}/`, {
                method: 'PATCH',
                headers:{
                    'Content-Type':'application/json',
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                },
                body: JSON.stringify(payload)
            })
            let data1 = await response1.json()
            if(data1.properties){
                if(meterType !== undefined){
                    let now = toTimestamp(new Date())
                    try{
                        let response = await fetch(`https://industrial.api.ubidots.com/api/v1.6/devices/${id}/`, {
                            method: 'POST',
                            headers:{
                                'Content-Type':'application/json',
                                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                            },
                            body: JSON.stringify({
                                "cost_per_volume": {
                                    "timestamp": now,
                                    "value": (props.cost_unit.value === "liters") ?  props.cost_per_unit.value : (props.cost_unit.value === "m3") ? (Number(props.cost_per_unit.value)/1000): (props.cost_unit.value === "gallons") && (Number(props.cost_per_unit.value)*3.785),
                                    "context": {
                                        "metricUnit": props.cost_unit.value
                                    }
                                },
                                "meter_type": {
                                    "timestamp": now,
                                    "value": meterType
                                }
                            })
                        })
                        let data = await response.json()
                        if(data.meter_type){
                            return new Response(JSON.stringify({"status": "ok"}))
                        }else{
                            return new Response(JSON.stringify({"status": "error", "message": "There was an error writing the meter type property. Please try again or contact support"}))
                        }
                    }catch(e){
                        return new Response(JSON.stringify({"status": "error", "message": "There was an error writing the meter type property" + e +  ". Please try again or contact support"}))
                    }
                }else{
                    return new Response(JSON.stringify({"status": "ok"}))
                }
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was an error assigning the properties to the Water Monkey. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was an error assigning the properties to the Water Monkey: " + e + ". Please try again or contact support"}))
        }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "message": "There was an error assigning the properties to the Water Monkey: " + e + ". Please try again or contact support"}))
    }
}

