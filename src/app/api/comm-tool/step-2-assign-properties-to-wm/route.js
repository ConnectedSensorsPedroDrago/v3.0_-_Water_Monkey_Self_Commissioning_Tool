import { toTimestamp } from "@/src/functions/toTimestamp"

export async function POST(req){

    const { props, meterType, id } = await req.json()

    let payload = (props.commission_stage && props.added) ? {
        "properties": {
            "country": props.country.value,
            "state": props.state.value,
            "city": props.city.value,
            "zip_code": props.zip_code.value,
            "address": props.address.value,
            "building_name": props.building_name.value,
            "property_type":  props.property_type.value,
            "cost_per_unit": props.cost_per_unit.value,
            "cost_unit": props.cost_unit.value,
            "room_details": props.room_details.value,
            "floor": props.floor.value,
            "meter_brand": props.meter_brand.value,
            "meter_model": props.meter_model.value,
            "low_side": props.low_side.value,
            "high_side": props.high_side.value,
            "commission_stage": props.commission_stage.value,
            "added": props.added.value,
            "secondary_enable": meterType == 1 ? 0 : 1,
            "initial_meter_reading_primary": null,
            "secondary_meter_reading_primary": null,
            "initial_meter_reading_secondary": null,
            "secondary_meter_reading_secondary": null,
            "primary_pulse_volume": null
        }
    }
    :
    {
        "properties": {
            "country": props.country.value,
            "state": props.state.value,
            "city": props.city.value,
            "zip_code": props.zip_code.value,
            "address": props.address.value,
            "building_name": props.building_name.value,
            "property_type":  props.property_type.value,
            "room_details": props.room_details.value,
            "floor": props.floor.value,
            "meter_brand": props.meter_brand.value,
            "meter_model": props.meter_model.value,
            "low_side": props.low_side.value,
            "high_side": props.high_side.value,
        }
    }

    try{
        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/~${id}/`, {
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
            },
            body: JSON.stringify(payload)
        })
        let data = await response.json()
        if(data.properties){
            if(meterType == 1 || meterType == 0){
                let now = toTimestamp(new Date())
                try{
                    let response = await fetch(`https://cs.api.ubidots.com/api/v1.6/devices/${id}/`, {
                        method: 'POST',
                        headers:{
                            'Content-Type':'application/json',
                            'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
                        },
                        body: JSON.stringify({
                            "meter_type": {
                                "timestamp": now,
                                "value": meterType
                            },
                            // "se": {
                            //     "timestamp": now,
                            //     "value": meterType == 1 ? 0 : 1
                            // },
                            "properties": {
                                "secondary_enable": meterType == 1 ? 0 : 1
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
                return new Response(JSON.stringify({"status": "error", "message": "There was an error writing the meter type property. Please try again or contact support"}))
            }
        }else{
            return new Response(JSON.stringify({"status": "error", "message": "There was an error assigning the properties to the Water Monkey. Please try again or contact support"}))
        }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "message": "There was an error assigning the properties to the Water Monkey: " + e + ". Please try again or contact support"}))
    }
}

