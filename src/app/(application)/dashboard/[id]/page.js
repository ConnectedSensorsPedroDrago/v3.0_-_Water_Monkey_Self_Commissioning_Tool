"use client"

import TimeRangeSelector from "@/src/components/Dashboard/TimeRangeSelector/page"
import { useContext, useEffect, useState } from 'react'
import { wmDashbaordContext } from '@/src/context/wmDashboardContext'
import Loader from "@/src/components/loader/page"
import AddressHeader from "@/src/components/Dashboard/AddressHeader/page"
import ActionsTab from "@/src/components/Dashboard/ActionsTab/page"
import MainChart from "@/src/components/Dashboard/MainChart/page"
import LowerChartContainer from "@/src/components/Dashboard/LowerChartContainer/page"

const Dashboard = ({ params }) => {

    const { timeRangeStart, timeRangeEnd, runReport, setRunReport, loader, setLoader, setTimeRangeStart, setTimeRangeEnd, error, setError, setMetric, metric } = useContext(wmDashbaordContext)
    const [lastValues, setLastValues] = useState()
    const [device, setDevice] = useState()
    const [mainChartValues, setMainChartValues] = useState()
    const [reportStart, setReportStart] = useState()
    const [reportEnd, setReportEnd] = useState()

    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    useEffect(()=>{
      setLoader(true)
      let label
      setError()
      setMainChartValues()
      fetch(`/api/dashboard/water-monkey/get-device?id=${params.id}`)
      .then(resp => resp.json())
      .then(data => {
        console.log(data)
        if(data.status === "ok"){
          setDevice(data.device)
          label = data.device.label
          fetch(`/api/dashboard/water-monkey/get-last-values?device=${params.id}`)
          .then(resp => resp.json())
          .then(data => {
            if(data.status === 'ok'){
              setMetric((data.data.volume_measurement_unit && data.data.volume_measurement_unit.value === 1) ? "gallons" : (data.data.volume_measurement_unit && data.data.volume_measurement_unit.value === 0) ? "liters" : "liters" )
              console.log(data.data)
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
        }
      })
      
    }, [runReport])

    const setNewMetric = (metric, id) => {
      setLoader(true)
      fetch(`/api/dashboard/water-monkey/actions/set_metric`, {
        method: 'POST',
        body: JSON.stringify({
          metric: metric,
          device: id
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.status === "ok"){
          setRunReport(!runReport)
        }else{
          setError(data.message)
        }
      })
    }

  return (
    <>
      {
        (loader) &&
        <Loader />
      }
      
      <div className='container-dashboard bg-grey-light z-0'>
        <TimeRangeSelector />
        {
          device && lastValues &&
          <>
            <ActionsTab 
              alerts={[{name: "Device Offline", value: lastValues.device_offline_alert}, {name: "High Usage", value: lastValues.high_usage_alert}, {name: "Leak", value: lastValues.leak_alert}, {name: "Leak %", value: lastValues.leak_percentage_alert}]}
              unit={{value1: "Liters", value2: "Gallons", value: lastValues.volume_measurement_unit.value, setter: setNewMetric}}
              unitOrCubic={{liters: {value: 1, value1: "lts", value2: "m3"}, cubic: {value: 1, value1: "g", value2: "ft3"}}}
              device={device.label}
            />
            <AddressHeader 
              address={device.properties.address} 
            />
            {
              mainChartValues &&
              <>
                <MainChart 
                  mainChartValues={mainChartValues} 
                  lastValues={lastValues} 
                  reportStart={reportStart} 
                  reportEnd={reportEnd} 
                  meterType={lastValues.meter_type.value}
                  metric={metric}
                />
                <LowerChartContainer
                  label={device.label}
                  reportStart={reportStart} 
                  reportEnd={reportEnd} 
                  meterType={lastValues.meter_type.value}
                  metric={metric}
                />
              </>
            }
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