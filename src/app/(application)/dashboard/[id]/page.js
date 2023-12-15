"use client"

import TimeRangeSelector from "@/src/components/Dashboard/TimeRangeSelector/page"
import { useContext, useEffect, useState } from 'react'
import { wmDashbaordContext } from '@/src/context/wmDashboardContext'
import Loader from "@/src/components/loader/page"
import AddressHeader from "@/src/components/Dashboard/AddressHeader/page"
import ActionsTab from "@/src/components/Dashboard/ActionsTab/page"
import MainChart from "@/src/components/Dashboard/MainChart/page"

const Dashboard = ({ params }) => {

    const { timeRangeStart, timeRangeEnd, runReport, loader, setLoader,setTimeRangeStart, setTimeRangeEnd, error, setError } = useContext(wmDashbaordContext)
    const [lastValues, setLastValues] = useState()
    const [device, setDevice] = useState()
    const [mainChartValues, setMainChartValues] = useState()
    const [reportStart, setReportStart] = useState()
    const [reportEnd, setReportEnd] = useState()

    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    useEffect(()=>{
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
                    "variables": device.variables
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

  return (
    <>
      {
        (loader) &&
        <Loader />
      }
      
      <div className='container-pages bg-grey-light'>
        <TimeRangeSelector />
        {
          device && lastValues &&
          <>
            <ActionsTab 
              alerts={[{name: "Device Offline", value: lastValues.device_offline_alert}, {name: "High Usage", value: lastValues.high_usage_alert}, {name: "Leak", value: lastValues.leak_alert}, {name: "Leak %", value: lastValues.leak_percentage_alert}]}
              unit={{value1: "Liters", value2: "Gallons", value: lastValues.volume_measurement_unit}}
            />
            <AddressHeader 
              address={device.properties.address} 
            />
            {
              mainChartValues &&
              <MainChart 
                mainChartValues={mainChartValues} 
                lastValues={lastValues} 
                reportStart={reportStart} 
                reportEnd={reportEnd} 
                meterType={lastValues.meter_type.value}
              />
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