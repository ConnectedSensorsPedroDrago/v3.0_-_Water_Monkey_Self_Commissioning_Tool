export const getAlerts = async(device, setAlerts) => {
    let variables = {}
    try{
        let response = await fetch(`https://cs.ubidots.site/api/v2.0/variables/?label__in=device_offline_alert,leak_alert,leak_percentage_alert,high_usage_alert&fields=label,lastValue,device&device__label__in=${device}&page_size=50000`, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                // 'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
            },
        })
        let data = await response.json()
        data.results.forEach(variable => {
            if(variable.label === "leak_percentage_alert"){
                variables.leak_percentage_alert = variable.lastValue.value ? variable.lastValue.value : undefined
            }
            if(variable.label === "leak_alert"){
                variables.leak_alert = variable.lastValue.value ? variable.lastValue.value : undefined
            }
            if(variable.label === "high_usage_alert"){
                variables.high_usage_alert = variable.lastValue.value ? variable.lastValue.value : undefined
            }
            if(variable.label === "device_offline_alert"){
                variables.leak_percentage_alert = variable.lastValue.value ? variable.lastValue.value : undefined
            }
        })
        setAlerts(variables)
    } catch(e){
        console.log("There was an error requesting alerts: " + e)
    }
}