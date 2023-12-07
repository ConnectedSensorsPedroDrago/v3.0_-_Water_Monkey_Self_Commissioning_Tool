export async function GET(req){
    let device = req.nextUrl.searchParams.get("device")
    let start = req.nextUrl.searchParams.get("start")
    let end = req.nextUrl.searchParams.get("end")
    let metric = req.nextUrl.searchParams.get("metric")
    let quick = req.nextUrl.searchParams.get("quick")

    let waterConsumption = [];
    let waterConsumptionPage = 1

    if(device == "undefined" || start == "undefined" || end == "undefined"){
        return new Response(JSON.stringify({"status": "error", "message": "Please select a start and end date/time or a Quick Report option."}))
    }else{
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
                    console.log(data)
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
                            // deviceData.waterConsumptionLiters = count.toFixed(2)
                        }else{
                            return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the water consumption data. Please try again or contact support"}))
                        }
                        return new Response(JSON.stringify({"status": "ok", "data": waterConsumption}))
                    }
                }else{
                    return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the water consumption data. Please try again or contact support"}))
                }
            }catch(e){
                return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the water consumption data" + e + ". Please try again or contact support"}))
            }
        }
        getWaterConsumptionData()
    }
}