"use client"

import CommToolTop from '@/src/components/CommToolTop/page'
import Image from 'next/image'
import DownloadPDF from "@/public/downloadPDF.svg"
import InputFullPercentWithTitle from '@/src/components/InputFullPercentWithTitle/page'
import Link from 'next/link'
import { useState, useEffect, useContext } from 'react'
import requestWM from '@/src/functions/step2RequestWM'
import Loader from '@/src/components/loader/page'
import successTick from '@/public/successTick.svg'
import { completeUser } from '@/src/functions/completeUser'
import { userContext } from '@/src/context/userContext'
import YouTubeVideo from '@/src/components/YouTubeVideo/page'
import Input50PercentWithTitle from '@/src/components/Input50PercentWithTitle/page'
import Select50PercentWithTitle from '@/src/components/Select50PercentWithTitl/page'
import { unitOfCost } from '@/src/dbs/formOptions'
import { storage } from '@/src/firebase/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const Step3 = ({params}) => {

    const { setUser, user, setLoader, setPortfolio, userSession } = useContext(userContext)

    const [label, setLabel] = useState()
    const [org, setOrg] = useState()
    const [dateFirst, setDateFirst] = useState()
    const [lowSideFirst, setLowSideFirst] = useState()
    const [lowSideFirstUnit, setLowSideFirstUnit] = useState()
    const [highSideFirst, setHighSideFirst] = useState()
    const [highSideFirstUnit, setHighSideFirstUnit] = useState()
    const [picFirst, setPicFirst] = useState()
    const [dateSecond, setDateSecond] = useState()
    const [lowSideSecond, setLowSideSecond] = useState()
    const [lowSideSecondUnit, setLowSideSecondUnit] = useState()
    const [highSideSecond, setHighSideSecond] = useState()
    const [highSideSecondUnit, setHighSideSecondUnit] = useState()
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
                    setOrg(data.device.organization.name)
                    setCommStage(commissionStage)
                    setLabel(data.device.label)
                    commissionStage.first.date_time && setDateFirst(commissionStage.first.date_time)
                    commissionStage.second.date_time && setDateSecond(commissionStage.second.date_time)
                }
                if(data.status === "error"){
                    setError(data.message)
                }
            })
    }, [])

    const onSubmitFirst = async() => {
        let picURL
        setError()
        if(meterType === "Single" && lowSideFirst && dateFirst && lowSideFirstUnit && picFirst || meterType === "Compound" && lowSideFirst && highSideFirst && lowSideFirstUnit && highSideFirstUnit && dateFirst && picFirst){
            setLoad(true)
            let newLowSideFirst = lowSideFirstUnit === "m3" ? lowSideFirst : lowSideFirstUnit === "liters" ? Number(lowSideFirst)*0.001 : lowSideFirstUnit === "gallons" && Number(lowSideFirst)*0.00378541
            let newHighSideFirst = highSideFirstUnit === "m3" ? highSideFirst : highSideFirstUnit === "liters" ? Number(highSideFirst)*0.001 : highSideFirstUnit === "gallons" && Number(highSideFirst)*0.00378541

            if(picFirst === null){
                setError("No image was found")
                return
            }
            const imageRef = ref(storage, `WM_Readings/${org}/${params.id}/${org}_${params.id}_FirstReadings_${user.name}_${dateFirst}.jpg`)
            uploadBytes(imageRef, picFirst, {contentType: 'image/jpg'})
                .then((snapshot)=> {
                    console.log(snapshot)
                    getDownloadURL(snapshot.ref)
                        .then((url) =>{
                            picURL = url.toString()
                            console.log(picURL)
                        })
                        .then(async()=>{
                            try{
                                let payload = {"initial_meter_reading_primary": {"value": newLowSideFirst, "context": {"pic": picURL, "date_time": dateFirst}}}
                                meterType === "Compound" && (payload = {"initial_meter_reading_primary": {"value": newLowSideFirst, "context": {"pic": picURL, "date_time": dateFirst}}, "initial_meter_reading_secondary": {"value": newHighSideFirst, "context": {"pic": picURL, "date_time": dateFirst}}})
                                let response = await fetch(`https://industrial.api.ubidots.com/api/v1.6/devices/${params.id}/`, {
                                    method: 'POST',
                                    headers:{
                                        'Content-Type':'application/json',
                                        'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                                    },
                                    body: JSON.stringify(payload)
                                })
                                let data = await response.json()
                                console.log(data)
                                if(!data.initial_meter_reading_primary){
                                    setError("There was an error writting the first readings. Please try again or contact support.")
                                }
                            }catch(e){
                                setError("There was an error writting the first readings: " + e + ". Please try again or contact support.")
                            }finally{
                                try{
                                    let payload = meterType === "Single" ? 
                                        {"date_time": dateFirst, "low": lowSideFirst, "low_unit": lowSideFirstUnit, "pic": picURL}
                                        : 
                                        {"date_time": dateFirst, "low": lowSideFirst, "low_unit": lowSideFirstUnit, "high": highSideFirst, "high_unit": highSideFirstUnit, "pic": picURL}
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
                                    completeUser(setUser, userSession, setLoader, user, setPortfolio)
                                        .then(data => {
                                            if(data.status === 'ok'){
                                                setLoad(false)
                                            }
                                        })
                                }catch(e){
                                    setError("There was an error writting the first readings: " + e + ". Please try again or contact support.")
                                }
                            }
                        })
                })
            
            
        }else{
            setError("Please complete all the required fields to submit the first readings")
        }
    }

    const onSubmitSecond = async() => {
        setError()
        if(meterType === "Single" && lowSideSecond && lowSideSecondUnit && dateSecond || meterType === "Compound" && lowSideSecond && highSideSecond && lowSideSecondUnit && highSideSecondUnit && dateSecond){
            setLoad(true)
            let newLowSideSecond = lowSideSecondUnit === "m3" ? lowSideSecond : lowSideSecondUnit === "liters" ? Number(lowSideSecond)*0.001 : lowSideSecondUnit === "gallons" && Number(lowSideSecond)*0.00378541
            let newHighSideSecond = highSideSecondUnit === "m3" ? highSideSecond : highSideSecondUnit === "liters" ? Number(highSideSecond)*0.001 : highSideSecondUnit === "gallons" && Number(highSideSecond)*0.00378541

            try{
                let payload = {"final_meter_reading_primary": {"value": newLowSideSecond}}
                meterType === "Compound" && (payload = {"final_meter_reading_primary": {"value": newLowSideSecond}, "final_meter_reading_secondary": {"value": newHighSideSecond}})
                let response = await fetch(`https://industrial.api.ubidots.com/api/v1.6/devices/${params.id}/`, {
                    method: 'POST',
                    headers:{
                        'Content-Type':'application/json',
                        'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                    },
                    body: JSON.stringify(payload)
                })
                let data = await response.json()
                console.log(data)
                if(!data.final_meter_reading_primary){
                    setError("There was an error writting the first readings. Please try again or contact support.")
                }
            }catch(e){
                setError("There was an error writting the first readings: " + e + ". Please try again or contact support.")
            }finally{
                try{
                    let payload = meterType === "Single" ? 
                        {"date_time": dateSecond, "low": newLowSideSecond}
                        : 
                        {"date_time": dateSecond, "low": newLowSideSecond, "high": newHighSideSecond}
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
                    completeUser(setUser, userSession, setLoader, user, setPortfolio)
                        .then(data => {
                            if(data.status === 'ok'){
                                setLoad(false)
                            }
                        })
                }catch(e){
                    setError("There was an error writting the second readings: " + e + ". Please try again or contact support.")
                }
            }
        }else{
            setError("Please complete all the required fields to submit the second readings")
        }
    }

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
        <h1 className="text-[1.5rem] lg:text-[3.25rem] font-bold text-center text-blue-hard">Install your Water Monkey on site</h1>
            <div className='flex flex-col md:flex-row justify-center items-center w-full mt-[1.5rem] md:mt-[1.5rem] mb-[2rem]'>
                <div className='flex flex-col items-center w-full justify-center'>
                    <h1 className="text-[1rem] lg:text-[1rem] font-bold text-center text-dark-grey mb-[0.5rem]">Watch the YouTube Installation Guide</h1>
                    <YouTubeVideo 
                        videoId="aHAi1LEUCRc" 
                    />                   
                </div>
                <div className='flex flex-col items-center w-full justify-center mt-[1rem] md:mt-[-3rem]'>
                    <h1 className="text-[1rem] lg:text-[1rem] mb-[0.5rem] font-bold text-start md:text-center text-dark-grey">Download the "On-site Installation Guide"</h1>
                    <Link 
                        className='flex flex-col items-center cursor-pointer hover:scale-125 duration-500'
                        href={'@/public/pdf/Installation_Guide_Water_Monkey.pdf'}
                        download="Water Monkey Installation Guide.pdf"
                        target="_blank"
                        rel="noreferrer"
                    >
                        
                        <Image
                            alt={"Download PDF"}
                            src={DownloadPDF}
                            className='md:mr-[-1.5rem] md:scale-[100%]'
                        />
                    </Link>
                    
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
                <div className='flex flex-row justify-between items-center'>
                    <Input50PercentWithTitle 
                        name={meterType === "Single" ? "Meter Reading" : "Low Side Meter Reading"}
                        type={"number"}
                        placeholder={commStage && commStage.first.low ? commStage.first.low : ""}
                        setter={setLowSideFirst}
                        disabled={commStage && commStage.first.date_time ? true : false}
                    />
                    <Select50PercentWithTitle 
                        name={"Reading Unit"}
                        type={"number"}
                        elements={unitOfCost}
                        placeholder={commStage && commStage.first.low_unit ? commStage.first.low_unit : ""}
                        setter={setLowSideFirstUnit}
                        disabled={commStage && commStage.first.date_time ? true : false}
                    />
                </div>
                {
                    meterType === "Compound" &&
                    <div className='flex flex-row justify-between items-center'>
                        <Input50PercentWithTitle 
                            name={"High Side Meter Reading"}
                            type={"number"}
                            placeholder={commStage && commStage.first.high ? commStage.first.high : ""}
                            setter={setHighSideFirst}
                            disabled={commStage && commStage.first.date_time ? true : false}
                        />
                        <Select50PercentWithTitle 
                            name={"Reading Unit"}
                            type={"select"}
                            elements={unitOfCost}
                            placeholder={commStage && commStage.first.high_unit ? commStage.first.high_unit : ""}
                            setter={setHighSideFirstUnit}
                            disabled={commStage && commStage.first.date_time ? true : false}
                        />
                    </div>
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
                    placeholder={commStage && commStage.second.date_time ? commStage.second.date_time : ""}
                    setter={setDateSecond}
                    disabled={commStage && !commStage.second.date_time && commStage.first.date_time ? false : true}
                />
                <div className='flex flex-row justify-between items-center'>
                    <Input50PercentWithTitle 
                        name={meterType === "Single" ? "Meter Reading" : "Low Side Meter Reading"}
                        type={"number"}
                        placeholder={commStage && commStage.second.low ? commStage.second.low : ""}
                        setter={setLowSideSecond}
                        disabled={commStage && !commStage.second.date_time && commStage.first.date_time ? false : true}
                    />
                    <Select50PercentWithTitle 
                            name={"Reading Unit"}
                            type={"select"}
                            elements={unitOfCost}
                            placeholder={commStage && commStage.second.low_unit ? commStage.second.low_unit : ""}
                            setter={setLowSideSecondUnit}
                            disabled={commStage && !commStage.second.date_time && commStage.first.date_time ? false : true}
                    />
                </div>
                {
                    meterType === "Compound" &&
                    <div className='flex flex-row justify-between items-center'>
                        <InputFullPercentWithTitle 
                            name={"High Side Meter Reading"}
                            type={"number"}
                            placeholder={commStage && commStage.second.high ? commStage.second.high : ""}
                            setter={setHighSideSecond}
                            disabled={commStage && !commStage.second.date_time && commStage.first.date_time ? false : true}
                        />
                        <Select50PercentWithTitle 
                            name={"Reading Unit"}
                            type={"select"}
                            elements={unitOfCost}
                            placeholder={commStage && commStage.second.high_unit ? commStage.second.high_unit : ""}
                            setter={setHighSideSecondUnit}
                            disabled={commStage && !commStage.second.date_time && commStage.first.date_time ? false : true}
                        />
                    </div>
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
        {
            error &&
            <p className='error-message'>{error}</p>
        }
    </div>
  )
}

export default Step3