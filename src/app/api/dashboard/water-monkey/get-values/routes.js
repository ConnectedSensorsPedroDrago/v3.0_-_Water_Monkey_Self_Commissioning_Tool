export async function POST(req){
    
    let device = req.nextUrl.searchParams.get("device")
    let start = req.nextUrl.searchParams.get("start")
    let end = req.nextUrl.searchParams.get("end")
    let quick = req.nextUrl.searchParams.get("quick")

    console.log("get-values")
    console.log(device)
    console.log(start)
    console.log(end)
    console.log(quick)

    let deviceData = {}

    let metric = "liters"

    // BASE URL FOR REQUESTS
    const devicesURL = "https://cs.api.ubidots.com/api/v1.6/devices";

    //GET CONSUMPTION DATA

    //Get the Total Water Consumption data
    let waterConsumption = [];
    let waterConsumptionPage = 1

    async function getWaterConsumptionData(){
        let inGallons = "water_consumption_per_update_g"
        let inLiters = "water_consumption_per_update"
        try{
            let response = await fetch(devicesURL + '/' + device + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + start + '&end=' + end + '&page=' + waterConsumptionPage + '&page_size=50000', {
                method: 'GET',
                headers: {
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                }
            })
            let data = await response.json()
            if(data.results){
                // console.log(data)
                data.results.forEach( x => {
                    waterConsumption.push(parseFloat(x.value).toFixed(2))
                })
                if(data.results.length === 50000){
                    waterConsumptionPage += 1
                    getWaterConsumptionData()
                } else {
                    let count = 0
                    if(waterConsumption[0]){
                        waterConsumption.forEach( x => count = count + Number(x))
                        deviceData.waterConsumptionLiters = count.toFixed(2)
                    }else{
                        return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the water consumption data. Please try again or contact support"}))
                    }
                    // getRunOffWaterFlowRate()
                }
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the water consumption data. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the water consumption data" + e + ". Please try again or contact support"}))
        }finally{
            getRunOffWaterFlowRate()
        }
        
    }

    //Get the Leaked Water data
    let runOffWaterFlowRate = [];
    let runOffWaterFlowRatePage = 1

    async function getRunOffWaterFlowRate(){
        let inGallons = 'leak_volume_per_update_g'
        let inLiters = 'leak_volume_per_update'
        try{
            let response = await fetch(devicesURL + '/' + device + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + start + '&end=' + end + '&page=' + runOffWaterFlowRatePage + '&page_size=50000', {
                method: 'GET',
                headers: {
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                }
            })
            let data = await response.json()
            if(data.results){
                // console.log("getRunOffWaterFlowRate()")
                data.results.forEach( x => {
                    runOffWaterFlowRate.push(parseFloat(x.value).toFixed(2))
                })
                if(data.results.length === 50000){
                    runOffWaterFlowRatePage += 1
                    getRunOffWaterFlowRate()
                } else {
                    let count = 0
                    if(runOffWaterFlowRate[0]){
                        runOffWaterFlowRate.forEach( x => count = count + Number(x))
                        deviceData.leakedWaterLiters = count.toFixed(2)
                    }else{
                        return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the water leak data. Please try again or contact support"}))
                    }
                    // getActualConspumtpionWaterFlowRate()
                }
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the water leak data. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the water leak data: " + e + ". Please try again or contact support"}))
        }finally{
            getActualConspumtpionWaterFlowRate()
        }
        
        
    }

    //Get the Actual Consuption Water data
    let actualConspumtpionWaterFlowRate = [];
    let actualConspumtpionWaterFlowRatePage = 1

    async function getActualConspumtpionWaterFlowRate(){
        let inGallons = 'actual_consumption_per_update_g'
        let inLiters = 'actual_consumption_per_update'
        try{
            let response = await fetch(devicesURL + '/' + device + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + start + '&end=' + end + '&page=' + actualConspumtpionWaterFlowRatePage + '&page_size=50000', {
                method: 'GET',
                headers: {
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                }
            })
            let data = await response.json()
            if(data.results){
                data.results.forEach( x => {
                    actualConspumtpionWaterFlowRate.push(parseFloat(x.value).toFixed(2))
                })
                if(data.results.length === 50000){
                    actualConspumtpionWaterFlowRatePage += 1
                    getRunOffWaterFlowRate()
                } else {
                    let count = 0
                    if(actualConspumtpionWaterFlowRate[0]){
                        actualConspumtpionWaterFlowRate.forEach( x => count = count + Number(x))
                        deviceData.actualWaterConsumedLiters = count.toFixed(2)
                    }else{
                        return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the water actual consumption data. Please try again or contact support"}))
                    }
                    // getTotalCostsData()
                }
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the water actual consumption data. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the water actual consumption data: " + e + ". Please try again or contact support"}))
        }finally{
            getTotalCostsData()
        }
        
    }

    //GET COST DATA

    //Get Total Cost
    let totalCostPage = 1
    let totalCost = []

    const getTotalCostsData = async () => {
        try{
            let response =  await fetch(devicesURL + '/' + device + '/water_cost_per_update/values/?start=' + start + '&end=' + end + '&page=' + totalCostPage + '&page_size=50000', {
                method: 'GET',
                headers: {
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                }
            })
            let data = await response.json()
            if(data.results){
                data.results.forEach( x => {
                    totalCost.push(parseFloat(x.value))
                })
                if(data.results.length === 50000){
                    totalCostPage += 1
                    getTotalCostsData()
                } else{
                    let count = 0
                    if(totalCost[0]){
                        totalCost.forEach(x => count = count + Number(x))
                        deviceData.actualCostPerUpdate = count.toFixed(2)
                    }else{
                        return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the total cost data. Please try again or contact support"}))
                    }
                    // getLeakCostsData()
                }
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the total cost data. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the total cost data: " + e + ". Please try again or contact support"}))
        }finally{
            getLeakCostsData()
        }
    }

    //Get Leak Cost
    let leakCostPage = 1
    let leakCost = []

    const getLeakCostsData = async () => {
        try{
            let response =  await fetch(devicesURL + '/' + device + '/leak_cost_per_update/values/?start=' + start + '&end=' + end + '&page=' + leakCostPage + '&page_size=50000', {
                method: 'GET',
                headers: {
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                }
            })
            let data = await response.json()
            if(data.results){
                data.results.forEach( x => {
                    leakCost.push(parseFloat(x.value))
                })
                if(data.results.length === 50000){
                    leakCostPage += 1
                    getLeakCostsData()
                } else{
                    let count = 0
                    if(leakCost[0]){
                        leakCost.forEach(x => count = count + Number(x))
                        deviceData.leakCostPerUpdate = count.toFixed(2)
                        getActualCostsData()
                    }else{
                        return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the leak cost data. Please try again or contact support"}))
                    }
                }
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the leak cost data. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the leak cost data" + e + ". Please try again or contact support"}))
        }finally{
            // getLeakCost()
        }
    }

    // // Get Leak Cost and Actual Consumed Water Cost
    // const getLeakCost = () => {
    //     let count = 0
    //     if(leakCost[0]){
    //         leakCost.forEach(x => count = count + Number(x))
    //         deviceData.leakCostPerUpdate = count.toFixed(2)
    //         getActualCostsData()
    //     }else{
    //         return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the leak cost data. Please try again or contact support"}))
    //     }
    // }

    // Get Actual Consumed Water Cost

    let actualCostPage = 1
    let actualCost = []

    const getActualCostsData = async () => {
        try{
            let response =  await fetch(devicesURL + '/' + device + '/actual_cost_per_update/values/?start=' + start + '&end=' + end + '&page=' + actualCostPage + '&page_size=50000', {
                method: 'GET',
                headers: {
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                }
            })
            let data = await response.json()
            if(data.results){
                data.results.forEach( x => {
                    actualCost.push(parseFloat(x.value))
                })
                if(data.results.length === 50000){
                actualCostPage += 1
                getActualCostsData()
                } else{
                    let count = 0
                    if(actualCost[0]){
                        actualCost.forEach(x => count = count + Number(x))
                        deviceData.consumedWaterCost = count.toFixed(2)
                        getLowFlowData()
                    }else{
                       return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the actual cost data. Please try again or contact support"}))
                    }
                }
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the actual cost data. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the actual cost data: " + e + ". Please try again or contact support"}))
        }finally{

        }
    }

    // const getActualCost = () => {
    //     let count = 0
    //     if(actualCost[0]){
    //         actualCost.forEach(x => count = count + Number(x))
    //         deviceData.consumedWaterCost = count.toFixed(2)
    //     }else{
    //        return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the actual cost data. Please try again or contact support"})) 
    //     }
    // }

    // GET LOW AND HIGH FLOW DATA

    // Get Low Flow 
    async function getLowFlowData(){
        try{
            let response =  await fetch(devicesURL + '/' + device + '/low_flow_water_meter_reading/values/?start=' + start + '&end=' + end + '&page=1&page_size=1', {
                method: 'GET',
                headers: {
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                }
            })
            let data = await response.json()
            if(data.results){
                deviceData.lowFlowCubicMeters = data.results[0] ? data.results[0].value.toFixed(0) : "Not found"
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the low flow data. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the low flow data: " + e + ". Please try again or contact support"}))
        }finally{
            getHighFlowData()
        }
    }

    // Get High Flow
    async function getHighFlowData(){
        try{
            let response = await fetch(`${devicesURL}/${device}/high_flow_water_meter_reading/values/?page_size=1`, {
                method: 'GET',
                headers: {
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                }
            })
            let data = await response.json()
            if(data.results){
                deviceData.highFlowCubicMeters = data.results[0].value.toFixed(0)
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the high flow data. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the high flow data: " + e + ". Please try again or contact support"}))
        }finally{
            getFlowPercentages()
        }
    }

    // Get Low and High Flow percentages
    async function getFlowPercentages(){
        try{
            let response1 =  await fetch(devicesURL + '/' + device + '/low_flow_percentage/values/?start=' + start + '&end=' + end + '&page=1&page_size=1', {
                method: 'GET',
                headers: {
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                }
            })
            let data1 = await response1.json()
            if(data1.results){
                deviceData.lowFlowRate = data1.results[0] ? parseFloat(data1.results[0].value) : "Not found"
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the low flow percentage. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the low flow percentage: " + e + ". Please try again or contact support"}))
        }finally{
            try{
                let response2 =  await fetch(devicesURL + '/' + device + '/high_flow_percentage/values/?start=' + start + '&end=' + end + '&page=1&page_size=1', {
                    method: 'GET',
                    headers: {
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                    }
                })
                let data2 = await response2.json()
                if(data2.results){
                    deviceData.highFlowRate = data2.results[0] ? parseFloat(data2.results[0].value) : "Not found"
                }else{
                    return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the high flow percentage. Please try again or contact support"}))
                }
            }catch(e){
                return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the high flow percentage: " + e + ". Please try again or contact support"}))
            }finally{
                getTotalFlowRateLpm()
            }
        }
    }

    /// GET DATA TO FILL CHART

    //Get the Total Flow Rate data and use that data to set the time frames of the chart
    let timeFrames = [];
    let totalFlowRateLpm = [];
    let totalFlowRateLpmPage = 1

    async function getTotalFlowRateLpm(){
        let inGallons = 'total_flow_rate_g'
        let inLiters = 'total_flow_rate'
        try{
            let response = await fetch(devicesURL + '/' + device + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + start + '&end=' + end + '&page=' + totalFlowRateLpmPage + '&page_size=50000', {
                method: 'GET',
                headers: {
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                }
            })
            let data = await response.json()
            if(data.results){
                data.results.forEach( x => {
                    totalFlowRateLpm.push([x.timestamp, parseFloat(x.value).toFixed(2)])
                    timeFrames.push(x.timestamp)
                })
                data.results.forEach( x => {
                    timeFrames.push(x.timestamp)
                })
                if(data.results.length === 50000){
                    totalFlowRateLpmPage += 1
                    getTotalFlowRateLpm()
                } else {
                    deviceData.waterConsumedLpm = totalFlowRateLpm
                    deviceData.chartTimeFrames = timeFrames
                }
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the total flow rate. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the total flow rate: " + e + ". Please try again or contact support"}))
        }finally{
            getGreyAreaFlowRateLpm()
        }
    }

    //Get the Total Grey Area Flow Rate data
    let greyAreaFlowRatePageLpm = 1
    let greyAreaFlowRateLpm = [];

    async function getGreyAreaFlowRateLpm(){
        let inGallons = 'grey_area_flow_rate_g'
        let inLiters = 'grey_area_flow_rate'
        try{
            let response = await fetch(devicesURL + '/' + device + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + start + '&end=' + end + '&page=' + greyAreaFlowRatePageLpm + '&page_size=50000', {
                method: 'GET',
                headers: {
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                }
            })
            let data = await response.json()
            if(data.results){
                data.results.forEach( x => {
                    if(totalFlowRateLpm.length > greyAreaFlowRateLpm.length){
                        greyAreaFlowRateLpm.push([x.timestamp, parseFloat(x.value).toFixed(2)])
                    }
                })
                if(data.results.length === 50000){
                    greyAreaFlowRatePageLpm += 1
                    getGreyAreaFlowRateLpm()
                } else {
                    deviceData.greyAreaLpm = greyAreaFlowRateLpm
                }
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the grey area flow rate. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the grey area flow rate: " + e + ". Please try again or contact support"}))
        }finally{
            getRunOffWaterFlowRateLpm()
        }
    }

    //Get the Total Run Off Water Flow Rate data
    let runOffWaterFlowRatePageLpm = 1
    let runOffWaterFlowRateLpm = [];

    async function getRunOffWaterFlowRateLpm(){
        let inGallons = 'run_off_water_flow_rate_g'
        let inLiters = 'run_off_water_flow_rate'
        try{
            let response = await fetch(devicesURL + '/' + device + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + start + '&end=' + end + '&page=' + runOffWaterFlowRatePageLpm + '&page_size=50000', {
                method: 'GET',
                headers: {
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                }
            })
            let data = await response.json()
            if(data.results){
                data.results.forEach( x => {
                    if(totalFlowRateLpm.length > runOffWaterFlowRateLpm.length){
                        runOffWaterFlowRateLpm.push([x.timestamp, parseFloat(x.value).toFixed(2)])
                    }
                })
                if(data.results.length === 50000){
                    runOffWaterFlowRatePageLpm += 1
                    getRunOffWaterFlowRateLpm()
                } else {
                    deviceData.leakedWaterLpm = runOffWaterFlowRateLpm
                }
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the run off water flow rate. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the run off water flow rate: " + e + ". Please try again or contact support"}))
        }finally{
            getWaterConsumptionShadow()
        }
    }

    //Get the Total Consumption previous period
    let waterConsumptionShadowPage = 1
    let waterConsumptionShadow = [];

    async function getWaterConsumptionShadow(){
        let inGallons = 'total_flow_rate_g'
        let inLiters = 'total_flow_rate'
        try{
            let response = await fetch(devicesURL + '/' + device + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + (start - (end - start)) + '&end=' + start + '&page=' + waterConsumptionShadowPage + '&page_size=50000', {
                method: 'GET',
                headers: {
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                }
            })
            let data = await response.json()
            if(data.results){
                let shadowTimeFrame = timeFrames.slice((timeFrames - data.results.length))  
                // let count = 0 
                for(let i = 0; i < totalFlowRateLpm.length; i++){
                    waterConsumptionShadow.push([shadowTimeFrame[i]])
                    waterConsumptionShadow[i].push(data.results[i] ? data.results[i].value.toFixed(2) : 0)
                }
                if(data.results.length === 50000){
                    waterConsumptionShadowPage += 1
                    getWaterConsumptionShadow()
                } else {
                    deviceData.waterConsumptionShadow = waterConsumptionShadow
                }
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the water consumption shadow. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the water consumption shadow: " + e + ". Please try again or contact support"}))
        }finally{
            getlowFlowSideRate()
        }
    }

    // Get Low Flow Side Rate
    let lowFlowSideRatePage = 1
    let lowFlowSideRate = []

    async function getlowFlowSideRate(){
        let inGallons = `low_flow_side_flow_rate_g`
        let inLiters = `low_flow_side_flow_rate`
        try{
            let response = await fetch(devicesURL + '/' + device + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + start + '&end=' + end + '&page=' + lowFlowSideRatePage + '&page_size=50000', {
                method: 'GET',
                headers: {
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                }
            })
            let data = await response.json()
            if(data.results){
                data.results.forEach( x => {
                    if(totalFlowRateLpm.length > lowFlowSideRate.length){
                        lowFlowSideRate.push([x.timestamp, parseFloat(x.value).toFixed(2)])
                    }
                })
                if(data.results.length === 50000){
                    lowFlowSideRatePage += 1
                    getlowFlowSideRate()
                } else {
                    deviceData.lowFlowSideRate = lowFlowSideRate
                }
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the low flow side rate. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the low flow side rate: " + e + ". Please try again or contact support"}))
        }finally{
            getHighFlowSideRate()
        }
    }

    // Get Low Flow Side Rate
    let highFlowSideRatePage = 1
    let highFlowSideRate = []

    async function getHighFlowSideRate(){
        let inGallons = `high_flow_side_flow_rate_g`
        let inLiters = `high_flow_side_flow_rate`
        try{
            let response = await fetch(devicesURL + '/' + device + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + start + '&end=' + end + '&page=' + highFlowSideRatePage + '&page_size=50000', {
                method: 'GET',
                headers: {
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                }
            })
            let data = await response.json()
            if(data.results){
                data.results.forEach( x => {
                    if(totalFlowRateLpm.length > highFlowSideRate.length){
                        highFlowSideRate.push([x.timestamp, parseFloat(x.value).toFixed(2)])
                    }
                })
                if(data.results.length === 50000){
                    highFlowSideRatePage += 1
                    getHighFlowSideRate()
                } else {
                    deviceData.highFlowSideRate = highFlowSideRate
                }
            }else{
                return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the high flow side rate. Please try again or contact support"}))
            }
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the high flow side rate: " + e + ". Please try again or contact support"}))
        }finally{
            console.log("DONE!")
            return new Response(JSON.stringify({"status": "ok", "device_data": deviceData}))
        }
    }

    getWaterConsumptionData()
// }
}