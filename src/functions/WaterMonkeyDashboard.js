// WATER MONKEY DETAILED VIEW DASHBPARD
// STORE THE INFORMATION GATHERED FROM UBIDOTS' DASHOARD'S CONTEXT 
const deviceData = {
	organizationId: "",
    address: "",
    deviceLabel: "",
    timestamp: new Date().getTime(),
	dateRange: {
		"start": 0,
		"end": 0
	},
	//Donut Chart Percentages
	leakPercentage: [],
	//Line Chart Percentages
	waterConsumedLpm: '',
	leakedWaterLpm: '',
	greyAreaLpm: '',
    waterConsumptionShadow: '',
	chartTimeFrames: [],
	//Meter Type
	meterType: '',
	//Consuption Lts
	waterConsumptionLiters: '',
	leakedWaterLiters: '',
	actualWaterConsumedLiters: '',
	//Water Cost
	actualCostPerUpdate: '',
	leakCostPerUpdate: '',
	consumedWaterCost: '',
	//Flow in m3 and %'s
	highFlowCubicMeters: '',
	lowFlowCubicMeters: '',
	highFlowRate: '',
	lowFlowRate: '',
};

//DETERMINE TIMESTAMPS
const toTimestamp = (strDate) => {
    const dt = Date.parse(strDate);
    return dt;
}

//TIMEZONES
const timezones = [
	"UTC",
	"Canada/Atlantic",
	"Canada/Eastern",
	"Canada/Mountain",
	"Canada/Newfoundland",
	"Canada/Pacific",
	"Canada/Saskatchewan",
	"Canada/Yukon",
	"US/Alaska",
	"US/Aleutian",
	"US/Arizona",
	"US/Central",
	"US/East-Indiana",
	"US/Eastern",
	"US/Hawaii",
	"US/Indiana-Starke",
	"US/Michigan",
	"US/Mountain",
	"US/Pacific",
	"US/Pacific-New",
	"US/Samoa"
];

// TYPE OF REPORT (if custom, taking timestamps from Ubidot's context. If not, quick report: today, week, month or year)
let type = "custom"

// REPORT METRIC
let metric

// CONSUMPTION STATE
let consumption_metric = "normal"

document.querySelector('.metric').addEventListener('click', async()=>{
    waterConsumption = [];
    waterConsumptionPage = 1
    runOffWaterFlowRate = [];
    runOffWaterFlowRatePage = 1
    waterConsumption = [];
    waterConsumptionPage = 1
    totalCostPage = 1
    totalCost = []
    leakCostPage = 1
    leakCost = []
    timeFrames = [];
    totalFlowRateLpm = []
    totalFlowRateLpmPage = 1
    greyAreaFlowRatePageLpm = 1
    greyAreaFlowRateLpm = [];
    runOffWaterFlowRatePageLpm = 1
    runOffWaterFlowRateLpm = [];
    waterConsumptionShadowPage = 1
    waterConsumptionShadow = [];
    // waterConsumptionShadowLess = [];
    // waterConsumptionShadowPlus = [];
    actualConspumtpionWaterFlowRate = [];
    actualConspumtpionWaterFlowRatePage = 1
    actualCostPage = 1
    actualCost = []
    newTotalFlowRate = []
    highFlowSideRate = []
    lowFlowSideRate = []

    if(metric==="liters"){
        //Change the metric in Ubidots
        let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + '/volume_measurement_unit/values', {
            method: 'POST',
            headers: {
                'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
            },
            body: JSON.stringify({
                    "value": 1,
                    "timestamp": Date.now()

                })
        })
        let data = await response.json()
        metric = "gallons"
        document.querySelector('#selector_meassurementunit').style.transform = 'rotate(180deg)'
         //Load changes in Calculate Level Of Consuption in Gallons
        document.querySelector('.widget__actions_levelsofconsumption_colors').innerHTML = 
        `<p class="colors_1" id="hover-text"> > 211 G
            <span class="tooltip-text" id="colors_1_hint">Signlificant room for
                improvement</span>
        </p>
        <p class="colors_2" id="hover-text">133 - 211 G
            <span class="tooltip-text" id="colors_2_hint">High level of consumption</span>
        </p>
        <p class="colors_3" id="hover-text">
            < 132 G <span class="tooltip-text" id="colors_3_hint">Normal level of
                consumption</span>
        </p>`
        document.querySelector('#widget__actions_levelsofconsumption_values_value').innerHTML = '0 G'
        if(type === 'day' ||type === 'week' || type === 'month' || type === 'year'){
            loadQuickReport(type)
        } else if(type === "custom") {
            unLoadData()
            getUbidotsContext()
        }
        //Change units in the toggle to cubic
        document.querySelector('#selector_cubic_container_lorg').innerHTML = "G"
        document.querySelector('#selector_cubic_container_m3orft3').innerHTML = "ft3"
    }else{
        //Change the metric in Ubidots
        let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + '/volume_measurement_unit/values', {
            method: 'POST',
            headers: {
                'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
            },
            body: JSON.stringify({
                    "value": 0,
                    "timestamp": Date.now()

                })
        })
        let data = await response.json()
        metric = "liters"
        document.querySelector('#selector_meassurementunit').style.transform = 'rotate(0deg)'
        //Load changes in Calculate Level Of Consuption in Gallons
        document.querySelector('#widget__actions_levelsofconsumption_values_value').innerHTML = '0 L'
        document.querySelector('.colors_3').innerHTML = ' < 500 L'
        document.querySelector('.colors_2').innerHTML = '500 - 800 L'
        document.querySelector('.colors_1').innerHTML = '> 800 L'
        //Change metric in the toggle to cubic
        document.querySelector('#selector_cubic_container_lorg').innerHTML = "L"
        document.querySelector('#selector_cubic_container_m3orft3').innerHTML = "mt3"
        if(type === 'day' ||type === 'week' || type === 'month' || type === 'year'){
            loadQuickReport(type)
        } else if(type === 'custom') {
            unLoadData()
            getUbidotsContext()
        }
    }
})

// BASE URL FOR REQUESTS
const devicesURL = "https://cs.api.ubidots.com/api/v1.6/devices";

// SHOW BOTTOM CHART

let showBottomChart = false
let showPreviousPeriodChart = false

// METER TYPE
let meterReadingOutput

// ACTIONS TAB - ALERT MANAGEMENT

// Request Alert Status
let deviceOfflineAlertStatus
let highUsageAlertStatus
let leakAlertStatus
let leakPercentageStatus

// async function getAlertStatus(){
//     fetch(devicesURL + '/' + deviceData.deviceLabel + `/device_offline_alert/values`, {
//         method: 'GET',
//         headers: {
//             'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
//         }
//         })
//         .then(res => res.json())
//         .then(data => {
//             if(data.results.length < 1 || data.message === "The request was not found."){
//                 document.querySelector('#selector_deviceoffline').firstElementChild.setAttribute('fill', '#A2A2A2')
//                 deviceOfflineAlertStatus = 0
//             } else{
//                 deviceOfflineAlertStatus = data.results[0].value
//                 if(deviceOfflineAlertStatus === 1){
//                     document.querySelector('#selector_deviceoffline').setAttribute('transform', 'rotate(180)')
//                 } else{
//                     document.querySelector('#selector_deviceoffline').firstElementChild.setAttribute('fill', '#A2A2A2')
//                 }
//             }
//         })

//     fetch(devicesURL + '/' + deviceData.deviceLabel + `/high_usage_alert/values`, {
//         method: 'GET',
//         headers: {
//             'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
//         }
//         })
//         .then(res => res.json())
//         .then(data => {
//             if(data.results.length < 1 || data.message === "The request was not found."){
//                 document.querySelector('#selector_highusge').firstElementChild.setAttribute('fill', '#A2A2A2')
//                 highUsageAlertStatus = 0
//             } else {
//                 highUsageAlertStatus = data.results[0].value
//                 if(highUsageAlertStatus === 1){
//                     document.querySelector('#selector_highusge').setAttribute('transform', 'rotate(180)')
//                 } else {
//                     document.querySelector('#selector_highusge').firstElementChild.setAttribute('fill', '#A2A2A2')
//                 }
//             }
//         })

//     fetch(devicesURL + '/' + deviceData.deviceLabel + `/leak_alert/values`, {
//         method: 'GET',
//         headers: {
//             'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
//         }
//         })
//         .then(res => res.json())
//         .then(data => {
//             if(data.results.length < 1 || data.message === "The request was not found."){
//                 document.querySelector('#selector_leakalert').firstElementChild.setAttribute('fill', '#A2A2A2')
//                 leakAlertStatus = 0
//             } else {
//                 leakAlertStatus = data.results[0].value
//                 if(leakAlertStatus === 1){
//                     document.querySelector('#selector_leakalert').setAttribute('transform', 'rotate(180)')
//                 } else {
//                     document.querySelector('#selector_leakalert').firstElementChild.setAttribute('fill', '#A2A2A2')
//                 }
//             }
            
//         })

//     fetch(devicesURL + '/' + deviceData.deviceLabel + `/leak_percentage_alert/values`, {
//         method: 'GET',
//         headers: {
//             'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
//         }
//         })
//         .then(res => res.json())
//         .then(data => {
//            if(data.results.length < 1 || data.message === "The request was not found."){
//             document.querySelector('#selector_leakpercentage').firstElementChild.setAttribute('fill', '#A2A2A2')
//             leakPercentageStatus = 0
//            }else{
//              leakPercentageStatus = data.results[0].value
//             if(leakPercentageStatus === 1){
//                 document.querySelector('#selector_leakpercentage').setAttribute('transform', 'rotate(180)')
//             } else {
//                 document.querySelector('#selector_leakpercentage').firstElementChild.setAttribute('fill', '#A2A2A2')
//             }
//            }
//         })

// }

// Device Offline
document.querySelector('#selector_deviceoffline').addEventListener('click', async ()=>{
    if(deviceOfflineAlertStatus === 1){
        let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + '/device_offline_alert/values', {
        method: 'POST',
        headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
        },
        body: JSON.stringify({
                "value": 0,
                "timestamp": Date.now()

            })
        })
        let data = response.json()
        deviceOfflineAlertStatus = 0
        document.querySelector('#selector_deviceoffline').setAttribute('transform', 'rotate(0)')
        document.querySelector('#selector_deviceoffline').firstElementChild.setAttribute('fill', '#A2A2A2')
    } else if(deviceOfflineAlertStatus === 0){
        let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + '/device_offline_alert/values', {
        method: 'POST',
        headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
        },
        body: JSON.stringify({
                "value": 1,
                "timestamp": Date.now()
            })
        })
        let data = response
        deviceOfflineAlertStatus = 1
        document.querySelector('#selector_deviceoffline').setAttribute('transform', 'rotate(180)')
        document.querySelector('#selector_deviceoffline').firstElementChild.setAttribute('fill', '#292561')
    }
})

// High Usage
document.querySelector('#selector_highusge').addEventListener('click', async ()=>{
    if(highUsageAlertStatus === 1){
        let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + '/high_usage_alert/values', {
        method: 'POST',
        headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
        },
        body: JSON.stringify({
                "value": 0,
                "timestamp": Date.now()

            })
        })
        let data = response
        highUsageAlertStatus = 0
        document.querySelector('#selector_highusge').setAttribute('transform', 'rotate(0)')
        document.querySelector('#selector_highusge').firstElementChild.setAttribute('fill', '#A2A2A2')
    
    } else if(highUsageAlertStatus === 0){
        let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + '/high_usage_alert/values', {
        method: 'POST',
        headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
        },
        body: JSON.stringify({
                "value": 1,
                "timestamp": Date.now()

            })
        })
        let data = response
        highUsageAlertStatus = 1
        document.querySelector('#selector_highusge').setAttribute('transform', 'rotate(180)')
        document.querySelector('#selector_highusge').firstElementChild.setAttribute('fill', '#292561')
    }
})

