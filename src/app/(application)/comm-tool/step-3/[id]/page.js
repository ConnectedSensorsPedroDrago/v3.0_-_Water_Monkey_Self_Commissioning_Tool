"use client"

import CommToolTop from '@/src/components/CommToolTop/page'
import Image from 'next/image'
import DownloadPDF from "@/public/downloadPDF.svg"
import InputFullPercentWithTitle from '@/src/components/InputFullPercentWithTitle/page'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import requestWM from '@/src/functions/step2RequestWM'
import Loader from '@/src/components/loader/page'
import successTick from '@/public/successTick.svg'

const Step3 = ({params}) => {

    const [dateFirst, setDateFirst] = useState()
    const [lowSideFirst, setLowSideFirst] = useState()
    const [highSideFirst, setHighSideFirst] = useState()
    const [picFirst, setPicFirst] = useState()
    const [dateSecond, setDateSecond] = useState()
    const [lowSideSecond, setLowSideSecond] = useState()
    const [highSideSecond, setHighSideSecond] = useState()
    const [picSecond, setPicSecond] = useState()
    const [meterType, setMeterType] = useState()
    const [load, setLoad] = useState(true)
    const [error, setError] = useState()
    const [commStage, setCommStage] = useState()
    
    useEffect(()=>{
        requestWM(params.id)
            .then(data => {
                console.log(data)
                setLoad(false)
                if(data.status === "ok"){
                    let commissionStage = JSON.parse(data.device.properties.commission_stage)
                    setMeterType(data.device.properties.meter_type)
                    setCommStage(commissionStage)
                    commissionStage.first.date_time && setDateFirst(commissionStage.first.date_time)
                    commissionStage.second.date_time && setDateSecond(commissionStage.second.date_time)
                }
                if(data.status === "error"){
                    setError(data.message)
                }
            })
    }, [])

    const onSubmitFirst = async() => {
        let payload = meterType === "Single" ? 
            {"date_time": dateFirst, "low": lowSideFirst}
            : 
            {"date_time": dateFirst, "low": lowSideFirst, "high": highSideFirst}
        console.log(payload)
        try{
            console.log(params.id)
            let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/~${params.id}/`, {
                method: 'PATCH',
                headers:{
                    'Content-Type':'application/json',
                    'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                },
                body: JSON.stringify({
                    "properties": {
                        "commission_stage": JSON.stringify({
                            "stage": "first reading",
                            "first": payload,
                            "second": commStage.second
                        })
                    }
                })
            })
            let data = await response.json()
            if(data.label === params.id){
                setCommStage(JSON.parse(data.properties.commission_stage))
            }
            console.log(data)
        }catch(e){
            setError("There was an error writting the first readings: " + e + ". Please try again or contact support.")
        }
    }

    const onSubmitSecond = async() => {
        let payload = meterType === "Single" ? 
            {"date_time": dateSecond, "low": lowSideSecond}
            : 
            {"date_time": dateSecond, "low": lowSideSecond, "high": highSideSecond}
        console.log(payload)
        try{
            let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/devices/~${params.id}/`, {
                method: 'PATCH',
                headers:{
                    'Content-Type':'application/json',
                    'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                },
                body: JSON.stringify({
                    "properties": {
                        "commission_stage": JSON.stringify({
                            "stage": "second reading",
                            "first": commStage.first,
                            "second": payload
                        })
                    }
                })
            })
            let data = await response.json()
            if(data.label === params.id){
                setCommStage(JSON.parse(data.properties.commission_stage))
            }
            console.log(data)
        }catch(e){
            setError("There was an error writting the first readings: " + e + ". Please try again or contact support.")
        }
    }

    console.log(commStage)

  return (
    <div className='container-pages h-fit'>
        {
            load &&
            <Loader />
        }
        <CommToolTop 
            title={"Step 3"}
            back={`/comm-tool/step-2/${params.id}`}
        />
        {
            error &&
            <p className='error-message'>{error}</p>
        }
        <div>
            <div className='flex flex-row items-center mb-[2rem]'>
                <Link 
                    className='flex flex-col items-center cursor-pointer hover:scale-105 duration-500'
                    href={'@/public/pdf/Installation_Guide_Water_Monkey.pdf'}
                    download="Water Monkey Installation Guide.pdf"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Image
                        alt={"Download PDF"}
                        src={DownloadPDF}
                        className='mr-[1rem] scale-75 md:scale-100'
                    />
                    <p className='underline hover:font-bold text-[0.8rem] text-dark-grey'>Download</p>
                </Link>
                <h1 className="text-[1.5rem] lg:text-[3.25rem] font-bold text-center text-blue-hard">Download the On-site Installation Guide</h1>
            </div>
        </div>
        <h1 className="text-[1.5rem] lg:text-[3.25rem] font-bold text-center text-blue-hard mb-[1.5rem] md:mb-[1.5rem]">After successful install...</h1>
        <div className='w-full md:w-[90%] flex md:flex-row flex-col items-start justify-center'>
            <div className='w-full flex flex-col'>
                <p className={`${commStage && commStage.first.date_time ? `text-grey` : `text-dark-grey`} font-bold text-[1.2rem] md:text-[1.5rem] mb-[1rem]`}>Enter initial meter readings</p>
                <InputFullPercentWithTitle 
                    name={"Date and Time"}
                    type={"datetime-local"}
                    placeholder={commStage && commStage.first.date_time ? commStage.first.date_time : ""}
                    setter={setDateFirst}
                    disabled={commStage && commStage.first.date_time ? true : false}
                />
                <InputFullPercentWithTitle 
                    name={meterType === "Single" ? "Meter Reading" : "Low Side Meter Reading"}
                    type={"number"}
                    placeholder={commStage && commStage.first.low ? commStage.first.low : ""}
                    setter={setLowSideFirst}
                    disabled={commStage && commStage.first.date_time ? true : false}
                />
                {
                    meterType === "Compound" &&
                    <InputFullPercentWithTitle 
                        name={"High Side Meter Reading"}
                        type={"number"}
                        placeholder={commStage && commStage.first.high ? commStage.first.high : ""}
                        setter={setHighSideSecond}
                        disabled={commStage && commStage.first.date_time ? true : false}
                    />
                }
                <InputFullPercentWithTitle 
                    name={"Submit Meter Photo"}
                    type={"file"}
                    placeholder={"Select File"}
                    setter={setPicFirst}
                    disabled={commStage && commStage.first.date_time ? true : false}
                />
                {   commStage && !commStage.first.date_time ?
                    <button 
                        className=" md:mt-0 w-full button-small text-[1rem] h-[2.5rem]"
                        onClick={()=> onSubmitFirst()}
                    >
                        Submit
                    </button>
                    :
                    <div className='w-full border-grey border-[0.05rem] bg-light-yellow rounded p-3'>
                        <div className='w-full flex items-center justify-start'>
                            <Image 
                                src={successTick}
                                alt="Success Tick"
                                className='scale-[75%]'
                            />
                            <p className='ml-[0.5rem] font-semibold text-[1rem] text-dark-grey'>Readings successfully submitted at: {dateFirst}</p>
                        </div>
                        <p className='text-grey font-light text-sm mt-[0.5rem]'>Please remember to take your second readings as close and accurate to 24 hours after these first readings.</p>
                    </div>
                }
                
            </div>
            <div className='w-full flex flex-col md:ml-[1rem] md:mt-0 mt-[2rem]'>
                <p className={`${commStage && !commStage.second.date_time && commStage.first.date_time ? `text-dark-grey` : `text-grey`} font-bold text-[1.2rem] md:text-[1.5rem] mb-[1rem]`}>Enter final meter readings</p>
                <InputFullPercentWithTitle 
                    name={"Date and Time"}
                    type={"datetime-local"}
                    placeholder={""}
                    setter={setDateSecond}
                    disabled={commStage && !commStage.second.date_time && commStage.first.date_time ? false : true}
                />
                <InputFullPercentWithTitle 
                    name={meterType === "Single" ? "Meter Reading" : "Low Side Meter Reading"}
                    type={"number"}
                    placeholder={""}
                    setter={setLowSideSecond}
                    disabled={commStage && !commStage.second.date_time && commStage.first.date_time ? false : true}
                />
                {
                    meterType === "Compound" &&
                    <InputFullPercentWithTitle 
                        name={"High Side Meter Reading"}
                        type={"number"}
                        placeholder={""}
                        setter={setHighSideSecond}
                        disabled={commStage && !commStage.second.date_time && commStage.first.date_time ? false : true}
                    />
                }
                <InputFullPercentWithTitle 
                    name={"Submit Meter Photo"}
                    type={"file"}
                    placeholder={"Select File"}
                    setter={setPicSecond}
                    disabled={commStage && !commStage.second.date_time && commStage.first.date_time ? false : true}
                />
                {   commStage && !commStage.second.date_time && commStage.first.date_time ?
                    <button 
                        className="md:mt-0 w-full button-small text-[1rem] h-[2.5rem]"
                        onClick={()=> onSubmitSecond()}
                    >
                        Submit
                    </button>
                    :
                    commStage && commStage.second.date_time &&
                    <div className='w-full border-grey border-[0.05rem] bg-light-yellow rounded p-3'>
                        <div className='w-full flex items-center justify-start'>
                            <Image 
                                src={successTick}
                                alt="Success Tick"
                                className='scale-[75%]'
                            />
                            <p className='ml-[0.5rem] font-semibold text-[1rem] text-dark-grey'>Readings successfully submitted at: {dateSecond}</p>
                        </div>
                        <p className='text-grey font-light text-sm mt-[0.5rem]'>Readings completed! You will be contacted by one of our representatives once the calibration process is finished.</p>
                    </div>
                }
            </div>
        </div>
    </div>
  )
}

export default Step3