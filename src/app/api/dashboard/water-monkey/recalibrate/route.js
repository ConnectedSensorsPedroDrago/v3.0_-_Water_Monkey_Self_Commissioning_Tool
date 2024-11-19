
export async function POST(req){

    const body = await req.json()

    // console.log(body)

    let firstLowToCompare = body.lowSideFirstUnit === "m3" ? Number(body.lowSideFirst) : body.lowSideFirstUnit === "liters" ? Number(body.lowSideFirst)*0.001 : body.lowSideFirstUnit === "gallons" && Number(body.lowSideFirst)*0.00378541
    let secondLowToCompare = body.lowSideSecondUnit === "m3" ? body.lowSideSecond : body.lowSideSecondUnit === "liters" ? Number(body.lowSideSecond)*0.001 : body.lowSideSecondUnit === "gallons" && Number(body.lowSideSecond)*0.00378541
    let firstHighToCompare
    let secondHighToCompare

    if(body.meterType === 'Compound'){
        firstHighToCompare = body.highSideFirstUnit === "m3" ? Number(body.highSideFirst) : body.highSideFirstUnit === "liters" ? Number(body.highSideFirst)*0.001 : body.highSideFirstUnit === "gallons" && Number(body.highSideFirst)*0.00378541
        secondHighToCompare = body.highSideSecondUnit === "m3" ? body.highSideSecond : body.highSideSecondUnit === "liters" ? Number(body.highSideSecond)*0.001 : body.highSideSecondUnit === "gallons" && Number(body.highSideSecond)*0.00378541
    }

    let data = body.meterType === "Compound" ?
        {
            "volume_per_pulse_primary": body.volumePerPulse.primary,
            "volume_per_pulse_secondary": body.volumePerPulse.secondary,
            "first_low": Number(body.commStage.first.low_unit === "m3" ? Number(body.commStage.first.low) : body.commStage.first.low_unit === "liters" ? Number(body.commStage.first.low)*0.001 : body.commStage.first.low_unit === "gallons" && Number(body.commStage.first.low)*0.00378541),
            "first_high": Number(body.commStage.first.high_unit === "m3" ? Number(body.commStage.first.high) : body.commStage.first.high_unit === "liters" ? Number(body.commStage.first.high)*0.001 : body.commStage.first.high_unit === "gallons" && Number(body.commStage.first.high)*0.00378541),
            "second_low": Number(body.commStage.second.low_unit === "m3" ? Number(body.commStage.second.low) : body.commStage.second.low_unit === "liters" ? Number(body.commStage.second.low)*0.001 : body.commStage.second.low_unit === "gallons" && Number(body.commStage.second.low)*0.00378541),
            "second_high": Number(body.commStage.second.high_unit === "m3" ? Number(body.commStage.second.high) : body.commStage.second.high_unit === "liters" ? Number(body.commStage.second.high)*0.001 : body.commStage.second.high_unit === "gallons" && Number(body.commStage.second.high)*0.00378541),
            "third_low": Number(firstLowToCompare),
            "third_high": Number(firstHighToCompare),
            "fourth_low": Number(secondLowToCompare),
            "fourth_high": Number(secondHighToCompare),
            "commStage": {
                "1": body.commStage.first,
                "2": body.commStage.second,
                "3": {
                    "date_time": body.dateFirst,
                    "low": Number(body.lowSideFirst),
                    "low_unit": body.lowSideFirstUnit,
                    "high": Number(body.highSideFirst),
                    "high_unit": body.highSideFirstUnit,
                    "pic": body.picFirst
                },
                "4": {
                    "date_time": body.dateSecond,
                    "low": Number(body.lowSideSecond),
                    "low_unit": body.lowSideSecondUnit,
                    "high": Number(body.highSideSecond),
                    "high_unit": body.highSideSecondUnit,
                    "pic": body.picSecond
                }
            }
        }
    :  body.meterType === "Single" ?
        {
            "volume_per_pulse_primary": body.volumePerPulse.primary,
            "first_low": Number(body.commStage.first.low_unit === "m3" ? Number(body.commStage.first.low) : body.commStage.first.low_unit === "liters" ? Number(body.commStage.first.low)*0.001 : body.commStage.first.low_unit === "gallons" && Number(body.commStage.first.low)*0.00378541),
            "second_low": Number(body.commStage.second.low_unit === "m3" ? Number(body.commStage.second.low) : body.commStage.second.low_unit === "liters" ? Number(body.commStage.second.low)*0.001 : body.commStage.second.low_unit === "gallons" && Number(body.commStage.second.low)*0.00378541),
            "third_low": Number(firstLowToCompare),
            "fourth_low": Number(secondLowToCompare),
            "commStage": {
                "1": body.commStage.first,
                "2": body.commStage.second,
                "3": {
                    "date_time": body.dateFirst,
                    "low": Number(body.lowSideFirst),
                    "low_unit": body.lowSideFirstUnit,
                    "pic": body.picFirst
                },
                "4": {
                    "date_time": body.dateSecond,
                    "low": Number(body.lowSideSecond),
                    "low_unit": body.lowSideSecondUnit,
                    "pic": body.picSecond
                }
            }
        }
    :
        {
            "volume_per_pulse_primary": body.volumePerPulse.primary,
            "first_low": Number(body.commStage.first.low_unit === "m3" ? Number(body.commStage.first.low) : body.commStage.first.low_unit === "liters" ? Number(body.commStage.first.low)*0.001 : body.commStage.first.low_unit === "gallons" && Number(body.commStage.first.low)*0.00378541),
            "second_low": Number(body.commStage.second.low_unit === "m3" ? Number(body.commStage.second.low) : body.commStage.second.low_unit === "liters" ? Number(body.commStage.second.low)*0.001 : body.commStage.second.low_unit === "gallons" && Number(body.commStage.second.low)*0.00378541),
            "third_low": Number(firstLowToCompare),
            "fourth_low": Number(secondLowToCompare),
            "commStage": {
                "1": body.commStage.first,
                "2": body.commStage.second,
                "3": {
                    "date_time": body.dateFirst,
                    "low": Number(body.lowSideFirst),
                    "low_unit": body.lowSideFirstUnit,
                    "pic": body.picFirst
                },
                "4": {
                    "date_time": body.dateSecond,
                    "low": Number(body.lowSideSecond),
                    "low_unit": body.lowSideSecondUnit,
                    "pic": body.picSecond
                }
            }
        }
    

    let rounds 

    let vpp = {}
        
    if(body.meterType === "Compound"){
        rounds = [{
                "first": {
                    "date_time": data.commStage[1].date_time,
                    "low": data.commStage[1].low,
                    "low_unit": data.commStage[1].low_unit,
                    "high": data.commStage[1].high,
                    "high_unit": data.commStage[1].high_unit
                },
                "second": {
                    "date_time": data.commStage[4].date_time,
                    "low": data.commStage[4].low,
                    "low_unit": data.commStage[4].low_unit,
                    "high": data.commStage[4].high,
                    "high_unit": data.commStage[4].high_unit
                }
            },{
                "first": {
                    "date_time": data.commStage[1].date_time,
                    "low": data.commStage[1].low,
                    "low_unit": data.commStage[1].low_unit,
                    "high": data.commStage[1].high,
                    "high_unit": data.commStage[1].high_unit
                },
                "second": {
                    "date_time": data.commStage[2].date_time,
                    "low": data.commStage[2].low,
                    "low_unit": data.commStage[2].low_unit,
                    "high": data.commStage[2].high,
                    "high_unit": data.commStage[2].high_unit
                }
            },
            {
                "first": {
                    "date_time": data.commStage[2].date_time,
                    "low": data.commStage[2].low,
                    "low_unit": data.commStage[2].low_unit,
                    "high": data.commStage[2].high,
                    "high_unit": data.commStage[2].high_unit
                },
                "second": {
                    "date_time": data.commStage[3].date_time,
                    "low": data.commStage[3].low,
                    "low_unit": data.commStage[3].low_unit,
                    "high": data.commStage[3].high,
                    "high_unit": data.commStage[3].high_unit
                }
            },
            {
                "first": {
                    "date_time": data.commStage[1].date_time,
                    "low": data.commStage[1].low,
                    "low_unit": data.commStage[1].low_unit,
                    "high": data.commStage[1].high,
                    "high_unit": data.commStage[1].high_unit
                },
                "second": {
                    "date_time": data.commStage[3].date_time,
                    "low": data.commStage[3].low,
                    "low_unit": data.commStage[3].low_unit,
                    "high": data.commStage[3].high,
                    "high_unit": data.commStage[3].high_unit
                }
            }
        ]
        let i = 0
        await Promise.all(
            rounds.map(async (round) => {
                let response = await fetch('http://localhost:3000/api/comm-tool/step-3-calculate-volume-per-pulse', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        meterType: body.meterType,
                        label: body.label,
                        commStage: round
                    })
                })
                let data = await response.json()
                if(data && data.status && data.status === 'ok'){
                    vpp[i] = data.data
                    i === 0 && (vpp["pulses_edges_low"] = data.data.wu_p_sum)
                    i === 0 && (vpp["pulses_edges_high"] = data.data.wu_s_sum)
                    vpp[i].fourth_low = rounds[0].second.low
                    vpp[i].fourth_high = rounds[0].second.high
                    vpp[i].first = round.first
                    vpp[i].second = round.second
                    i = i + 1
                    let keys = Object.keys(vpp)
                    if(keys.length === 6){
                        Object.keys(vpp).forEach(function(key, index) {
                            if(key !== 'pulses_edges_high' && key !== 'pulses_edges_low'){
                                vpp[key].mrl_percentage_low = (Number(vpp[key].first.low) + ((((Number(vpp[key].second.low) - Number(vpp[key].first.low))*1000) / Number(vpp[key].wu_p_sum)) * Number(vpp["pulses_edges_low"]))) / Number(vpp[key].fourth_low)
                                vpp[key].mrl_percentage_high = (Number(vpp[key].first.high) + ((((Number(vpp[key].second.high) - Number(vpp[key].first.high))*1000) / Number(vpp[key].wu_s_sum)) * Number(vpp["pulses_edges_high"]))) / Number(vpp[key].fourth_high)
                            }
                        });
                    }
                }else{
                    return new Response(JSON.stringify({"status": "error", "message": `There was an error calculating the vpp in one of the rounds. Please try again or contact support.`}))
                }
            })
        )
        return new Response(JSON.stringify({"status": "ok", "data": vpp}))
    }else if(body.meterType === "Single"){
        rounds = [{
                "first": {
                    "date_time": data.commStage[1].date_time,
                    "low": data.commStage[1].low,
                    "low_unit": data.commStage[1].low_unit,
                },
                "second": {
                    "date_time": data.commStage[4].date_time,
                    "low": data.commStage[4].low,
                    "low_unit": data.commStage[4].low_unit,
                }
            },{
                "first": {
                    "date_time": data.commStage[1].date_time,
                    "low": data.commStage[1].low,
                    "low_unit": data.commStage[1].low_unit,
                },
                "second": {
                    "date_time": data.commStage[2].date_time,
                    "low": data.commStage[2].low,
                    "low_unit": data.commStage[2].low_unit,
                }
            },
            {
                "first": {
                    "date_time": data.commStage[2].date_time,
                    "low": data.commStage[2].low,
                    "low_unit": data.commStage[2].low_unit,
                },
                "second": {
                    "date_time": data.commStage[3].date_time,
                    "low": data.commStage[3].low,
                    "low_unit": data.commStage[3].low_unit,
                }
            },
            {
                "first": {
                    "date_time": data.commStage[1].date_time,
                    "low": data.commStage[1].low,
                    "low_unit": data.commStage[1].low_unit,
                },
                "second": {
                    "date_time": data.commStage[3].date_time,
                    "low": data.commStage[3].low,
                    "low_unit": data.commStage[3].low_unit,
                }
            }
        ]
        let i = 0
        await Promise.all(
            rounds.map(async (round) => {
                let response = await fetch('http://localhost:3000/api/comm-tool/step-3-calculate-volume-per-pulse', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        meterType: body.meterType,
                        label: body.label,
                        commStage: round
                    })
                })
                let data = await response.json()
                if(data && data.status && data.status === 'ok'){
                    vpp[i] = data.data
                    i === 0 && (vpp["pulses_edges"] = data.data.wu_p_sum)
                    vpp[i].fourth = rounds[0].second.low
                    vpp[i].first = round.first
                    vpp[i].second = round.second
                    i = i + 1
                    let keys = Object.keys(vpp)
                    if(keys.length === 5){
                        Object.keys(vpp).forEach(function(key, index) {
                            if(key !== 'pulses_edges'){
                                vpp[key].mrl_percentage_low = (Number(vpp[key].first.low) + ((((Number(vpp[key].second.low) - Number(vpp[key].first.low))*1000) / Number(vpp[key].wu_p_sum)) * Number(vpp["pulses_edges"]))) / Number(vpp[key].fourth)
                            }
                        });
                    }
                }else{
                    return new Response(JSON.stringify({"status": "error", "message": `There was an error calculating the vpp in one of the rounds. Please try again or contact support.`}))
                }
            })
        )
        return new Response(JSON.stringify({"status": "ok", "data": vpp}))
    }else{
        return new Response(JSON.stringify({"status": "error", "message": `No meter type detected.`}))
    }
}