// Leak ALert
document.querySelector('#selector_leakalert').addEventListener('click', async ()=>{
    if(leakAlertStatus === 1){
        let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + '/leak_alert/values', {
        method: 'POST',
        headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
        },
        body: JSON.stringify({
                "value": 0,
                "timestamp": Date.now()

            })
        })
        let data = response
        leakAlertStatus = 0
        document.querySelector('#selector_leakalert').setAttribute('transform', 'rotate(0)')
        document.querySelector('#selector_leakalert').firstElementChild.setAttribute('fill', '#A2A2A2')

    
    } else if(leakAlertStatus === 0){
        let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + '/leak_alert/values', {
        method: 'POST',
        headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
        },
        body: JSON.stringify({
                "value": 1,
                "timestamp": Date.now()

            })
        })
        let data = response
        leakAlertStatus = 1
        document.querySelector('#selector_leakalert').setAttribute('transform', 'rotate(180)')
        document.querySelector('#selector_leakalert').firstElementChild.setAttribute('fill', '#292561')
    }
})

// Leak Percentage
document.querySelector('#selector_leakpercentage').addEventListener('click', async ()=>{
    if(leakPercentageStatus === 1){
        let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + '/leak_percentage_alert/values', {
        method: 'POST',
        headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
        },
        body: JSON.stringify({
                "value": 0,
                "timestamp": Date.now()

            })
        })
        let data = response
        leakPercentageStatus = 0
        document.querySelector('#selector_leakpercentage').setAttribute('transform', 'rotate(0)')
        document.querySelector('#selector_leakpercentage').firstElementChild.setAttribute('fill', '#A2A2A2')

    
    } else if(leakPercentageStatus === 0){
        let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + '/leak_percentage_alert/values', {
        method: 'POST',
        headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
        },
        body: JSON.stringify({
                "value": 1,
                "timestamp": Date.now()

            })
        })
        let data = response
        leakPercentageStatus = 1
        document.querySelector('#selector_leakpercentage').setAttribute('transform', 'rotate(180)')
        document.querySelector('#selector_leakpercentage').firstElementChild.setAttribute('fill', '#292561')
    }
})

//CALCULATE LEAK PERCENTAGE VOLUME

// Function to get the leak percentage data
const getLeakPercentage = async () => {
	let costLeakAverage = Number(deviceData.leakCostPerUpdate) / Number(deviceData.actualCostPerUpdate)
	let average = Number((costLeakAverage * 100).toFixed(2))
	deviceData.leakPercentage = [ average, 100 - average ]
}

//GET CONSUMPTION DATA

//Get the Total Water Consumption data
let waterConsumption = [];
let waterConsumptionPage = 1

async function getWaterConsumptionData(){
    let inGallons = "water_consumption_per_update_g"
    let inLiters = "water_consumption_per_update"
    let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + deviceData.dateRange.start + '&end=' + deviceData.dateRange.end + '&page=' + waterConsumptionPage + '&page_size=20000', {
      method: 'GET',
      headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
      }
    })
	let data = await response.json()
    if(data.results){
        data.results.forEach( x => {
            waterConsumption.push(parseFloat(x.value).toFixed(2))
        })
        if(data.results.length === 20000){
            waterConsumptionPage += 1
            getWaterConsumptionData()
        } else {
            getWaterConsumptionLiters()
            getRunOffWaterFlowRate()
        }
    }
}

// Get Total Water Consumption in Liters
function getWaterConsumptionLiters(){
    let count = 0
    waterConsumption.forEach( x => count = count + Number(x))
    deviceData.waterConsumptionLiters = count.toFixed(2)
}

//Get the Leaked Water data
let runOffWaterFlowRate = [];
let runOffWaterFlowRatePage = 1

async function getRunOffWaterFlowRate(){
    let inGallons = 'leak_volume_per_update_g'
    let inLiters = 'leak_volume_per_update'
	let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + deviceData.dateRange.start + '&end=' + deviceData.dateRange.end + '&page=' + runOffWaterFlowRatePage + '&page_size=20000', {
      method: 'GET',
      headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
      }
    })
	let data = await response.json()
		data.results.forEach( x => {
			runOffWaterFlowRate.push(parseFloat(x.value).toFixed(2))
	    })
	if(data.results.length === 20000){
		runOffWaterFlowRatePage += 1
		getRunOffWaterFlowRate()
	} else {
        getRunOffWaterLiters()
		getActualConspumtpionWaterFlowRate()
	}
}

// Get Leaked Water in Liters
function getRunOffWaterLiters(){
    let count = 0
    runOffWaterFlowRate.forEach( x => count = count + Number(x))
    deviceData.leakedWaterLiters = count.toFixed(2)
}

//Get the Actual Consuption Water data
let actualConspumtpionWaterFlowRate = [];
let actualConspumtpionWaterFlowRatePage = 1

async function getActualConspumtpionWaterFlowRate(){
    let inGallons = 'actual_consumption_per_update_g'
    let inLiters = 'actual_consumption_per_update'
	let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + deviceData.dateRange.start + '&end=' + deviceData.dateRange.end + '&page=' + actualConspumtpionWaterFlowRatePage + '&page_size=20000', {
      method: 'GET',
      headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
      }
    })
	let data = await response.json()
		data.results.forEach( x => {
			actualConspumtpionWaterFlowRate.push(parseFloat(x.value).toFixed(2))
	})
	if(data.results.length === 20000){
		actualConspumtpionWaterFlowRatePage += 1
		getRunOffWaterFlowRate()
	} else {
        getActualConspumtpionLiters()
		getTotalCostsData()
	}
}

function getActualConspumtpionLiters(){
    let count = 0
    actualConspumtpionWaterFlowRate.forEach( x => count = count + Number(x))
    deviceData.actualWaterConsumedLiters = count.toFixed(2)
}

//GET COST DATA

//Get Total Cost
let totalCostPage = 1
let totalCost = []

const getTotalCostsData = async () => {
  let response =  await fetch(devicesURL + '/' + deviceData.deviceLabel + '/water_cost_per_update/values/?start=' + deviceData.dateRange.start + '&end=' + deviceData.dateRange.end + '&page=' + totalCostPage + '&page_size=20000', {
      method: 'GET',
      headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
      }
    })
    let data = await response.json()
    data.results.forEach( x => {
        totalCost.push(parseFloat(x.value))
    })
	
    if(data.results.length === 20000){
      totalCostPage += 1
      getTotalCostsData()
    } else{
		getTotalCost()
		getLeakCostsData()
	}
}

const getTotalCost = () => {
    let count = 0
    totalCost.forEach(x => count = count + Number(x))
    deviceData.actualCostPerUpdate = count.toFixed(2)
}

//Get Leak Cost
let leakCostPage = 1
let leakCost = []

const getLeakCostsData = async () => {
  let response =  await fetch(devicesURL + '/' + deviceData.deviceLabel + '/leak_cost_per_update/values/?start=' + deviceData.dateRange.start + '&end=' + deviceData.dateRange.end + '&page=' + leakCostPage + '&page_size=20000', {
      method: 'GET',
      headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
      }
    })
    let data = await response.json()
    data.results.forEach( x => {
        leakCost.push(parseFloat(x.value))
    })
	
    if(data.results.length === 20000){
      leakCostPage += 1
      getLeakCostsData()
    } else{
		getLeakCost()
		getLeakPercentage()
	}
}

// Get Leak Cost and Actual Consumed Water Cost
const getLeakCost = () => {
    let count = 0
    leakCost.forEach(x => count = count + Number(x))
    deviceData.leakCostPerUpdate = count.toFixed(2)
    getActualCostsData()
}

// Get Actual Consumed Water Cost

let actualCostPage = 1
let actualCost = []

const getActualCostsData = async () => {
  let response =  await fetch(devicesURL + '/' + deviceData.deviceLabel + '/actual_cost_per_update/values/?start=' + deviceData.dateRange.start + '&end=' + deviceData.dateRange.end + '&page=' + actualCostPage + '&page_size=20000', {
      method: 'GET',
      headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
      }
    })
    let data = await response.json()
    data.results.forEach( x => {
        actualCost.push(parseFloat(x.value))
    })
	
    if(data.results.length === 20000){
      actualCostPage += 1
      getActualCostsData()
    } else{
		getActualCost()
		getGreyAreaFlowRateLpm()
	}
}

const getActualCost = () => {
    let count = 0
    actualCost.forEach(x => count = count + Number(x))
    deviceData.consumedWaterCost = count.toFixed(2)
}

/// GET DATA TO FILL CHART

//Get the Total Grey Area Flow Rate data
let greyAreaFlowRatePageLpm = 1
let greyAreaFlowRateLpm = [];

async function getGreyAreaFlowRateLpm(){
    let inGallons = 'grey_area_flow_rate_g'
    let inLiters = 'grey_area_flow_rate'
	let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + deviceData.dateRange.start + '&end=' + deviceData.dateRange.end + '&page=' + greyAreaFlowRatePageLpm + '&page_size=20000', {
      method: 'GET',
      headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
      }
    })
	let data = await response.json()
	data.results.forEach( x => {
			greyAreaFlowRateLpm.push({
                "x": x.timestamp, 
                "y": parseFloat(x.value).toFixed(2), 
            })
	})
	if(data.results.length === 20000){
		greyAreaFlowRatePageLpm += 1
		getGreyAreaFlowRateLpm()
	} else {
    deviceData.greyAreaLpm = greyAreaFlowRateLpm
		getRunOffWaterFlowRateLpm()
	}
}

//Get the Total Run Off Water Flow Rate data
let runOffWaterFlowRatePageLpm = 1
let runOffWaterFlowRateLpm = [];

async function getRunOffWaterFlowRateLpm(){
    let inGallons = 'run_off_water_flow_rate_g'
    let inLiters = 'run_off_water_flow_rate'
	let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + deviceData.dateRange.start + '&end=' + deviceData.dateRange.end + '&page=' + runOffWaterFlowRatePageLpm + '&page_size=20000', {
      method: 'GET',
      headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
      }
    })
	let data = await response.json()
		data.results.forEach( x => {
			runOffWaterFlowRateLpm.push({
                "x": x.timestamp, 
                "y": parseFloat(x.value).toFixed(2), 
            })
	})
	if(data.results.length === 20000){
		runOffWaterFlowRatePageLpm += 1
		getRunOffWaterFlowRateLpm()
	} else {
    deviceData.leakedWaterLpm = runOffWaterFlowRateLpm
        getlowFlowSideRate()
	}
}


// Get Low Flow Side Rate
let lowFlowSideRatePage = 1
let lowFlowSideRate = []


async function getlowFlowSideRate(){
    let inGallons = `low_flow_side_flow_rate_g`
    let inLiters = `low_flow_side_flow_rate`
    let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + deviceData.dateRange.start + '&end=' + deviceData.dateRange.end + '&page=' + lowFlowSideRatePage + '&page_size=20000', {
      method: 'GET',
      headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
      }
    })
    let data = await response.json()
    data.results.forEach( x => {
			lowFlowSideRate.push({
                "x": x.timestamp, 
                "y": parseFloat(x.value).toFixed(2), 
            })
	})
    if(data.results.length === 20000){
		lowFlowSideRatePage += 1
		getlowFlowSideRate()
	} else {
        deviceData.lowFlowSideRate = lowFlowSideRate
        getHighFlowSideRate()
	}
}

