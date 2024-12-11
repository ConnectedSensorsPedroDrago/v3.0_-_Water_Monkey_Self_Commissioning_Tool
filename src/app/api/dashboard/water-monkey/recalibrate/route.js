
export async function POST(req){

    const {
        label,
        commStage,
        meterType,
        dateFirst,
        lowSideFirst,
        lowSideFirstUnit,
        highSideFirst,
        highSideFirstUnit,
        picFirst,
        dateSecond,
        lowSideSecond,
        lowSideSecondUnit,
        highSideSecond,
        highSideSecondUnit,
        picSecond,
        primary_volume_per_pulse,
        secondary_volume_per_pulse
    } = await req.json()

    let payload = meterType === "Single" ? 
    {
        "commission_stage": JSON.stringify({
            "stage": "recalibrate",
            "first": {"date_time": dateFirst, "low": lowSideFirst, "low_unit": lowSideFirstUnit, "pic": picFirst},
            "second": {"date_time": dateSecond, "low": lowSideSecond, "low_unit": lowSideSecondUnit, "pic": picSecond},
            "primary_volume_per_pulse": primary_volume_per_pulse,
            "prev_commission_stage": JSON.parse(commStage)
        }),
    }
    : 
    {
        "commission_stage": JSON.stringify({
            "stage": "recalibrate",
            "first": {"date_time": dateFirst, "low": lowSideFirst, "low_unit": lowSideFirstUnit, "high": highSideFirst, "high_unit": highSideFirstUnit, "pic": picFirst},
            "second": {"date_time": dateSecond, "low": lowSideSecond, "low_unit": lowSideSecondUnit, "high": highSideSecond, "high_unit": highSideSecondUnit, "pic": picSecond},
            "primary_volume_per_pulse": primary_volume_per_pulse,
            "secondary_volume_per_pulse": secondary_volume_per_pulse,
            "prev_commission_stage": JSON.parse(commStage)
        }),
    }

    try{
        let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/~${label}/`, {
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN,
            },
            body: JSON.stringify({
                "properties": payload
            })
        })
        let data = await response.json()
        if(data.label && data.label === params.id){
            return new Response(JSON.stringify({"status": "ok", "data": payload}))
        }else{
            return new Response(JSON.stringify({"status": "error", "data": `There was an error writting the new readings. Please try again or contact support.`}))
        }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "data": `There was an error writting the new readings: ${e}. Please try again or contact support.`}))
    }
}