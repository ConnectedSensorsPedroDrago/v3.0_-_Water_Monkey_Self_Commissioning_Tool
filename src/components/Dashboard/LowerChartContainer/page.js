"use client"


import { useEffect, useState } from 'react'
import LoaderSmall from '@/public/loaderSmall.svg'
import Image from 'next/image'
import LowerChartConsumption from '../LowerChartConsumption/page.js'

const LowerChartContainer = ({label, reportStart, reportEnd, meterType}) => {

    const [error, setError] = useState()
    const [chartData, setChartData] = useState()
    const [load, setLoad] = useState(true)
    const [chartWeekendsStart, setChartWeekendsStart] = useState()
    const [chartWeekendsEnd, setChartWeekendsEnd] = useState()
    const [chartDateNightStart, setChartDateNightStart] = useState()
    const [chartDateNightEnd, setChartDateNightEnd] = useState()

    useEffect(()=>{
        fetch('/api/dashboard/water-monkey/get-chart-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "label": label,
                "date_start": reportStart.timestamp,
                "date_end": reportEnd.timestamp,
                "meter_type": meterType
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === "ok"){
                console.log(data)
                let chartWeekendsStart = []
                let chartWeekendsEnd = []
                let chartDateNightStart = []
                let chartDateNightEnd = []
                setChartData(data.data)
                data.data.waterConsumedLpm.forEach(set => {
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
                data.data.waterConsumedLpm.forEach(set => {
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
                setChartWeekendsStart(chartWeekendsStart)
                setChartWeekendsEnd(chartWeekendsEnd)
                setChartDateNightStart(chartDateNightStart)
                setChartDateNightEnd(chartDateNightEnd)
                setLoad(false)
            }else if(data.status === "error"){
                setError(data.message)
                setLoad(false)
            }
        })
        .catch(e => setError(e))
    }, [])


  return (
    <div className='section-dashboard z-0'>
        {
            load &&
            <div className='w-full flex flex-col justify-center items-center'>
                <Image 
                    src={LoaderSmall}
                    alt="Loader Small"
                />
                <p className='font-semibold text-dark-grey'>Loading charts...</p>
            </div>
        }
        {
            error &&
            <p className='error-message'>{error}</p>
        }
        {
            !error && !load &&
            <>
                <div className='w-full flex flex-col justify-start items-end'>
                    <LowerChartConsumption 
                        chartWeekendsStart={chartWeekendsStart} 
                        chartWeekendsEnd={chartWeekendsEnd} 
                        chartDateNightStart={chartDateNightStart} 
                        chartDateNightEnd={chartDateNightEnd}
                        chartData={chartData}
                        meterType={meterType}
                    />
                </div>
            </>
        }
    </div>
  )
}

export default LowerChartContainer