// Get High Flow Side Rate
let highFlowSideRatePage = 1
let highFlowSideRate = []

let newTotalFlowRate = []

async function getHighFlowSideRate(){
    let inGallons = `high_flow_side_flow_rate_g`
    let inLiters = `high_flow_side_flow_rate`
    let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + deviceData.dateRange.start + '&end=' + deviceData.dateRange.end + '&page=' + highFlowSideRatePage + '&page_size=20000', {
      method: 'GET',
      headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
      }
    })
    let data = await response.json()
    data.results.forEach( x => {
			highFlowSideRate.push({x: x.timestamp, y: parseFloat(x.value).toFixed(2), date: new Date(x.timestamp)})
	})
    if(data.results.length === 20000){
		highFlowSideRatePage += 1
		getHighFlowSideRate()
	} else {
        deviceData.highFlowSideRate = highFlowSideRate
        if(deviceData.meterType === 0){
            for(let i = 0; (lowFlowSideRate.length - (lowFlowSideRate.length - highFlowSideRate.length)) > i; i++){
                newTotalFlowRate.push({x: lowFlowSideRate[i] === undefined ? 0 : lowFlowSideRate[i].x, y: deviceData.meterType === 0 ? (Number(lowFlowSideRate[i] === undefined ? 0 : lowFlowSideRate[i].y) + Number(highFlowSideRate[i] === undefined ? 0 : highFlowSideRate[i].y)).toFixed(2) : Number(lowFlowSideRate[i] === undefined ? 0 : lowFlowSideRate[i].y).toFixed(2)}) 
            }
            deviceData.waterConsumedLpm = newTotalFlowRate
            getWaterConsumptionShadow()
        }else{
            deviceData.waterConsumedLpm = lowFlowSideRate
            // let totalFlowRateLpm = [];
            // let totalFlowRateLpmPage = 1

            // async function getTotalFlowRateLpm(){
            //     let inGallons = 'total_flow_rate_g'
            //     let inLiters = 'total_flow_rate'
            //     let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + deviceData.dateRange.start + '&end=' + deviceData.dateRange.end + '&page=' + totalFlowRateLpmPage + '&page_size=20000', {
            //     method: 'GET',
            //     headers: {
            //         'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
            //     }
            //     })
            //     let data = await response.json()
            //     console.log(data)
            //     data.results.forEach( x => {
            //         totalFlowRateLpm.push({x: x.timestamp, y: parseFloat(x.value).toFixed(2)})
            //     })
            //     if(data.results.length === 20000){
            //         totalFlowRateLpmPage += 1
            //         getTotalFlowRateLpm()
            //     } else {
            //         deviceData.waterConsumedLpm = totalFlowRateLpm
                    getWaterConsumptionShadow()
            //     }
            // }
            // getTotalFlowRateLpm()
        }
        
	}
}

//Get the Total Consumption previous period
let waterConsumptionShadowPage = 1
let waterConsumptionShadow = [];
// let waterConsumptionShadowPlus = []
// let waterConsumptionShadowLess =[]

async function getWaterConsumptionShadow(){

    let timestamp_start
    let timestamp_end

    if((deviceData.dateRange.end - deviceData.dateRange.start) <= 86400000){
        timestamp_start = Number(deviceData.dateRange.start) - 86400000
        timestamp_end = Number(deviceData.dateRange.end) - 86400000
    } else if((deviceData.dateRange.end - deviceData.dateRange.start) <= 604800000 && (deviceData.dateRange.end - deviceData.dateRange.start) > 86400000){
        timestamp_start = Number(deviceData.dateRange.start) - (604800000)
        timestamp_end = Number(deviceData.dateRange.end) - (604800000)
    }else if((deviceData.dateRange.end - deviceData.dateRange.start) > 604800000 && (deviceData.dateRange.end - deviceData.dateRange.start) < 2419200000){
        let start = new Date(deviceData.dateRange.start)
        let start_month = start.getMonth()
        let start_year = start.getFullYear()
        timestamp_start = toTimestamp(new Date((start_month === 0 ? start_year -1 : start_year) + '/' + (start_month === 0 ? 12 : start_month) + '/' + start.getDate() + ' ' + start.getHours() + ':' + start.getMinutes()))
        timestamp_end = timestamp_start + (deviceData.dateRange.end - deviceData.dateRange.start)
    }else if((deviceData.dateRange.end - deviceData.dateRange.start) > 2419200000){
        let start = new Date(deviceData.dateRange.start)
        timestamp_start = toTimestamp(new Date((start.getFullYear() -1) + '/' + (start.getMonth()+1) + '/' + start.getDate() + ' ' + start.getHours() + ':' + start.getMinutes()))
        timestamp_end = timestamp_start + (deviceData.dateRange.end - deviceData.dateRange.start)
    }

    deviceData.dateRangePrevious = {start: timestamp_start, end: timestamp_end}

    let inGallons = `total_flow_rate_g`
    let inLiters = `total_flow_rate`

	let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + timestamp_start + '&end=' + timestamp_end + '&page=' + waterConsumptionShadowPage + '&page_size=20000', {
      method: 'GET',
      headers: {
        'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
      }
    })
	let data = await response.json()
    data.results.forEach( x => {
        waterConsumptionShadow.push({
            x: new Date(x.timestamp), 
            y: parseFloat(x.value).toFixed(2), 
        })
        // waterConsumptionShadowPlus.push([new Date(x.timestamp), parseFloat(x.value * 1.15).toFixed(2)])
        // waterConsumptionShadowLess.push([new Date(x.timestamp), parseFloat(x.value * 0.85).toFixed(2)])
    })

	if(data.results.length === 20000){
		waterConsumptionShadowPage += 1
		getWaterConsumptionShadow()
	} else {
        deviceData.waterConsumptionShadow = waterConsumptionShadow
        // deviceData.waterConsumptionShadowPlus = waterConsumptionShadowPlus
        // deviceData.waterConsumptionShadowLess = waterConsumptionShadowLess
        loadData()
	}
}


// LOAD CHARTS

