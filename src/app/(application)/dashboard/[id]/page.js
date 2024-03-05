"use client"

import TimeRangeSelector from "@/src/components/Dashboard/TimeRangeSelector/page"
import { useContext, useEffect, useState } from 'react'
import { wmDashbaordContext } from '@/src/context/wmDashboardContext'
import Loader from "@/src/components/loader/page"
import AddressHeader from "@/src/components/Dashboard/AddressHeader/page"
import ActionsTab from "@/src/components/Dashboard/ActionsTab/page"
import MainChart from "@/src/components/Dashboard/MainChart/page"
import LowerChartContainer from "@/src/components/Dashboard/LowerChartContainer/page"
import Message from "@/src/components/Message/page"
import CSVModal from "@/src/components/CSVModal/page"

const Dashboard = ({ params }) => {

    const { timeRangeStart, timeRangeEnd, runReport, setRunReport, loader, setLoader, setTimeRangeStart, setTimeRangeEnd, error, setError, setMetric, metric, exportDashbaord } = useContext(wmDashbaordContext)
    const [lastValues, setLastValues] = useState()
    const [device, setDevice] = useState()
    const [mainChartValues, setMainChartValues] = useState()
    const [reportStart, setReportStart] = useState()
    const [reportEnd, setReportEnd] = useState()
    const [message, setMessage] = useState()
    const [cubic, setCubic] = useState(false)
    const [deviceOfflineAlert, setDeviceOfflineAlert] = useState()
    const [highUsageAlert, setHighUsageAlert] = useState()
    const [leakAlert, setLeakAlert] = useState()
    const [leakPercentageAlert, setLeakPercentageAlert] = useState()
    const [csvModal, setCsvModal] = useState(false)

    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    useEffect(()=>{
      setLoader(true)
      let label
      setError()
      setMainChartValues()
      fetch(`/api/dashboard/water-monkey/get-device?id=${params.id}`)
      .then(resp => resp.json())
      .then(data => {
        if(data.status === "ok"){
          setDevice(data.device)
          label = data.device.label
          fetch(`/api/dashboard/water-monkey/get-last-values?device=${params.id}`)
          .then(resp => resp.json())
          .then(data => {
            if(data.status === 'ok'){
              setMetric((data.data.volume_measurement_unit && data.data.volume_measurement_unit.value === 1) ? "gallons" : (data.data.volume_measurement_unit && data.data.volume_measurement_unit.value === 0) ? "liters" : "liters" )
              setDeviceOfflineAlert((data.data.device_offline_alert && data.data.device_offline_alert.value) ? data.data.device_offline_alert.value : undefined)
              setHighUsageAlert((data.data.high_usage_alert && data.data.high_usage_alert.value) ? data.data.high_usage_alert.value : undefined)
              setLeakAlert((data.data.leak_alert && data.data.leak_alert.value) ? data.data.leak_alert.value : undefined)
              setLeakPercentageAlert((data.data.leak_percentage_alert && data.data.leak_percentage_alert.value) ? data.data.leak_alert.value : undefined)
              setLastValues(data.data)
              if(timeRangeStart && timeRangeEnd){
                setReportStart({timestamp: timeRangeStart, timezone: timezone})
                setReportEnd({timestamp: timeRangeEnd, timezone: timezone})
                fetch(`/api/dashboard/water-monkey/get-report-data`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    "device": params.id,
                    "start": timeRangeStart,
                    "end": timeRangeEnd,
                    "variables": device.variables,
                  })

                })
                .then(res => res.json())
                .then(data => {
                  if(data.status === "ok"){
                    setMainChartValues(data.data)
                  }else if(data.status === "error"){
                    setError(data.message)
                  }
                })
                .finally(()=> {
                  setTimeRangeStart()
                  setTimeRangeEnd()
                  setLoader(false)
                })
              }else{
                setTimeRangeStart()
                setTimeRangeEnd()
                setLoader(false)
              }
            }else if(data.status === 'error'){
              setError(data.message)
              setLoader(false)
            }
          })
        }else if(data.status === "error"){
          setError(data.message)
          setLoader(false)
        }
      })
      
    }, [runReport])

    const setNewMetric = (newMetric, id) => {
      setTimeRangeStart(reportStart && reportStart.timestamp ? reportStart.timestamp : '')
      setTimeRangeEnd(reportEnd && reportEnd.timestamp ? reportEnd.timestamp : '')
      setLoader(true)
      fetch(`/api/dashboard/water-monkey/actions/set_metric`, {
        method: 'POST',
        body: JSON.stringify({
          metric: newMetric,
          device: id
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.status === "ok"){
          setMessage(`Metric successfully changed to ${newMetric === 0 ? "liters" : "gallons"}`)
          setRunReport(!runReport)
        }else{
          setError(data.message)
        }
      })
    }

    const handleCubic = () => {
      setCubic(!cubic)
    }

    const handleDeviceOfflineAlert = (device, prev_status) => {
      fetch('/api/dashboard/water-monkey/actions/alerts/device_offline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          device: device,
          prev_status: deviceOfflineAlert
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.status === "ok"){
          setDeviceOfflineAlert(data.data.value)
          setMessage("The Device Offline alert status has been successfuly changed.")
        }else if(data.status === "error"){
          setMessage(data.message)
        }
      })
    }

    const handleHighUsageAlert = (device, prev_status) => {
      fetch('/api/dashboard/water-monkey/actions/alerts/high_usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          device: device,
          prev_status: highUsageAlert
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.status === "ok"){
          setHighUsageAlert(data.data.value)
          setMessage("The High Usage alert status has been successfuly changed.")
        }else if(data.status === "error"){
          setMessage(data.message)
        }
      })
    }

    const handleLeakAlert = (device, prev_status) => {
      fetch('/api/dashboard/water-monkey/actions/alerts/leak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          device: device,
          prev_status: leakAlert
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.status === "ok"){
          setLeakAlert(data.data.value)
          setMessage("The Leak alert status has been successfuly changed.")
        }else if(data.status === "error"){
          setMessage(data.message)
        }
      })
    }

    const handleLeakPercentageAlert = (device, prev_status) => {
            console.log(device, prev_status)
      fetch('/api/dashboard/water-monkey/actions/alerts/leak_percentage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          device: device,
          prev_status: leakPercentageAlert
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.status === "ok"){
          setLeakPercentageAlert(data.data.value)
          setMessage("The Leak Percentage alert status has been successfuly changed.")
        }else if(data.status === "error"){
          setMessage(data.message)
        }
      })
    }

  return (
    <>
      {
        loader &&
        <Loader />
      }
      {
        csvModal && device &&
        <CSVModal device={device.id} setCsvModal={setCsvModal} setLoader={setLoader}/>
      }
      <div className='container-dashboard bg-grey-light z-0'>
        { 
          message && !loader &&
          <Message message={message} setMessage={setMessage}/>
        }
        <TimeRangeSelector />
        {
          device && lastValues &&
          <>
            <ActionsTab 
              alerts={[{name: "Device Offline", value: deviceOfflineAlert, setter: handleDeviceOfflineAlert, label: device.label}, {name: "High Usage", value: highUsageAlert, setter: handleHighUsageAlert, label: device.label}, {name: "Leak", value: leakAlert, setter: handleLeakAlert, label: device.label}, {name: "Leak %", value: leakPercentageAlert, setter: handleLeakPercentageAlert, label: device.label}]}
              unit={{value1: "Liters", value2: "Gallons", value: lastValues.volume_measurement_unit.value, setter: setNewMetric}}
              unitOrCubic={{liters: {value: cubic, value1: "L/G", value2: "m3/ft3", setter: handleCubic}, cubic: {value: 0, value1: "g", value2: "ft3", setter: handleCubic}}}
              device={device.label}
              consumption={mainChartValues && {liters: mainChartValues.water_consumption_per_update, gallons: mainChartValues.water_consumption_per_update}}
              days={reportEnd && reportStart && (Number(reportEnd.timestamp) - Number(reportStart.timestamp))/86400000}
              metric={metric}
              setCsvModal={setCsvModal}
              exportDashbaord={exportDashbaord}
            />
            <div className="dashboard-to-print w-full">
              <AddressHeader 
                address={device.properties.address} 
              />
              {
                mainChartValues &&
                <div className="flex flex-col w-full h-full">
                  <MainChart 
                    mainChartValues={mainChartValues} 
                    lastValues={lastValues} 
                    reportStart={reportStart} 
                    reportEnd={reportEnd} 
                    meterType={lastValues.meter_type.value}
                    metric={metric}
                    cubic={cubic}
                  />
                    <LowerChartContainer
                      label={device.label}
                      reportStart={reportStart} 
                      reportEnd={reportEnd} 
                      meterType={lastValues.meter_type.value}
                      metric={metric}
                    />
                </div>
              }
            </div>
          </>
        }
        {
          error &&
          <p className="error-message">{error}</p>
        }
      </div>
    </>
    
  )
}

export default Dashboard