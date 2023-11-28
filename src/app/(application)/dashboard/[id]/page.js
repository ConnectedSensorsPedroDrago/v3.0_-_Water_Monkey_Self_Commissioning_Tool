"use client"

import TimeRangeSelector from "@/src/components/Dashboard/TimeRangeSelector/page"
import { useContext, useEffect, useState } from 'react'
import { wmDashbaordContext } from '@/src/context/wmDashboardContext'
import Loader from "@/src/components/loader/page"
import AddressHeader from "@/src/components/Dashboard/AddressHeader/page"
import ActionsTab from "@/src/components/Dashboard/ActionsTab/page"
import MainChart from "@/src/components/Dashboard/MainChart/page"

const Dashboard = ({ params }) => {

    const { timeRangeStart, timeRangeEnd, runReport } = useContext(wmDashbaordContext)
    const [loader, setLoader] = useState(true)
    const [lastValues, setLastValues] = useState()
    const [device, setDevice] = useState()
    const [error, setError] = useState()

    useEffect(()=>{
      setError()
      fetch(`/api/devices/water-monkey/get-device?id=${params.id}`)
      .then(resp => resp.json())
      .then(data => {
        if(data.status === "ok"){
          setDevice(data.device)
          fetch(`/api/dashboard/water-monkey/get-last-values?device=${params.id}`)
          .then(resp => resp.json())
          .then(data => {
            if(data.status === 'ok'){
              setLastValues(data.data)
              setLoader(false)
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
        loader &&
        <Loader />
      }
      {
        error &&
        <p className="error-message">{error}</p>
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
            <MainChart data={lastValues}/>
          </>
        }
      

        <p className="font-semibold text-xl md:text-3xl text-dark-grey">{timeRangeStart && timeRangeStart}</p>
        <p className="font-semibold text-xl md:text-3xl text-dark-grey">{timeRangeEnd && timeRangeEnd}</p>
      </div>
    </>
    
  )
}

export default Dashboard