function loadCharts(){

    let chartWeekendsStart = []
    let chartWeekendsEnd = []

    deviceData.waterConsumedLpm.forEach(set => {
        let day = new Date(set.x).getDay()
        if(day === 6){
            let weekendDate = new Date(set.x)
            let processedWeekendDateStart = weekendDate.getFullYear() + '/' + (weekendDate.getMonth() +1) + '/' + weekendDate.getDate()
            let processedWeekendDateEnd = weekendDate.getFullYear() + '/' + (weekendDate.getMonth() +1) + '/' + (weekendDate.getDate() +1)
            if(!chartWeekendsStart.includes(processedWeekendDateStart)){
                chartWeekendsStart.push(processedWeekendDateStart)
            }
            if(!chartWeekendsEnd.includes(processedWeekendDateEnd)){
                chartWeekendsEnd.push(processedWeekendDateEnd)
            }
        }
    })

    // Weekend Highligther
    const weekendHighlighter = {
        id: 'weekendHighlighter',
        beforeDatasetsDraw(chart, args, pluginOptions){
            const { ctx, chartArea: {top, bottom, left, right, width, height}, scales: {x, y} } = chart;
            for(let i = 0; i < pluginOptions.startDate.length; i++){
                const startDate = new Date(pluginOptions.startDate[i]).setHours(0, 0, 0, 0);
                const endDate = new Date(pluginOptions.endDate[i]).setHours(23, 59, 59, 999);
                ctx.fillStyle = 'rgba(255, 133, 0, 0.1)'
                ctx.fillRect(x.getPixelForValue(startDate), top, x.getPixelForValue(endDate) - x.getPixelForValue(startDate), height)
            }
        }
    }

    let chartDateNightStart = []
    let chartDateNightEnd = []

    deviceData.waterConsumedLpm.forEach(set => {
        let weekDate = new Date(set.x)
        let processedWeekDateStart = weekDate.getFullYear() + '/' + (weekDate.getMonth() +1) + '/' + weekDate.getDate()
        let processedWeekDateEnd = weekDate.getFullYear() + '/' + (weekDate.getMonth() +1) + '/' + (weekDate.getDate() +1)
        if(!chartDateNightStart.includes(processedWeekDateStart)){
            chartDateNightStart.push(processedWeekDateStart)
        }
        if(!chartDateNightEnd.includes(processedWeekDateEnd)){
            chartDateNightEnd.push(processedWeekDateEnd)
        }
    })

    // Day/Night Highligther
    const dayNightHighlighter = {
        id: 'dayNightHighlighter',
        beforeDatasetsDraw(chart, args, pluginOptions){
            const { ctx, chartArea: {top, bottom, left, right, width, height}, scales: {x, y} } = chart;
            for(let i = 0; i < pluginOptions.startDate.length; i++){
                const startDate = new Date(pluginOptions.startDate[i]).setHours(23, 59, 59, 999);
                const endDate = new Date(pluginOptions.endDate[i]).setHours(6, 0, 0, 0);
                ctx.fillStyle = 'rgba(0, 43, 255, 0.1)'
                ctx.fillRect(x.getPixelForValue(startDate), top, x.getPixelForValue(endDate) - x.getPixelForValue(startDate), height)
            }
        }
    }

	// Donut chart configuration
	var donutChartConfig = {
			series: [Number(deviceData.leakPercentage[0]), Number(deviceData.leakPercentage[1])],
			labels: ['Leaked Water', 'Consumed Water'],
			chart: {
			type: 'donut',
		},
		responsive: [{
			breakpoint: 580,
			options: {
				chart: {
					width: 150
				},
			}
		}],
		legend: {
			show: false,
		},
		dataLabels: {
			enabled: false
		},
		colors: ['#E8D12A', '#292561']
	};

	// Donut chart display
	var donutChart = new ApexCharts(document.querySelector(".widget__panel_chart_chart"), donutChartConfig);
	donutChart.render();

    // MAIN Line Chart Confirguration

    let ctx = document.querySelector('#chart_1').getContext("2d")
    Chart.defaults.font.family = 'Fira Sans'
    var myChart1 = new Chart(ctx, {
            default:{
                fonts: {
                    labels: 'Fira Sans'
                }
            },
            data: {
                datasets: [
                    {
                        label: 'Previous Period Consumption',
                        data: deviceData.waterConsumptionShadow,
                        tension: 0.2,
                        backgroundColor: '#00935B',
                        type: "line",
                        borderWidth: 0.8,
                        borderColor: '#00935B',
                        xAxisID: "xAxes2"
                    },
                    // {
                    //     label: 'Abnornal High',
                    //     data: deviceData.waterConsumptionShadowPlus,
                    //     tension: 0.2,
                    //     backgroundColor: '#91298C',
                    //     type: "line",
                    //     borderWidth: 0.8,
                    //     borderColor: '#91298C',
                    //     xAxisID: "xAxes2"
                    // },
                    // {
                    //     label: 'Abnormal Low',
                    //     data: deviceData.waterConsumptionShadowLess,
                    //     tension: 0.2,
                    //     backgroundColor: '#91298C',
                    //     type: "line",
                    //     borderWidth: 0.8,
                    //     borderColor: '#91298C',
                    //     xAxisID: "xAxes2"
                    // },
                    {
                        label: 'Grey Zone',
                        data: deviceData.greyAreaLpm,
                        tension: 0.2,
                        backgroundColor: '#838689',
                        type: "line",
                        fill: true,
                    },
                    {
                        label: 'Leaked Water',
                        data: deviceData.leakedWaterLpm,
                        tension: 0.2,
                        backgroundColor: '#E8D12A',
                        type: "line",
                        fill: true,
                    },
                    {
                        label: 'Consumed Water',
                        data: deviceData.waterConsumedLpm,
                        tension: 0.2,
                        backgroundColor: '#292561',
                        type: "line",
                        fill: true,
                    },
                ]
            },
            options: {
                commonUpdate: true,
                elements: {
                    point:{
                        radius: 0.8
                    }
                },
                scales: {
                    x: {
                        min: deviceData.dateRange.start,
                        max: deviceData.dateRange.end,
                        offset: true,
                        type: 'time',
                        time: {
                            displayFormat: 'MM-dd hh:mm'
                        },
                        ticks: {
                            major: {
                                enabled: true
                            },
                            font: (context) => {
                                const boldedTicks = context.tick && context.tick.major ? 'bold' : '';
                                return { weight: boldedTicks, color: "#000000" }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Orange: Weekend days | Blue: Period of average minimum flow measured',
                            color: '#333333',
                            font:{
                                weight: "bold",
                            }
                        },
                        grid: {
                            display: false,
                        }
                    },
                    xAxes2: {
                        min: deviceData.dateRangePrevious.start,
                        max: deviceData.dateRangePrevious.end,
                        offset: true,
                        position: 'top',
                        type: 'time',
                        time: {
                            displayFormat: 'MM-dd hh:mm',
                        },
                        ticks: {
                            major: {
                                enabled: true
                            },
                            font: (context) => {
                                const boldedTicks = context.tick && context.tick.major ? 'bold' : '';
                                return { weight: boldedTicks, color: "#000000" }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Previous Period',
                            color: '#333333',
                            font:{
                                weight: "bold",
                            }
                        },
                        grid: {
                            display: false,
                        }
                    },
                    y: {
                        min: 0,
                        title: {
                            display: true,
                            text: metric === 'liters' ? 'Flow Rate (LPM)' : 'Flow Rate (GPM)',
                            color: '#333333',
                            font:{
                                weight: "bold",
                            }
                        },
                        time:{
                            displayFormats: {
                                day: 'MM-dd hh:mm'
                            },
                            tooltipFormat: 'MM-dd hh:mm'
                        }
                    }
                },
                plugins: {
                    weekendHighlighter: {
                        startDate: chartWeekendsStart,
                        endDate: chartWeekendsEnd 
                    },
                    dayNightHighlighter: {
                        startDate: chartDateNightStart,
                        endDate: chartDateNightEnd 
                    },
                    legend: {
                        position: "bottom",
                        labels: {
                            boxWidth: 12,
                            pointStyle: "circle",
                            useBorderRadius: true,
                            borderRadius: 6,
                        },
                    },
                    zoom: {
                        zoom: {
                            drag: {
                                enabled: true
                            },
                            mode: 'x',
                            onZoomComplete({chart}) {
                                if (!chart.options.commonUpdate) {
                                    return;
                                }
                                for (const k of Object.keys(Chart.instances)) {
                                    const c = Chart.instances[k];
                                    if (c.id !== chart.id && c.options.plugins.zoom.pan && c.options.commonUpdate) {
                                        c.options.scales.x.min = Math.trunc(chart.scales.x.min);
                                        c.options.scales.x.max = Math.trunc(chart.scales.x.max);
                                        c.update();
                                    }
                                }
                            }
                        },
                        pan: {
                            enabled: true,
                            mode: 'x',
                        },
                        
                    }
                }
            },
            plugins: [weekendHighlighter, dayNightHighlighter]
    })

    if(deviceData.meterType === 1){
        // HF vs LF Area chart
        let ctx2 = document.querySelector('#chart_3').getContext("2d")
        Chart.defaults.font.family = 'Fira Sans'
        var myChart2 = new Chart(ctx2, {
                default:{
                    fonts: {
                        labels: 'Fira Sans'
                    }
                },
                data: {
                    datasets: [
                        {
                            label: 'High Flow Rate',
                            data: deviceData.highFlowSideRate,
                            tension: 0.2,
                            backgroundColor: '#91298C',
                            type: "line",
                            fill: true,
                        },
                        {
                            label: 'Low Flow Rate',
                            data: deviceData.lowFlowSideRate,
                            tension: 0.2,
                            backgroundColor: '#00935B',
                            type: "line",
                            fill: true,
                        },
                    ]
                },
                options: {
                    commonUpdate: true,
                    elements: {
                        point:{
                            radius: 0.8
                        }
                    },
                    scales: {
                        x: {
                            min: deviceData.dateRange.start,
                            max: deviceData.dateRange.end,
                            type: 'time',
                            time: {
                                displayFormat: 'MM-dd hh:mm'
                            },
                            ticks: {
                                major: {
                                    enabled: true
                                },
                                font: (context) => {
                                    const boldedTicks = context.tick && context.tick.major ? 'bold' : '';
                                    return { weight: boldedTicks, color: "#333333" }
                                }
                            },
                            title: {
                                display: true,
                                text: 'Date (orange: weekends | blue: night time 12pm - 6am)',
                                color: '#333333',
                                font:{
                                    weight: "bold",
                                }
                            },
                            grid: {
                                display: false,
                            }
                        },
                        y: {
                            min: 0,
                            stacked: true,
                            title: {
                                display: true,
                                text: metric === 'liters' ? 'Flow Rate (LPM)' : 'Flow Rate (GPM)',
                                color: '#333333',
                                font:{
                                    weight: "bold",
                                }
                            },
                            time:{
                                displayFormats: {

                                    day: 'MM-dd hh:mm'
                                },
                                tooltipFormat: 'MM-dd hh:mm'
                            }
                        }
                    },
                    plugins: {
                            weekendHighlighter: {
                                startDate: chartWeekendsStart,
                                endDate: chartWeekendsEnd 
                            },
                            dayNightHighlighter: {
                                startDate: chartDateNightStart,
                                endDate: chartDateNightEnd 
                            },
                            legend: {
                                position: "bottom",
                                labels: {
                                    boxWidth: 12,
                                    pointStyle: "circle",
                                    useBorderRadius: true,
                                    borderRadius: 6
                                },
                            },
                            zoom: {
                                zoom: {
                                    drag: {
                                        enabled: true
                                    },
                                    mode: 'x',
                                    onZoomComplete({chart}) {
                                        if (!chart.options.commonUpdate) {
                                            return;
                                        }
                                        for (const k of Object.keys(Chart.instances)) {
                                            const c = Chart.instances[k];
                                            if (c.id !== chart.id && c.options.plugins.zoom.pan && c.options.commonUpdate) {
                                                c.options.scales.x.min = Math.trunc(chart.scales.x.min);
                                                c.options.scales.x.max = Math.trunc(chart.scales.x.max);
                                                c.update();
                                            }
                                        }
                                    }
                                },
                                pan: {
                                    enabled: true,
                                    mode: 'x',
                                },
                                
                            }
                        }
                    },
                    plugins: [weekendHighlighter, dayNightHighlighter]
        })
    }
    // RESET CHARTS

    document.querySelector('.reset_zoom').addEventListener('click', ()=>{
        myChart1.resetZoom()
        myChart2.resetZoom()
    })
}

// UNLOAD DATA

function unLoadData(){
    // Unload ML Stats
    document.querySelector('#stats-avg').innerHTML = 0
    document.querySelector('#stats-highest').innerHTML = 0
    document.querySelector('#stats-lowest').innerHTML = 0
    // Disable cubic selector
    document.querySelector('#selector_cubic_container').style.display = 'none'
    // Level of Consuption Number
    document.querySelector('#widget__actions_levelsofconsumption_values_value').style.color = '#292561'
    document.querySelector('#number_of_units').value = ""
    //Unload Datepicker
    document.querySelector('.widget__datepicker_datepicker').style.visibility = 'hidden'
    //Unload Charts
    document.querySelector('#chart_1').remove()
    document.querySelector('.chart_3').remove()
    document.querySelector('#chart_3_title').remove()
    document.querySelector('.widget__panel_chart_chart').remove()
    // Unload Cost Data
	let consumedWaterCostOutput = document.querySelector('#cost-consumed')
	consumedWaterCostOutput.innerHTML = '$ 0'
	let leakCostOutput = document.querySelector('#cost-leak')
	leakCostOutput.innerHTML = '$ 0'
	let costPaidOutput = document.querySelector('#cost-paid')
	costPaidOutput.innerHTML = '$ 0'
    // Unload Consumption Data
	let waterConsumedOutput = document.querySelector('#water-consumed')
	waterConsumedOutput.innerHTML = 0
	let leakedWaterLitersOutput = document.querySelector('#water-leaked')
	leakedWaterLitersOutput.innerHTML = 0
	let actualWaterConsumedLitersOutput = document.querySelector('#water-used')
	actualWaterConsumedLitersOutput.innerHTML = 0
    // Load Low Flow Percentage (colored accordingly)
    let highFlowOutput = document.querySelector('.widget__panel_readings_compound_title_high')
    highFlowOutput.innerHTML = ''
	let lowFlowOutput = document.querySelector(deviceData.meterType == 0 ? '.widget__panel_readings_compound_title_low' : '#widget__panel_readings_single_value_number')
    lowFlowOutput.innerHTML = ''
    // Unload Meter Readigs (previously defined in function to determine "single" or "compound")
	meterReadingOutput.style.display = "none"
    // Show Loader for Donut Chart
	let loaderPanel = document.querySelector('.widget__panel_chart_loader')
    loaderPanel.style.display = 'flex'
    // Show Loader for Lower Chart
	let loaderChart = document.querySelector('.widget__chart_loader')
    loaderChart.style.display = 'flex'
     // Show Water Meter Readings laoder
	let loaderReadings = document.querySelector('.widget__panel_readings_loader')
    loaderReadings.style.display = 'flex'
    // Unload Leak Percentage
    document.querySelector('.widget__panel_chart_leaks').style.display = "none"
    // Unload Unit Meassurement Selector
    document.querySelector('#meassurement_unit').style.display = 'none'
    // Load Charts containers
    document.querySelector('.widget__chart').insertAdjacentHTML('beforeend', `<canvas id="chart_1" height="21" width="100%"></canvas><p id="chart_3_title">High vs. Low Flow</p><div class="chart_3" style="display: none;"><canvas id="chart_3" height="18" width="100%"></canvas></div>`)
    document.querySelector('.widget__panel_chart').insertAdjacentHTML('beforeend', `<div class="widget__panel_chart_chart"></div>`)
    //Load Stats
    document.querySelector('#stats-avg').innerHTML = '0'
    document.querySelector('#stats-highest').innerHTML = '0'
    document.querySelector('#stats-lowest').innerHTML = '0'
    //Unload Reset Zoom for Chart
    document.querySelector('.reset_zoom').style.display = 'none'
    //Unoad last night's average LPM
    document.querySelector('.avg_container').style.display = 'none'
}


// LOAD DATA

function loadData(){
    // Load Cost Data
	let consumedWaterCostOutput = document.querySelector('#cost-consumed')
	consumedWaterCostOutput.innerHTML = '$ ' + Number(deviceData.consumedWaterCost).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2})

	let leakCostOutput = document.querySelector('#cost-leak')
	leakCostOutput.innerHTML = '$ ' + Number(deviceData.leakCostPerUpdate).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2})

	let costPaidOutput = document.querySelector('#cost-paid')
	costPaidOutput.innerHTML = '$ ' + Number(deviceData.actualCostPerUpdate).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2})
    
    // Load Consumption Data
	let waterConsumedOutput = document.querySelector('#water-consumed')
	waterConsumedOutput.innerHTML = consumption_metric === "cubic" ? (metric === "liters" ? (Number(deviceData.waterConsumptionLiters)*0.001).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' m3' : (Number(deviceData.waterConsumptionLiters)*0.133681).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' ft3') : Number(deviceData.waterConsumptionLiters).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + `${metric === 'gallons' ? ' G' : ' L'}`

	let leakedWaterLitersOutput = document.querySelector('#water-leaked')
	leakedWaterLitersOutput.innerHTML = consumption_metric === "cubic" ? (metric === "liters" ? (Number(deviceData.leakedWaterLiters)*0.001).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' m3' : (Number(deviceData.leakedWaterLiters)*0.133681).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' ft3') : Number(deviceData.leakedWaterLiters).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + `${metric === 'gallons' ? ' G' : ' L'}`
   
	let actualWaterConsumedLitersOutput = document.querySelector('#water-used')
	actualWaterConsumedLitersOutput.innerHTML = consumption_metric === "cubic" ? (metric === "liters" ? (Number(deviceData.actualWaterConsumedLiters)*0.001).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' m3' : (Number(deviceData.actualWaterConsumedLiters)*0.133681).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' ft3') : Number(deviceData.actualWaterConsumedLiters).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + `${metric === 'gallons' ? ' G' : ' L'}`
    
    // Load Low Flow Percentage (colored accordingly)
    document.querySelector('.widget__panel_chart_chart').display = 'flex'
	let lowFlowRateOutput = document.querySelector('#widget__panel_readings_flow_low_rate')
	if(deviceData.lowFlowRate >= 50 && deviceData.lowFlowRate < 75){
		lowFlowRateOutput.style.color = 'orange'
	} else if(deviceData.lowFlowRate >= 75){
		lowFlowRateOutput.style.color = 'red'
	}
	lowFlowRateOutput.innerHTML = deviceData.lowFlowRate === undefined ? 'N/A*' : Number(deviceData.lowFlowRate).toFixed(0) + "%*"
	let highFlowRateOutput =  document.querySelector('#widget__panel_readings_flow_high_rate')

    // Load High Flow Percentage (colored accordingly) 
	if(deviceData.highFlowRate >= 50 && deviceData.highFlowRate < 75){
		highFlowRateOutput.style.color = 'orange'
	} else if(deviceData.highFlowRate >= 75){
		highFlowRateOutput.style.color = 'red'
	}
	highFlowRateOutput.innerHTML = deviceData.highFlowRate === undefined ? "N/A*" : Number(deviceData.highFlowRate).toFixed(0) + "%*"

    // Load High and Low Flow m3 values in meter
    if(deviceData.meterType === 0){
        let highFlowOutput = document.querySelector('.widget__panel_readings_compound_title_high')
	    highFlowOutput.insertAdjacentHTML('beforeend', Number(deviceData.highFlowCubicMeters).toLocaleString('en-US'))
    }
	let lowFlowOutput = document.querySelector(deviceData.meterType == 0 ? '.widget__panel_readings_compound_title_low' : '#widget__panel_readings_single_value_number')
    if(deviceData.meterType === 0){
        lowFlowOutput.insertAdjacentHTML('beforeend', Number(deviceData.lowFlowCubicMeters).toLocaleString('en-US'))
    } else {
        lowFlowOutput.innerHTML = Number(deviceData.lowFlowCubicMeters).toLocaleString('en-US')
    }

    // Show Meter Readigs (previously defined in function to determine "single" or "compound")
	meterReadingOutput.style.display = "flex"

    // Remove Loader for Donut Chart
	let loaderPanel = document.querySelector('.widget__panel_chart_loader')

    loaderPanel.style.display = 'none'

    // Remove Loader for Lower Chart
	let loaderChart = document.querySelector('.widget__chart_loader')

    loaderChart.style.display = 'none'

     // Remove Water Meter Readings laoder
	let loaderReadings = document.querySelector('.widget__panel_readings_loader')
    loaderReadings.style.display = 'none'

    // Show and Load Leak Percentage
    document.querySelector('.widget__panel_chart_chart').style.width = '100%'
    document.querySelector('.widget__panel_chart_chart').style.height = '100%'
    document.querySelector('.widget__panel_chart_leaks').style.display = "flex"
	const leakVolumePercentageContainer = document.querySelector('.widget__panel_chart_leaks_percentage')
	leakVolumePercentageContainer.innerHTML = deviceData.leakPercentage === undefined ? 'N/A' : (parseInt(deviceData.leakPercentage)+ "%")

    // Load Metadata
    let reportType = document.querySelector('#type')
    reportType.innerHTML = " " + type.charAt(0).toUpperCase() + type.slice(1)
    let startDate = document.querySelector('#start_date')
    startDate.innerHTML = " " + new Date(deviceData.dateRange.start)
    let endDate = document.querySelector('#end_date')
    endDate.innerHTML = " " + new Date(deviceData.dateRange.end)

    // Show Datepicker
    document.querySelector('.widget__datepicker_datepicker').style.visibility = 'visible'

    // Show Meassurement Unit Selector
    document.querySelector('#meassurement_unit').style.display = 'initial'

    //Enable or disable High vs Low flow chart depending on meter type
    if(deviceData.meterType === 1){
        document.querySelector('.widget__chart_header_input').style.display = 'none'
    } else if(deviceData.meterType === 0){
        document.querySelector('.widget__chart_header_input').style.display = 'flex'
    }

    //Enable cubic selector
    document.querySelector('#selector_cubic_container').style.display = 'flex'

    // Load Charts
    if(showBottomChart === true){
        document.querySelector('.chart_3').style.display = 'flex'
        document.querySelector('#chart_3_title').style.display = 'initial'
    }

    //Load ML Stats
    document.querySelector('#stats-avg').innerHTML = metric === "gallons" ? (deviceData.stats_avg * 0.264172).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' G' : Number(deviceData.stats_avg).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' L'
    document.querySelector('#stats-highest').innerHTML = metric === "gallons" ? (deviceData.stats_highest * 0.264172).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' G' : Number(deviceData.stats_highest).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' L'
    document.querySelector('#stats-lowest').innerHTML = metric === "gallons" ? (deviceData.stats_lowest * 0.264172).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' G' : Number(deviceData.stats_lowest).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' L'

    //Load Reset Zoom for Chart
    document.querySelector('.reset_zoom').style.display = 'initial'

    //Load last night's average LPM
    document.querySelector('.avg_container').style.display = 'flex'
    document.querySelector('#lpm_avg').innerHTML = `${metric === 'gallons' ? (deviceData.lastNightAvgLPM *  0.264172).toFixed(2) : deviceData.lastNightAvgLPM} ${metric === 'gallons' ? 'GPM' : 'LPM'}`

    loadCharts()
}


