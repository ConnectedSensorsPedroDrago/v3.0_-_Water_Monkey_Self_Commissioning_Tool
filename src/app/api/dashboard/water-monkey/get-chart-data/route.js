import { toTimestamp } from "@/src/functions/toTimestamp";

export async function POST(req){
    const {label, date_start, date_end, meter_type} = await req.json()

    const metric = "liters"
    const devicesURL = "https://cs.api.ubidots.com/api/v1.6/devices";
    let deviceData = {}

    let greyAreaFlowRateLpm = [];
    let runOffWaterFlowRateLpm = [];
    let lowFlowSideRate = []
    let highFlowSideRate = []
    let newTotalFlowRate = []
    let totalFlowRateLpm = [];
    let waterConsumptionShadow = [];

    try{
        let inGallons = 'grey_area_flow_rate_g'
        let inLiters = 'grey_area_flow_rate'
        let response = await fetch(devicesURL + '/' + label+ `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + date_start + '&end=' + date_end + '&page_size=70000', {
        method: 'GET',
        headers: {
            'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
        }
        })
        let data = await response.json()
        if(data.results && data.results[0]){
            data.results.forEach( x => {
                greyAreaFlowRateLpm.push({
                    "x": x.timestamp, 
                    "y": parseFloat(x.value).toFixed(2), 
                })
            })
            deviceData.greyAreaLpm = greyAreaFlowRateLpm
        }else{
            return new Response(JSON.stringify({"status": "error", "message": "No results were found for grey area flow side rate. Please try again or contact support"}))
        }
    }catch(e){
        return new Response(JSON.stringify({"status": "error", "message": "No results were found for grey area flow side rate: " + e + ". Please try again or contact support"}))
    }finally{
        try{
            let inGallons = 'run_off_water_flow_rate_g'
            let inLiters = 'run_off_water_flow_rate'
            let response = await fetch(devicesURL + '/' + label+ `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + date_start + '&end=' + date_end + '&page_size=70000', {
                method: 'GET',
                headers: {
                    'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
                }
            })
            let data = await response.json()
            if(data.results && data.results[0]){
                data.results.forEach( x => {
                    runOffWaterFlowRateLpm.push({
                        "x": x.timestamp, 
                        "y": parseFloat(x.value).toFixed(2), 
                    })
                })
                deviceData.leakedWaterLpm = runOffWaterFlowRateLpm
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "No results were found for run off water flow side rate. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "No results were found for run off water flow side rate: " + e + ". Please try again or contact support"}))
        }finally{
            try{
                let inGallons = `low_flow_side_flow_rate_g`
                let inLiters = `low_flow_side_flow_rate`
                let response = await fetch(devicesURL + '/' + label+ `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + date_start + '&end=' + date_end + '&page_size=70000', {
                    method: 'GET',
                    headers: {
                        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
                    }
                })
                let data = await response.json()
                if(data.results && data.results[0]){
                    data.results.forEach( x => {
                        lowFlowSideRate.push({
                            "x": x.timestamp, 
                            "y": parseFloat(x.value).toFixed(2), 
                        })
                    })
                    deviceData.lowFlowSideRate = lowFlowSideRate
                }else{
                    return new Response(JSON.stringify({"status": "error", "message": "No results were found for low flow side rate. Please try again or contact support"}))
                }
            }catch(e){
                return new Response(JSON.stringify({"status": "error", "message": "No results were found for low flow side rate: " + e + ". Please try again or contact support"}))
            }finally{
                try{
                    let inGallons = `high_flow_side_flow_rate_g`
                    let inLiters = `high_flow_side_flow_rate`
                    let response = await fetch(devicesURL + '/' + label+ `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + date_start + '&end=' + date_end + '&page_size=70000', {
                        method: 'GET',
                        headers: {
                            'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
                        }
                    })
                    let data = await response.json()
                    if(data.results && data.results[0]){
                        data.results.forEach( x => {
                            highFlowSideRate.push({x: x.timestamp, y: parseFloat(x.value).toFixed(2), date: new Date(x.timestamp)})
                        })
                        deviceData.highFlowSideRate = highFlowSideRate
                        if(deviceData.meter_type === 0){
                            for(let i = 0; (lowFlowSideRate.length - (lowFlowSideRate.length - highFlowSideRate.length)) > i; i++){
                                newTotalFlowRate.push({x: lowFlowSideRate[i] === undefined ? 0 : lowFlowSideRate[i].x, y: deviceData.meterType === 0 ? (Number(lowFlowSideRate[i] === undefined ? 0 : lowFlowSideRate[i].y) + Number(highFlowSideRate[i] === undefined ? 0 : highFlowSideRate[i].y)).toFixed(2) : Number(lowFlowSideRate[i] === undefined ? 0 : lowFlowSideRate[i].y).toFixed(2)}) 
                            }
                            deviceData.waterConsumedLpm = newTotalFlowRate
                        }else{
                            try{
                                let inGallons = 'total_flow_rate_g'
                                let inLiters = 'total_flow_rate'
                                let response = await fetch(devicesURL + '/' + label+ `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + date_start + '&end=' + date_end + '&page_size=70000', {
                                    method: 'GET',
                                    headers: {
                                        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
                                    }
                                })
                                let data = await response.json()
                                if(data.results && data.results[0]){
                                    data.results.forEach( x => {
                                        totalFlowRateLpm.push({x: x.timestamp, y: parseFloat(x.value).toFixed(2)})
                                    })
                                    deviceData.waterConsumedLpm = totalFlowRateLpm
                                }else{
                                    deviceData.waterConsumedLpm = deviceData.lowFlowSideRate
                                }
                            }catch(e){
                                return new Response(JSON.stringify({"status": "error", "message": "No results were found for total flow rate: " + e + ". Please try again or contact support"}))
                            }finally{
                                let timestamp_start
                                let timestamp_end

                                if((date_end - date_start) <= 86400000){
                                    timestamp_start = Number(date_start) - 86400000
                                    timestamp_end = Number(date_end) - 86400000
                                } else if((date_end - date_start) <= 604800000 && (date_end - date_start) > 86400000){
                                    timestamp_start = Number(date_start) - (604800000)
                                    timestamp_end = Number(date_end) - (604800000)
                                }else if((date_end - date_start) > 604800000 && (date_end - date_start) < 2419200000){
                                    let start = new Date(date_start)
                                    let start_month = start.getMonth()
                                    let start_year = start.getFullYear()
                                    timestamp_start = toTimestamp(new Date((start_month === 0 ? start_year -1 : start_year) + '/' + (start_month === 0 ? 12 : start_month) + '/' + start.getDate() + ' ' + start.getHours() + ':' + start.getMinutes()))
                                    timestamp_end = timestamp_start + (date_end - date_start)
                                }else if((date_end - date_start) > 2419200000){
                                    let start = new Date(date_start)
                                    timestamp_start = toTimestamp(new Date((start.getFullYear() -1) + '/' + (start.getMonth()+1) + '/' + start.getDate() + ' ' + start.getHours() + ':' + start.getMinutes()))
                                    timestamp_end = timestamp_start + (date_end - date_start)
                                }

                                deviceData.dateRangePrevious = {start: timestamp_start, end: timestamp_end}

                                try{
                                    let inGallons = `total_flow_rate_g`
                                    let inLiters = `total_flow_rate`
                                    let response = await fetch(devicesURL + '/' + label+ `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + timestamp_start + '&end=' + timestamp_end + '&page_size=70000', {
                                    method: 'GET',
                                    headers: {
                                        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
                                    }
                                    })
                                    let data = await response.json()
                                    if(data.results && data.results[0]){
                                        data.results.forEach( x => {
                                            waterConsumptionShadow.push({
                                                x: new Date(x.timestamp), 
                                                y: parseFloat(x.value).toFixed(2), 
                                            })
                                            // waterConsumptionShadowPlus.push([new Date(x.timestamp), parseFloat(x.value * 1.15).toFixed(2)])
                                            // waterConsumptionShadowLess.push([new Date(x.timestamp), parseFloat(x.value * 0.85).toFixed(2)])
                                        })
                                        deviceData.waterConsumptionShadow = waterConsumptionShadow
                                        deviceData.dateRange = {start: date_start, end: date_end}
                                        // deviceData.waterConsumptionShadowPlus = waterConsumptionShadowPlus
                                        // deviceData.waterConsumptionShadowLess = waterConsumptionShadowLess
                                        // console.log(deviceData)
                                        return new Response(JSON.stringify({"status": "ok", "data": deviceData}))
                                    }else{
                                        return new Response(JSON.stringify({"status": "error", "message": "No results were found for total flow side rate. Please try again or contact support"}))
                                    }
                                }catch(e){
                                    return new Response(JSON.stringify({"status": "error", "message": "No results were found for total flow side rate: " + e + ". Please try again or contact support"}))
                                }
                            }
                        }
                    }else{
                        return new Response(JSON.stringify({"status": "error", "message": "No results were found for high flow side rate. Please try again or contact support"}))
                    }
                }catch(e){
                    return new Response(JSON.stringify({"status": "error", "message": "No results were found for high flow side rate: " + e + ". Please try again or contact support"}))
                }
            }
        }
    }
}