// FUNCTION TO ASSIGN LINKS
function assignLinks(){
	if(deviceData.odeusLinkingDevice !== 'NO'){
		document.querySelector('#odeus_link').setAttribute('href', `https://www.connectedwater.ca/app/dashboards/641b68492b3db3000b9afade?devices=${deviceData.odeusLinkingDevice}_${deviceData.snifferLinkingDevice}_${deviceData.deviceId}_${deviceData.snifferGroup}_${deviceData.odeusGroup}${deviceData.spvd !== undefined ? '_spvd' : ''}`)
        document.querySelector('#odeus_link_text').style.color = '#292561'
    } else {
		document.querySelector('#odeus_link').removeAttribute('href')
		document.querySelector('#odeus_link').style.cursor = 'auto'
		document.querySelector('#odeus_link_text').style.color = '#A8A8A8'
	}
	if(deviceData.snifferLinkingDevice !== 'NO'){
		document.querySelector('#sniffer_link').setAttribute('href', `https://www.connectedwater.ca/app/dashboards/63fe6b9c6d2090000c0f17f0?devices=${deviceData.snifferLinkingDevice}_${deviceData.odeusLinkingDevice}_${deviceData.deviceId}_${deviceData.snifferGroup}_${deviceData.odeusGroup}${deviceData.spvd !== undefined ? '_spvd' : ''}`)
        document.querySelector('#odeus_link_text').style.color = '#292561'
    } else {
		document.querySelector('#sniffer_link').removeAttribute('href')
		document.querySelector('#sniffer_link').style.cursor = 'auto'
		document.querySelector('#sniffer_link_text').style.color = '#A8A8A8'
	}
	if(deviceData.spvd){
		document.querySelector('#portfolio').setAttribute('href', `https://www.connectedwater.ca/app/dashboards/648876768425e7000b5e8941`)
	}else{
        document.querySelector('#portfolio').setAttribute('href', `https://www.connectedwater.ca/app/dashboards/63ecf9c57058c7000c6f5c6f`)
    }
}

// SET FUNCTIONALITY OF QUICK REPORT'S BUTTONS
const dayQuickReportButton = document.querySelector('.today')
dayQuickReportButton.addEventListener('click', ()=> loadQuickReport('day'))
const weekQuickReportButton = document.querySelector('.week')
weekQuickReportButton.addEventListener('click', ()=> loadQuickReport('week'))
const monthQuickReportButton = document.querySelector('.month')
monthQuickReportButton.addEventListener('click', ()=> loadQuickReport('month'))
const yearQuickReportButton = document.querySelector('.year')
yearQuickReportButton.addEventListener('click', ()=> loadQuickReport('year'))

async function loadQuickReport(time){
    //Determine report type
    type = time

    // Relaod Dashboard
    unLoadData()

    //Load Address
    const output = document.querySelector(".widget__header_address");
    output.innerHTML = deviceData.address;

    // Set Date Range according to chosen option and start the process of deliverying the report

    let now = new Date()

    if(type === "day"){
        deviceData.dateRange.start = toTimestamp(now.getMonth()+1 + "/" + now.getDate() + "/" +  now.getFullYear() + " 00:00:00")
        deviceData.dateRange.end = toTimestamp(now)
        dayQuickReportButton.setAttribute('id', 'option_selected')
        weekQuickReportButton.setAttribute('id', 'option')
        monthQuickReportButton.setAttribute('id', 'option')
        yearQuickReportButton.setAttribute('id', 'option')
        getGreyAreaFlowRateLpm()
    } else if(type === "month"){
        deviceData.dateRange.start = toTimestamp(now.getMonth()+1 + "/1/" +  now.getFullYear() + " 00:00:00")
        deviceData.dateRange.end = toTimestamp(now)
        dayQuickReportButton.setAttribute('id', 'option')
        weekQuickReportButton.setAttribute('id', 'option')
        monthQuickReportButton.setAttribute('id', 'option_selected')
        yearQuickReportButton.setAttribute('id', 'option')
        getGreyAreaFlowRateLpm()
    } else if (type === "year"){
        deviceData.dateRange.start = toTimestamp("1/1/" +  now.getFullYear() + " 00:00:00")
        deviceData.dateRange.end = toTimestamp(now)
        dayQuickReportButton.setAttribute('id', 'option')
        weekQuickReportButton.setAttribute('id', 'option')
        monthQuickReportButton.setAttribute('id', 'option')
        yearQuickReportButton.setAttribute('id', 'option_selected')
        getGreyAreaFlowRateLpm()
    } else if(type === "week"){
        let startDay = new Date(Number(deviceData.dateRange.end) - (now.getDay()-1)*86400000)
        deviceData.dateRange.start = toTimestamp(startDay.getMonth()+1 + "/" + startDay.getDate() + "/" + startDay.getFullYear() + " 00:00:00")
        deviceData.dateRange.end = toTimestamp(now)
        dayQuickReportButton.setAttribute('id', 'option')
        weekQuickReportButton.setAttribute('id', 'option_selected')
        monthQuickReportButton.setAttribute('id', 'option')
        yearQuickReportButton.setAttribute('id', 'option')
        getGreyAreaFlowRateLpm()
    } else {
        alert("There was an error processing the date of your report. Please refresh and try again.")
    }

    // Reset chart accumulators/calculation tools
    timeFrames = [];
    totalFlowRateLpm = [];
    totalFlowRateLpmPage = 1;
    greyAreaFlowRatePageLpm = 1;
    greyAreaFlowRateLpm = [];
    runOffWaterFlowRatePageLpm = 1;
    runOffWaterFlowRateLpm = [];
    actualConspumtpionWaterFlowRate = [];
    actualConspumtpionWaterFlowRatePage = 1;
    actualCostPage = 1;
    actualCost = [];
    highFlowSideRate = [];
    highFlowSideRatePage = 1;
    lowFlowSideRatePage = 1
    lowFlowSideRate = []
    waterConsumptionShadow = []
    // waterConsumptionShadowLess = []
    // waterConsumptionShadowPlus = []
    deviceData.waterConsumptionShadow = []
    // deviceData.waterConsumptionShadowPlus = []
    // deviceData.waterConsumptionShadowLess = []
    deviceData.greyAreaLpm = []
    deviceData.leakedWaterLpm = []
    deviceData.waterConsumedLpm = []
    deviceData.highFlowSideRate = []
    deviceData.lowFlowSideRate = []
    deviceData.chartTimeFrames = []
    timeFrames = []
    newTotalFlowRate = []

    if(metric === "gallons"){
        if(time === "day"){
            deviceData.leakPercentage = [deviceData.customValues.today.leak_percentage, 100 - deviceData.customValues.today.leak_percentage]
            deviceData.waterConsumptionLiters = deviceData.customValues.today.cons_cons_g
            deviceData.actualWaterConsumedLiters = deviceData.customValues.today.cons_actual_g
            deviceData.leakedWaterLiters = deviceData.customValues.today.cons_leak_g
            deviceData.actualCostPerUpdate = deviceData.customValues.today.cost_cost
            deviceData.consumedWaterCost = deviceData.customValues.today.cost_actual
            deviceData.leakCostPerUpdate = deviceData.customValues.today.cost_leak
        }
        if(time === "week"){
            deviceData.leakPercentage = [deviceData.customValues.today.leak_percentage, 100 - deviceData.customValues.today.leak_percentage]
            deviceData.waterConsumptionLiters = deviceData.customValues.week.cons_cons_g
            deviceData.actualWaterConsumedLiters = deviceData.customValues.week.cons_actual_g
            deviceData.leakedWaterLiters = deviceData.customValues.week.cons_leak_g
            deviceData.actualCostPerUpdate = deviceData.customValues.week.cost_cost
            deviceData.consumedWaterCost = deviceData.customValues.week.cost_actual
            deviceData.leakCostPerUpdate = deviceData.customValues.week.cost_leak
        }
        if(time === "month"){
            deviceData.leakPercentage = [deviceData.customValues.today.leak_percentage, 100 - deviceData.customValues.today.leak_percentage]
            deviceData.waterConsumptionLiters = deviceData.customValues.month.cons_cons_g
            deviceData.actualWaterConsumedLiters = deviceData.customValues.month.cons_actual_g
            deviceData.leakedWaterLiters = deviceData.customValues.month.cons_leak_g
            deviceData.actualCostPerUpdate = deviceData.customValues.month.cost_cost
            deviceData.consumedWaterCost = deviceData.customValues.month.cost_actual
            deviceData.leakCostPerUpdate = deviceData.customValues.month.cost_leak
        }
        if(time === "year"){
            deviceData.leakPercentage = [deviceData.customValues.today.leak_percentage, 100 - deviceData.customValues.today.leak_percentage]
            deviceData.waterConsumptionLiters = deviceData.customValues.year.cons_cons_g
            deviceData.actualWaterConsumedLiters = deviceData.customValues.year.cons_actual_g
            deviceData.leakedWaterLiters = deviceData.customValues.year.cons_leak_g
            deviceData.actualCostPerUpdate = deviceData.customValues.year.cost_cost
            deviceData.consumedWaterCost = deviceData.customValues.year.cost_actual
            deviceData.leakCostPerUpdate = deviceData.customValues.year.cost_leak
        }
    }

    if(metric === "liters"){
        if(time === "day"){
            deviceData.leakPercentage = [deviceData.customValues.today.leak_percentage, 100 - deviceData.customValues.today.leak_percentage]
            deviceData.waterConsumptionLiters = deviceData.customValues.today.cons_cons_l
            deviceData.actualWaterConsumedLiters = deviceData.customValues.today.cons_actual_l
            deviceData.leakedWaterLiters = deviceData.customValues.today.cons_leak_l
            deviceData.actualCostPerUpdate = deviceData.customValues.today.cost_cost
            deviceData.consumedWaterCost = deviceData.customValues.today.cost_actual
            deviceData.leakCostPerUpdate = deviceData.customValues.today.cost_leak
        }
        if(time === "week"){
            deviceData.leakPercentage = [deviceData.customValues.today.leak_percentage, 100 - deviceData.customValues.today.leak_percentage]
            deviceData.waterConsumptionLiters = deviceData.customValues.week.cons_cons_l
            deviceData.actualWaterConsumedLiters = deviceData.customValues.week.cons_actual_l
            deviceData.leakedWaterLiters = deviceData.customValues.week.cons_leak_l
            deviceData.actualCostPerUpdate = deviceData.customValues.week.cost_cost
            deviceData.consumedWaterCost = deviceData.customValues.week.cost_actual
            deviceData.leakCostPerUpdate = deviceData.customValues.week.cost_leak
        }
        if(time === "month"){
            deviceData.leakPercentage = [deviceData.customValues.today.leak_percentage, 100 - deviceData.customValues.today.leak_percentage]
            deviceData.waterConsumptionLiters = deviceData.customValues.month.cons_cons_l
            deviceData.actualWaterConsumedLiters = deviceData.customValues.month.cons_actual_l
            deviceData.leakedWaterLiters = deviceData.customValues.month.cons_leak_l
            deviceData.actualCostPerUpdate = deviceData.customValues.month.cost_cost
            deviceData.consumedWaterCost = deviceData.customValues.month.cost_actual
            deviceData.leakCostPerUpdate = deviceData.customValues.month.cost_leak
        }
        if(time === "year"){
            deviceData.leakPercentage = [deviceData.customValues.today.leak_percentage, 100 - deviceData.customValues.today.leak_percentage]
            deviceData.waterConsumptionLiters = deviceData.customValues.year.cons_cons_l
            deviceData.actualWaterConsumedLiters = deviceData.customValues.year.cons_actual_l
            deviceData.leakedWaterLiters = deviceData.customValues.year.cons_leak_l
            deviceData.actualCostPerUpdate = deviceData.customValues.year.cost_cost
            deviceData.consumedWaterCost = deviceData.customValues.year.cost_actual
            deviceData.leakCostPerUpdate = deviceData.customValues.year.cost_leak
        }
    }
}

// PRINT DASHBOARD

function printDashboard(){
    document.querySelector('.metadata').style.display = "flex"
    const options = {
        ignoreElements: element => {
            const elementClass = element.className
            if(elementClass === "widget__header" || elementClass === "widget__datepicker_datepicker" || elementClass === "widget__actions"){
                return true;
            }
            return false;
        }
    }
    html2canvas(document.querySelector(".widget"), options)
        .then(canvas => {
            let link = document.createElement('a');
            link.download = `${deviceData.address} - Water Monkey ${type ? type.charAt(0).toUpperCase() + type.slice(1) + " " : "Custom "}Report from ${new Date(deviceData.dateRange.start)} to ${new Date(deviceData.dateRange.end)} - Connected Sensors`
            link.href = canvas.toDataURL()
            link.click();
    });
    document.querySelector('.metadata').style.display = "none"
}

const printDashboardButton = document.querySelector('.export_dashboard')
printDashboardButton.addEventListener('click', () => printDashboard())

// EXPORT CSV

const exportCsvButton = document.querySelector('.export_csv')
exportCsvButton.addEventListener('click', ()=> {
	document.querySelector('.modal_container_confirmation').style.display = 'none'
    document.querySelector('.request_csv').style.display = 'initial'
    document.querySelector('.modal').style.display = "flex"
    document.querySelector('.modal_container_confirmation').style.display = 'none'
    document.querySelector('.modal_container_form_csv').style.display = 'initial'
    document.querySelector('.modal_container_form').style.display = 'none'
    document.querySelector('.modal_container_confirmation').style.display = 'none'
    document.querySelector('.request_csv_title').style.display = 'flex'
    timezones.forEach(tz => document.querySelector('#timezone_csv').insertAdjacentHTML('beforeend', `<option value="${tz}">${tz}</option>`))
})

document.querySelector('.modal_container_button_csv').addEventListener('click', async(e)=>{
    e.preventDefault()
    let email = document.querySelector('#email_csv').value
    let timezone = document.querySelector('#timezone_csv').value
    let date_start = document.querySelector('#date_start_csv').value
    let date_end = document.querySelector('#date_end_csv').value
    document.querySelector('.modal_container_form_csv').style.display = 'none'
    document.querySelector('.request_csv').style.display = 'none'
    document.querySelector('.modal_container_loader').style.display = 'flex'
    document.querySelector('.request_csv_title').style.display = 'none'
    try{
        let response = await fetch('https://functions.cs.api.ubidots.com/prv/ConnectedSensors/new-function', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
        },
        body: JSON.stringify({
                "id": deviceData.deviceId,
                "emails": [email],
                "timezone": timezone,
                "start": toTimestamp(date_start),
                "end": toTimestamp(date_end)
            })
        })
        let data = await response.json()
        if(data.status === 'Ok'){
            document.querySelector('.modal_container_loader').style.display = 'none'
            document.querySelector('.modal_container_confirmation').style.display = 'flex'
            document.querySelector('#modal_container_confirmation_message').innerHTML = `Your CSV report has been requested.<br>You will shortly receive it in your email.`
        } else {
            document.querySelector('.modal_container_loader').style.display = 'none'
            document.querySelector('.modal_container_confirmation').style.display = 'flex'
            document.querySelector('#modal_container_confirmation_message').innerHTML = 'There has been an error, please try again in a minute. Thanks!'
        }
    } catch(e){
        document.querySelector('.request_csv').style.display = 'none'
        document.querySelector('.modal_container_loader').style.display = 'none'
        document.querySelector('.modal_container_confirmation').style.display = 'flex'
        document.querySelector('.request_csv_title').style.display = 'none'
        document.querySelector('#modal_container_confirmation_message').innerHTML = `There has been an error: <br><br><i>${e}</i><br><br>Please try again in a minute. <br><br>Thanks!`
    }
    
})

// OPEN OR CLOSE ACTIONS TAB

const iconActionsTab = document.querySelector('#widget_actions_opener')
const widgetActionsOptions = document.querySelector('.widget__actions_options')

iconActionsTab.addEventListener('click', ()=>{
    if(widgetActionsOptions.style.display == "flex"){
        widgetActionsOptions.setAttribute("style", "display:none")
        iconActionsTab.setAttribute("style", "transform: rotate(270deg)")
    } else if(widgetActionsOptions.style.display == "none"){
        widgetActionsOptions.setAttribute("style", "display:flex")
        iconActionsTab.setAttribute("style", "transform: rotate(0deg)")
    }
})

// LEVEL OF CONSUMPTION WIDGET

let litersPerUnitPerDay
let buildingStories
let numberOfUnits
let highMidRise

const buildingStoreysInput = document.getElementById('building_storeys')
const numberOfUnitsInput = document.getElementById('number_of_units')
const highMidriseInput = document.getElementById('high_mid_rise')

// buildingStoreysInput.addEventListener('input', (e)=> {
//     if(e.target.value === ""){
//         highMidriseInput.innerHTML = "High/Midrise"
//         highMidRise = ""
//     }else if(e.target.value <= 10 && e.target.value > 0){
//         highMidriseInput.innerHTML = "Midrise"
//         highMidRise = "Midrise"
//     } else if(e.target.value > 10) {
//         highMidriseInput.innerHTML = "Highrise"
//         highMidRise = "Highrise"
//     }
//     buildingStories = e.target.value
// })

numberOfUnitsInput.addEventListener('input', (e)=> {

    let now = toTimestamp(new Date())

    const colors1 = document.querySelector('.colors_1')
    const colors2 = document.querySelector('.colors_2')
    const colors3 = document.querySelector('.colors_3')
    numberOfUnits = e.target.value
    litersPerUnitPerDay = (deviceData.waterConsumptionLiters / numberOfUnits / (((now < deviceData.dateRange.end ? now : deviceData.dateRange.end) - deviceData.dateRange.start)/86400000))
    document.getElementById('widget__actions_levelsofconsumption_values_value').innerHTML = Number(litersPerUnitPerDay.toFixed(0)) + `${metric === 'gallons' ? ' G' : ' L'}`
    if(metric == 'liters'){
        if(litersPerUnitPerDay === Infinity){
            colors1.style.backgroundColor = '#A2A2A2'
            colors2.style.backgroundColor = '#B8B8B8'
            colors3.style.backgroundColor = '#D1D1D1'
            document.getElementById('widget__actions_levelsofconsumption_values_value').style.color = '#292561'
            document.getElementById('widget__actions_levelsofconsumption_values_value').innerHTML = "0 L"
        }else if(litersPerUnitPerDay <= 499){
            colors1.style.backgroundColor = '#A2A2A2'
            colors2.style.backgroundColor = '#B8B8B8'
            colors3.style.backgroundColor = '#00935B'
            document.getElementById('widget__actions_levelsofconsumption_values_value').style.color = '#00935B'
        }else if(litersPerUnitPerDay >= 500 && litersPerUnitPerDay <= 800){
            colors1.style.backgroundColor = '#A2A2A2'
            colors2.style.backgroundColor = '#E8D12A'
            colors3.style.backgroundColor = '#D1D1D1'
            document.getElementById('widget__actions_levelsofconsumption_values_value').style.color = '#E8D12A'
        } else if (litersPerUnitPerDay >= 801){
            colors1.style.backgroundColor = '#FF0C00'
            colors2.style.backgroundColor = '#B8B8B8'
            colors3.style.backgroundColor = '#D1D1D1'
            document.getElementById('widget__actions_levelsofconsumption_values_value').style.color = '#FF0C00' 
        }
    } else {
        if(litersPerUnitPerDay === Infinity){
            colors1.style.backgroundColor = '#A2A2A2'
            colors2.style.backgroundColor = '#B8B8B8'
            colors3.style.backgroundColor = '#D1D1D1'
            document.getElementById('widget__actions_levelsofconsumption_values_value').style.color = '#292561'
            document.getElementById('widget__actions_levelsofconsumption_values_value').innerHTML = "0 L"
        }else if(litersPerUnitPerDay <= 132){
            colors1.style.backgroundColor = '#A2A2A2'
            colors2.style.backgroundColor = '#B8B8B8'
            colors3.style.backgroundColor = '#00935B'
            document.getElementById('widget__actions_levelsofconsumption_values_value').style.color = '#00935B' 
        }else if(litersPerUnitPerDay > 132 && litersPerUnitPerDay < 211){
            colors1.style.backgroundColor = '#A2A2A2'
            colors2.style.backgroundColor = '#E8D12A'
            colors3.style.backgroundColor = '#D1D1D1'
            document.getElementById('widget__actions_levelsofconsumption_values_value').style.color = '#E8D12A'
        } else if (litersPerUnitPerDay >= 211){
            colors1.style.backgroundColor = '#FF0C00'
            colors2.style.backgroundColor = '#B8B8B8'
            colors3.style.backgroundColor = '#D1D1D1'
            document.getElementById('widget__actions_levelsofconsumption_values_value').style.color = '#FF0C00'
        }
    }
})

// EMAIL - ASK FOR HELP

const modal = document.querySelector('.modal')
const closeModal = document.querySelector('.modal_container_close')
closeModal.addEventListener('click', ()=> modal.style.display = 'none')
const askForHelp = document.querySelector('.ask_for_help')
askForHelp.addEventListener('click', ()=> {
    document.querySelector('.modal_container_confirmation').style.display = 'none'
    document.querySelector('.modal_container_form').style.display = 'flex'
    document.querySelector('.request_csv').style.display = 'none'
    document.querySelector('.modal_container_confirmation').style.display = 'none'
    modal.style.display = 'flex'
})
const modalButton = document.querySelector('.modal_container_button')
modalButton.addEventListener('click', async (e)=> {
    e.preventDefault()
    let message = document.querySelector('.modal_container_textarea').value
    let name = document.querySelector('.name').value
    let email = document.querySelector('.email').value

    if(message.length > 1 && name.length > 1 && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
        let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + '/support_email/values', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
        },
        body: JSON.stringify({
                "value": 1,
                "timestamp": Date.now(),
                "context": {
                    name: name,
                    organization: deviceData.organization,
                    organization_id: deviceData.organizationID,
                    email: email,
                    device_name: deviceData.deviceName,
                    device_label: deviceData.deviceLabel,
                    date: new Date(),
                    message: message
                }
            })
        })
        let data = response
        document.querySelector('.modal_container_form').style.display = 'none'
        document.querySelector('.modal_container_loader').style.display = 'flex'
        if(data.ok === true){
            setTimeout(async ()=>{
            let response = await fetch(devicesURL + '/' + deviceData.deviceLabel + '/support_email/values', {
            method: 'POST',
            headers: {
            'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
            },
            body: JSON.stringify({
                    "value": 0,
                    "timestamp": Date.now(),
                })
            })
            let data = response
            if(data.ok === true){
                document.querySelector('.modal_container_loader').style.display = 'none'
                document.querySelector('.modal_container_confirmation').style.display = 'flex'
                document.querySelector('#modal_container_confirmation_message').innerText = `Thanks for getting in touch!<br><br>We will get back to you shortly.`

            } else {
                document.querySelector('.modal_container_loader').style.display = 'none'
                document.querySelector('.modal_container_confirmation').style.display = 'flex'
                document.querySelector('#modal_container_confirmation_message').innerText = 'There has been an error, please try again in a minute. Thanks!'
            }
        }, 1000)} 
        else {
            document.querySelector('.modal_container_loader').style.display = 'none'
            document.querySelector('.modal_container_confimration').style.display = 'flex'
            document.querySelector('#modal_container_confirmation_message').innerText = 'There has been an error, please try again in a minute. Thanks!'
        } 
    } else {
        alert('Please complete the form with accurate data before sending it')
    }
    
})

// RECALIBRATE DEVICE

// document.querySelector('.recalibrate_container_close').addEventListener('click', ()=>{
//     document.querySelector('.recalibrate').style.display = 'none'
// })

// document.querySelector('.recalibrate_container_cancel').addEventListener('click', ()=>{
//     document.querySelector('.recalibrate').style.display = 'none'
// })

// document.querySelector('.recalibrate_device').addEventListener('click', ()=>{
//     document.querySelector('.recalibrate').style.display = 'flex'
// })

// document.querySelector('.recalibrate_container_selector_input').addEventListener('change', (e)=> {
//     if(e.target.checked){
//         document.querySelector('.recalibrate_container_button').setAttribute('id', 'recalibrate_enabled')
//     } else {
//         document.querySelector('.recalibrate_container_button').removeAttribute('id')
//     }
// })

// SHOW/HIDE HIGH-LOW FLOW SIDE RATE CHART

document.querySelector('#show_high_low_chart').addEventListener('change', (e)=>{
    if(e.target.checked){
        document.querySelector('.chart_3').style.display = 'flex'
        document.querySelector('#chart_3_title').style.display = 'initial'
        showBottomChart = true
    } else {
        document.querySelector('.chart_3').style.display = 'none'
        document.querySelector('#chart_3_title').style.display = 'none'
        showBottomChart = false
    }
})

// SWITCH TO CUBIC

document.querySelector('#selector_cubic').addEventListener('click', ()=>{
    if(consumption_metric === "normal"){
        consumption_metric = "cubic"
        // document.querySelector('.selector_cubic').firstElementChild.setAttribute('fill', '#292561')
        document.querySelector('.selector_cubic').style.transform = 'rotate(180deg)';

        // Load Consumption Data
        let waterConsumedOutput = document.querySelector('#water-consumed')
        waterConsumedOutput.innerHTML = metric === "liters" ? (Number(deviceData.waterConsumptionLiters)*0.001).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' m3' : (Number(deviceData.waterConsumptionLiters)*0.133681).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' ft3'

        let leakedWaterLitersOutput = document.querySelector('#water-leaked')
        leakedWaterLitersOutput.innerHTML = metric === "liters" ? (Number(deviceData.leakedWaterLiters)*0.001).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' m3' : (Number(deviceData.leakedWaterLiters)*0.133681).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' ft3'
    
        let actualWaterConsumedLitersOutput = document.querySelector('#water-used')
        actualWaterConsumedLitersOutput.innerHTML = metric === "liters" ? (Number(deviceData.actualWaterConsumedLiters)*0.001).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' m3' : (Number(deviceData.actualWaterConsumedLiters)*0.133681).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' ft3'

        let avg = document.querySelector('#stats-avg')
        avg.innerHTML = metric === 'liters' ? (Number(deviceData.stats_avg *0.001)).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' m3' : (Number(deviceData.stats_avg * 0.264172)*0.133681).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' ft3'

        let max = document.querySelector('#stats-highest')
        max.innerHTML = metric === 'liters' ? (Number(deviceData.stats_highest *0.001)).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' m3' : (Number(deviceData.stats_highest * 0.264172)*0.133681).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' ft3'

        let min = document.querySelector('#stats-lowest')
        min.innerHTML = metric === 'liters' ? (Number(deviceData.stats_lowest *0.001)).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' m3' : (Number(deviceData.stats_lowest * 0.264172)*0.133681).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' ft3'

    } else if(consumption_metric === "cubic"){
        consumption_metric = "normal"
        // document.querySelector('.selector_cubic').firstElementChild.setAttribute('fill', '#292561')
        document.querySelector('.selector_cubic').style.transform = 'rotate(0deg)'
    
        // Load Consumption Data
        let waterConsumedOutput = document.querySelector('#water-consumed')
        waterConsumedOutput.innerHTML = Number(deviceData.waterConsumptionLiters).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + `${metric === 'gallons' ? ' G' : ' L'}`

        let leakedWaterLitersOutput = document.querySelector('#water-leaked')
        leakedWaterLitersOutput.innerHTML = Number(deviceData.leakedWaterLiters).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + `${metric === 'gallons' ? ' G' : ' L'}`
    
        let actualWaterConsumedLitersOutput = document.querySelector('#water-used')
        actualWaterConsumedLitersOutput.innerHTML = Number(deviceData.actualWaterConsumedLiters).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + `${metric === 'gallons' ? ' G' : ' L'}`

        let avg = document.querySelector('#stats-avg')
        avg.innerHTML = metric === 'liters' ? (Number(deviceData.stats_avg)).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' L' : (Number(deviceData.stats_avg * 0.264172)).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' G'

        let max = document.querySelector('#stats-highest')
        max.innerHTML = metric === 'liters' ? (Number(deviceData.stats_highest)).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' L' : (Number(deviceData.stats_highest * 0.264172)).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' G'

        let min = document.querySelector('#stats-lowest')
        min.innerHTML = metric === 'liters' ? (Number(deviceData.stats_lowest)).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' L' : (Number(deviceData.stats_lowest * 0.264172)).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' G'
    }
})


//GET LAST VALUES

async function getLastValues(){
    let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/~${deviceData.deviceLabel}/_/values/last`, {
        method: 'GET',
        headers: {
            'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
        }
    })
    let data = await response.json()

    // Get meter type
    deviceData.meterType = data.meter_type.value
	if(deviceData.meterType == 0){
		meterReadingOutput = document.querySelector('.widget__panel_readings_widget_compound')
	} else if(deviceData.meterType == 1){
		meterReadingOutput = document.querySelector('.widget__panel_readings_widget_single')
	} else if(deviceData.meterType === undefined){
        meterReadingOutput = document.querySelector('.widget__panel_readings_widget_undefined')
    }

    // Get meassurement unit
    if(data.volume_measurement_unit.value){
        if(data.volume_measurement_unit.value === 0){
            metric = "liters"
        } else if(data.volume_measurement_unit.value === 1){
            metric = "gallons"
            document.querySelector('#selector_meassurementunit').style.transform = 'rotate(180deg)';
            document.querySelector('#selector_cubic_container_lorg').innerHTML = "G"
            document.querySelector('#selector_cubic_container_m3orft3').innerHTML = "ft3"
        }
    } else {
        metric = "liters"
    }

    // Get alert status
    //Device offline
    if(data.device_offline_alert.value === undefined){
        document.querySelector('#selector_deviceoffline').firstElementChild.setAttribute('fill', '#A2A2A2')
        deviceOfflineAlertStatus = 0
    } else{
        deviceOfflineAlertStatus = data.device_offline_alert.value
        if(deviceOfflineAlertStatus === 1){
            document.querySelector('#selector_deviceoffline').setAttribute('transform', 'rotate(180)')
        } else{
            document.querySelector('#selector_deviceoffline').firstElementChild.setAttribute('fill', '#A2A2A2')
        }
    }

    //High usage
    if(data.high_usage_alert.value === undefined){
        document.querySelector('#selector_highusge').firstElementChild.setAttribute('fill', '#A2A2A2')
        highUsageAlertStatus = 0
    } else{
        highUsageAlertStatus = data.high_usage_alert.value
        if(highUsageAlertStatus === 1){
            document.querySelector('#selector_highusge').setAttribute('transform', 'rotate(180)')
        } else{
            document.querySelector('#selector_highusge').firstElementChild.setAttribute('fill', '#A2A2A2')
        }
    }

    //Leak alert
    if(data.leak_alert.value === undefined){
        document.querySelector('#selector_leakalert').firstElementChild.setAttribute('fill', '#A2A2A2')
        leakAlertStatus = 0
    } else{
        leakAlertStatus = data.leak_alert.value
        if(leakAlertStatus === 1){
            document.querySelector('#selector_leakalert').setAttribute('transform', 'rotate(180)')
        } else{
            document.querySelector('#selector_leakalert').firstElementChild.setAttribute('fill', '#A2A2A2')
        }
    }

    //Leak percentage
    if(data.leak_percentage_alert.value === undefined){
        document.querySelector('#selector_leakpercentage').firstElementChild.setAttribute('fill', '#A2A2A2')
        leakPercentageStatus = 0
    } else{
        leakAlertStatus = data.leak_percentage_alert.value
        if(leakPercentageStatus === 1){
            document.querySelector('#selector_leakpercentage').setAttribute('transform', 'rotate(180)')
        } else{
            document.querySelector('#selector_leakpercentage').firstElementChild.setAttribute('fill', '#A2A2A2')
        }
    }

    //Get High Flow and Low Flow data

    //Low Flow
    deviceData.lowFlowCubicMeters = data.low_flow_water_meter_reading.value ? data.low_flow_water_meter_reading.value.toFixed(0) : undefined

    //Low Flow Percentage
    deviceData.lowFlowRate = data.low_flow_percentage.value ? data.low_flow_percentage.value : undefined

    //High Flow
    deviceData.highFlowCubicMeters = data.high_flow_water_meter_reading.value ? data.high_flow_water_meter_reading.value.toFixed(0) : undefined

    //High Flow Percentage
    deviceData.highFlowRate = data.high_flow_percentage ? data.high_flow_percentage.value : undefined

    //Get ML Stats

    if(data.metric_average_daily_l.value){
        deviceData.stats_avg = data.metric_average_daily_l.value.toFixed(2)
    }else {
        deviceData.stats_avg = "0"
    }

    if(data.metric_max_daily_l.value){
        deviceData.stats_highest = data.metric_max_daily_l.value.toFixed(2)
    } else {
        deviceData.stats_highest = "0"
    }

    if(data.metric_min_daily_l.value){
        deviceData.stats_lowest = data.metric_min_daily_l.value.toFixed(2)
    }else{
        deviceData.stats_lowest = "0"
    }

    //Custom report values
    deviceData.customValues = {
        today: {
            cons_cons_l: data.water_consumption_sum_day.value,
            cons_cons_g: data.water_consumption_sum_day_g.value,
            cons_actual_l: data.actual_consumption_sum_day.value,
            cons_actual_g: data.actual_consumption_sum_day_g.value,
            cons_leak_l: data.leak_volume_sum_day.value,
            cons_leak_g: data.leak_volume_sum_day_g.value,
            cost_cost: data.water_cost_sum_day.value,
            cost_actual: data.actual_cost_sum_day.value,
            cost_leak: data.leak_cost_sum_day.value,
            leak_percentage: data.leak_volume_percentage_day.value
        },
        week: {
            cons_cons_l: data.water_consumption_sum_week.value,
            cons_cons_g: data.water_consumption_sum_week_g.value,
            cons_actual_l: data.actual_consumption_sum_week.value,
            cons_actual_g: data.actual_consumption_sum_week_g.value,
            cons_leak_l: data.leak_volume_sum_week.value,
            cons_leak_g: data.leak_volume_sum_week_g.value,
            cost_cost: data.water_cost_sum_week.value,
            cost_actual: data.actual_cost_sum_week.value,
            cost_leak: data.leak_cost_sum_week.value,
            leak_percentage: data.leak_volume_percentage_week.value
        },
        month: {
           cons_cons_l: data.water_consumption_sum_month.value,
            cons_cons_g: data.water_consumption_sum_month_g.value,
            cons_actual_l: data.actual_consumption_sum_month.value,
            cons_actual_g: data.actual_consumption_sum_month_g.value,
            cons_leak_l: data.leak_volume_sum_month.value,
            cons_leak_g: data.leak_volume_sum_month_g.value,
            cost_cost: data.water_cost_sum_month.value,
            cost_actual: data.actual_cost_sum_month.value,
            cost_leak: data.leak_cost_sum_month.value,
            leak_percentage: data.leak_volume_percentage_month.value
        },
        year: {
           cons_cons_l: data.water_consumption_sum_year.value,
            cons_cons_g: data.water_consumption_sum_year_g.value,
            cons_actual_l: data.actual_consumption_sum_year.value,
            cons_actual_g: data.actual_consumption_sum_year_g.value,
            cons_leak_l: data.leak_volume_sum_year.value,
            cons_leak_g: data.leak_volume_sum_year_g.value,
            cost_cost: data.water_cost_sum_year.value,
            cost_actual: data.actual_cost_sum_year.value,
            cost_leak: data.leak_cost_sum_year.value,
            leak_percentage: data.leak_volume_percentage_year.value
        }
    }

    let now = new Date()

    let timestamp_start
    let timestamp_end

    if(now.getHours() > 12){
        timestamp_start = toTimestamp(new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' ' + '00:00'))
        timestamp_end = toTimestamp(new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' ' + '06:00'))
    } else {
        timestamp_start = toTimestamp(new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + (now.getDate()-1 === 0 ? 28 : now.getDate()-1) + ' ' + '00:00'))
        timestamp_end = toTimestamp(new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + (now.getDate()-1 === 0 ? 28 : now.getDate()-1) + ' ' + '06:00'))
    }

    let count = 0
    let sum = 0
    
    let inGallons = 'total_flow_rate_g'
    let inLiters = 'total_flow_rate'

    let response2 = await fetch(devicesURL + '/' + deviceData.deviceLabel + `/${metric === 'gallons' ? inGallons : inLiters}/values/?start=` + timestamp_start + '&end=' + timestamp_end + '&page_size=20000', {
        method: 'GET',
        headers: {
            'X-Auth-Token': 'BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t'
        }
    })
    let data2 = await response2.json()
    data2.results.forEach(value => {
        count = count + 1
        sum = sum + value.value
    })
    deviceData.lastNightAvgLPM = (sum /count).toFixed(2)

}

// DECLARE UBIDOT'S INSTANCE
//  const ubidots = new Ubidots();

// GET UBIDOTS CONTEXT
function getUbidotsContext(){
    console.log('STARTED!')
	// Get dashboard date range
	// ubidots.on('selectedDashboardDateRange', function(data){
	// 	deviceData.dateRange = data
	// 	console.log(`Dashboard date range: ${JSON.stringify(data)}`);
	// })

	// Get device key
	// async function getDevice(deviceKey) {
	//  	const response = await fetch(
	//  		`https://cs.api.ubidots.com/api/v2.0/devices/${deviceKey}/`,
	// 		{
	// 			method: "PATCH",
	// 			headers: {
	// 				"X-Auth-Token": "BBFF-Y1MJeqG9DOBQ4KlzdEliDD7w6bZKoa",
	// 				"Content-Type": "application/json",
	// 			},
	// 		}
	// 	);
	// 	return response.json(); ;
	// }

	// // Get device data
	// ubidots.on("selectedDevice", function (data) {
    //     if(data.length <= 24){
    //     	deviceData.deviceId = data
	// 	} else {
	// 		let ids = data.split("_")
	// 		deviceData.deviceId = ids[0]
	// 		deviceData.odeusLinkingDevice = ids[1]
	// 		deviceData.snifferLinkingDevice = ids[2]
    //         deviceData.snifferGroup = ids[3]
    //         deviceData.odeusGroup = ids[4]
	// 		if(ids[5]){
    //             deviceData.spvd = 'https://www.connectedwater.ca/app/dashboards/648876768425e7000b5e8941'
    //         }
	// 		assignLinks()
	// 	}
		const output = document.querySelector(".widget__header_address");
        // getDevice(deviceData.deviceId)
        // .then((data) => {
            // deviceData.organization = data.organization.name
            // deviceData.deviceLabel = data.label
            deviceData.deviceLabel = "352656103793371"
            // deviceData.organizationId = data.organization.id
            // deviceData.deviceName = data.name
            // deviceData.address = data.properties.address;
            deviceData.address = "SODO"
            output.innerHTML = deviceData.address;
        // })
        // .catch((err) => {
        //     console.log(err);
        // });
	// });

	// // Synchronize the invoking of all the subsequent functions to load the Dashboard
	setTimeout(()=>{
        getLastValues()
        if(type === 'custom'){
            getWaterConsumptionData()
        }else if(type == 'day' ||type == 'week' || type == 'month' || type == 'year'){
            loadQuickReport(type)
        }
	}, 1000)
	
}

// INVOQUE OF FIRST FUNCTION TO START THE PROCESS

getUbidotsContext()