"use client"

import closeSmallDark from '@/public/closeSmallDark.svg'
import Image from "next/image"
import warningIcon from 'public/warningIcon.svg'
import InputFullPercentWithTitle from '../../InputFullPercentWithTitle/page'
import Input50PercentWithTitle from '../../Input50PercentWithTitle/page'
import Select50PercentWithTitle from '../../Select50PercentWithTitl/page'
import { useState } from 'react'
import { unitOfCost } from '@/src/dbs/formOptions'
import { storage } from '@/src/firebase/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

function RecalibrateModal({ setRecalibrateModal, meterType, commStage, volumePerPulse, label, id, email, setLoader, setMessage, user, org, propertyType, timezone }) {

    console.log("meterType: " + meterType)

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
    const [historicalStart, setHistoricalStart] = useState()
    const [historicalEnd, setHistoricalEnd] = useState()

    async function onSubmit(){
        setLoader(true)

        if(propertyType && propertyType !== "Residential - Single Family Home" && (((meterType === "Single") && (lowSideSecond - lowSideFirst) < 10) || ((meterType === "Compound") && (lowSideSecond - lowSideFirst) >= 10) && (highSideSecond - highSideFirst) >= 10)){
            setLoader(false)
            setMessage(`Not enough water has flown through the water meter beteen the first and the second reading to properly calibrate your Water Monkey. Please make sure that 10m3 have flow through the water meter between the first and the second reading`)
        }else if((meterType === "Single" && (lowSideSecond > lowSideFirst)) && (meterType === "Compound" && (lowSideSecond > lowSideFirst) && (highSideSecond > highSideFirst))){
            setLoader(false)
            setMessage(`Please make sure that the second readings are a higher number than the first readings.`)
        }else if(!dateFirst || !lowSideFirst || !lowSideFirstUnit || (meterType === 0 && !highSideFirst) || (meterType === 0  && !highSideFirstUnit) || !picFirst || !dateSecond || !lowSideSecond || !lowSideSecondUnit || (meterType === 0 && !highSideSecond) || (meterType === 0 && !highSideSecondUnit) || !picSecond){
            setLoader(false)
            setMessage(`Please make sure that all the required fields are completed. Keep in mind that, in this case, both readings should be submitted at the same time.`)
        }else{
            submitRecommissionn()
        }
    }

    async function submitRecommissionn(){
        let picURL1
        let picURL2
        
        const imageRef1 = ref(storage, `WM_Readings/${org.name}/${id}/${org.name}_${id}_FirstReadings_${user.name}_${dateFirst.timestamp}.jpg`)
        const imageRef2 = ref(storage, `WM_Readings/${org.name}/${id}/${org.name}_${id}_FirstReadings_${user.name}_${dateSecond.timestamp}.jpg`)

        uploadBytes(imageRef1, picFirst, {contentType: 'image/jpg'})
            .then((snapshot)=> {
                getDownloadURL(snapshot.ref)
                    .then((url) =>{
                        picURL1 = url.toString()
                    })
                    .then(()=> {
                        uploadBytes(imageRef2, picSecond, {contentType: 'image/jpg'})
                            .then((snapshot)=> {
                                getDownloadURL(snapshot.ref)
                                    .then((url) =>{
                                        picURL2 = url.toString()
                                    })
                                    .then(()=> {
                                        fetch("/api/comm-tool/step-3-calculate-volume-per-pulse", {
                                            method: "POST",
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                "meterType": meterType === 1 ? "Single" : "Compound",
                                                "label": label,
                                                "commStage": meterType === 1 ? 
                                                    {
                                                        "stage": "recalibrate",
                                                        "first": {"date_time": dateFirst, "low": lowSideFirst, "low_unit": lowSideFirstUnit, "pic": picURL1},
                                                        "second": {"date_time": dateSecond, "low": lowSideSecond, "low_unit": lowSideSecondUnit, "pic": picURL2}
                                                    }
                                                    : 
                                                    {
                                                        "stage": "recalibrate",
                                                        "first": {"date_time": dateFirst, "low": lowSideFirst, "low_unit": lowSideFirstUnit, "high": highSideFirst, "high_unit": highSideFirstUnit, "pic": picURL1},
                                                        "second": {"date_time": dateSecond, "low": lowSideSecond, "low_unit": lowSideSecondUnit, "high": highSideSecond, "high_unit": highSideSecondUnit, "pic": picURL2}
                                                    }
                                            })
                                        })
                                        .then(res => res.json())
                                        .then(data => {
                                            let body = meterType === 0 ?
                                                {
                                                    "label": label,
                                                    "commStage": JSON.stringify(commStage),
                                                    "meterType": "Compound",
                                                    "dateFirst": dateFirst,
                                                    "lowSideFirst": Number(lowSideFirst),
                                                    "lowSideFirstUnit": lowSideFirstUnit,
                                                    "highSideFirst": Number(highSideFirst),
                                                    "highSideFirstUnit": highSideFirstUnit,
                                                    "picFirst": picURL1,
                                                    "dateSecond": dateSecond,
                                                    "lowSideSecond": Number(lowSideSecond),
                                                    "lowSideSecondUnit": lowSideSecondUnit,
                                                    "highSideSecond": Number(highSideSecond),
                                                    "highSideSecondUnit": highSideSecondUnit,
                                                    "picSecond": picURL2,
                                                    "volumePerPulse": volumePerPulse
                                                }
                                                :
                                                {
                                                    "label": label,
                                                    "commStage": JSON.stringify(commStage),
                                                    "meterType": "Single",
                                                    "dateFirst": dateFirst,
                                                    "lowSideFirst": Number(lowSideFirst),
                                                    "lowSideFirstUnit": lowSideFirstUnit,
                                                    "picFirst": picURL1,
                                                    "dateSecond": dateSecond,
                                                    "lowSideSecond": Number(lowSideSecond),
                                                    "lowSideSecondUnit": lowSideSecondUnit,
                                                    "picSecond": picURL2,
                                                    "volumePerPulse": volumePerPulse
                                                }
                                            if(data.status === 'ok'){
                                                if(meterType === 0){
                                                    body.primary_volume_per_pulse = data.data.primary_volume_per_pulse
                                                    body.secondary_volume_per_pulse = data.data.secondary_volume_per_pulse
                                                }else{
                                                    body.primary_volume_per_pulse = data.data.primary_volume_per_pulse
                                                }
                                                setLoader(false)
                                                fetch(`/api/dashboard/water-monkey/recalibrate`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify(body)
                                                })
                                                .then(res => res.json())
                                                .then(data => {
                                                    if(data.status && data.status === 'ok'){
                                                        setLoader(false)
                                                        setMessage("Your Water Monkey new readings have been successfully submitted. We will review them to make sure everything went ok, recalculate your historical data and restore the dashboard access.")
                                                    }else{
                                                        setLoader(false)
                                                        setMessage("There was an error submitting your readings, pelase try again or contact support.")
                                                    }
                                                })
                                            }else{
                                                setLoader(false)
                                                setMessage(data.message)
                                            }
                                        })
                                        .catch(e => {
                                            setLoader(false)
                                            setMessage('There was an error calculating the new volume per pulse: ' + e + '. Please try again or contact support.')
                                        })
                                    })
                            })
                            .catch(e => {
                                setLoader(false)
                                setMessage('There was an error uploading the picture of the second reding: ' + e + '. Please try again or contact support.')
                            })
                    })
            })
            .catch(e => {
                setLoader(false)
                setMessage('There was an error uploading the picture of the first reding: ' + e + '. Please try again or contact support.')
            })
    }

    async function downloadHistoricalData(){
        setLoader(true)
        if(label && email && historicalStart && historicalStart.timestamp && historicalEnd && historicalEnd.timestamp){
            fetch('/api/devices/dowload-historical-data', {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({
                    email: email,
                    label: label,
                    timezone: timezone,
                    timestamp_start: historicalStart.timestamp,
                    timestamp_end: historicalEnd.timestamp
                })
            })
                .then(res => res.json())
                .then(data => {
                    if(data.status === "ok"){
                        setLoader(false)
                        setMessage(`The Historical Data has been requested properly. You will receive an email (at the one associated to your account: ${email}) with a csv file containing the requested data. This may take some minutes, please be patient. If you do not receive it soon, please try again or contact support. Please keep in mind that continuig with the Recalibration process will result in the deletion of old data so please make sure you have properly received your csv back up before moving forward. Thanks.`)
                    }else if(data.status === "error"){
                        setLoader(false)
                        setMessage(data.message)
                    }else{
                        setLoader(false)
                        setMessage("There was an error requesting your historical data download. Please try again or contact support.")
                    }
                })
        }else{
            setLoader(false)
            setMessage('Please make sure to complete all the required fields before requesting the Historical Data download.')
        }
    }

  return (
    <div className='fixed top-0 w-full h-full flex flex-col justify-center items-center background-blur z-50'>
        <div className=" flex flex-col items-center justify-start md:justify-center w-full md:max-w-[60rem] h-full md:h-fit bg-white rounded shadow-md p-4 md:border-grey border-[0.05rem] overflow-scroll">
            <div className="w-full flex flex-row items-end justify-end">
                <Image
                    src={closeSmallDark}
                    className="md:hover:scale-125 cursor-pointer scale-[300%] md:scale-100"
                    alt={"close modal"}
                    onClick={()=>{
                        setRecalibrateModal(false)
                    }}
                />
            </div>
            <div className="flex flex-col items-center w-full">
                <div className='bg-white rounded w-full text-[0.75rem] text-red p-[1rem] border-red border-[0.25rem]'>
                    <div className='mb-[0.5rem] bg-white rounded flex flex-row items-center justify-start'>
                        <Image 
                            src={warningIcon}
                            className='mr-[0.5rem] md:mr-[1rem]'
                            alt={"warning"}
                        />
                        <p className='text-[1.5rem] font-bold text-center text-red'>
                            READ BEFORE SUBMITTING
                        </p>
                        
                    </div>
                    <p>
                        To Recalibrate your Water Monkey you will be required to submit two new meter readings. If your Property Type is not "Residential - Single Family Home" please make sure that at least 10m3 has flown through your water meter between the first and the second reading (in both sides, if your water meter is a Compound one).
                    </p>
                    <p>
                        Once you have gathered both readings, pelase come back to this window and load both readings to trigger the Recommissioning process.
                    </p>
                    <p>
                        Please keep in mind that triggering a Recalibrate may cause your current historical data to be modified with the new calculated Volume Per Pulse value so, if you intend to keep a backup of that data, make sure to download it below before triggering the Recommissioning process.
                    </p>
                </div>
            </div>
            <p className="font-semibold text-3xl text-blue-hard w-full text-start mt-[1rem] mb-[1rem]">Download Historical Data</p>
            <p className={`text-dark-grey font-bold text-[1rem] md:text-[1.2rem] mb-[0.5rem]`}>Download historical data before modifying it with new readings</p>
            <div className='w-full md:w-[90%] flex md:flex-row flex-col items-start justify-center'>
                <div className='w-full flex flex-col'>
                    <InputFullPercentWithTitle 
                        name={"Start"}
                        type={"datetime-local"}
                        setter={setHistoricalStart}
                    />
                </div>
                <div className='w-full flex flex-col md:ml-[0.5rem] md:mt-0 mt-[1rem]'>
                    <InputFullPercentWithTitle 
                        name={"End"}
                        type={"datetime-local"}
                        setter={setHistoricalEnd}
                    />
                </div>
            </div>
            <button 
                className="button-small-blue text-[1rem] mt-[1rem]"
                onClick={()=>{
                    downloadHistoricalData()
                }}
            >
                Download
            </button>
            <p className="font-semibold text-3xl text-blue-hard w-full text-start mt-[1rem] mb-[1rem]">Recalibrate</p>
            <div className='w-full md:w-[90%] flex md:flex-row flex-col items-start justify-center'>
                <div className='w-full flex flex-col'>
                    <div className='flex flex-row items-start justify-between w-full'>
                        <p className={`text-dark-grey font-bold text-[1rem] md:text-[1.2rem] mb-[0.5rem]`}>Enter first new meter reading</p>
                    </div>
                        <>
                            <InputFullPercentWithTitle 
                                name={"Date and Time"}
                                type={"datetime-local"}
                                setter={setDateFirst}
                            />
                            <div className='flex flex-row justify-between items-center'>
                                <Input50PercentWithTitle 
                                    name={meterType === 1 ? "Meter Reading" : "Low Side Meter Reading"}
                                    type={"number"}
                                    setter={setLowSideFirst}
                                />
                                <Select50PercentWithTitle 
                                    name={"Reading Unit"}
                                    type={"number"}
                                    elements={unitOfCost}
                                    setter={setLowSideFirstUnit}
                                />
                            </div>
                            {
                                meterType === 0 &&
                                <div className='flex flex-row justify-between items-center'>
                                    <Input50PercentWithTitle 
                                        name={"High Side Meter Reading"}
                                        type={"number"}
                                        setter={setHighSideFirst}
                                    />
                                    <Select50PercentWithTitle 
                                        name={"Reading Unit"}
                                        type={"select"}
                                        elements={unitOfCost}
                                        setter={setHighSideFirstUnit}
                                    />
                                </div>
                            }
                            <InputFullPercentWithTitle 
                                name={"Submit Meter Photo"}
                                type={"file"}
                                placeholder={"Select File"}
                                setter={setPicFirst}
                            />
                        </>

                </div>
                <div className='w-full flex flex-col md:ml-[0.5rem] md:mt-0 mt-[1rem]'>
                    <div className='flex flex-row items-start justify-between w-full'>
                        <p className={`text-dark-grey font-bold text-[1rem] md:text-[1.2rem] mb-[0.5rem]`}>Enter second new meter reading</p>
                    </div>
                        <>
                            <InputFullPercentWithTitle 
                                name={"Date and Time"}
                                type={"datetime-local"}
                                setter={setDateSecond}
                            />
                            <div className='flex flex-row justify-between items-center'>
                                <Input50PercentWithTitle 
                                    name={meterType === 1 ? "Meter Reading" : "Low Side Meter Reading"}
                                    type={"number"}
                                    setter={setLowSideSecond}
                                />
                                <Select50PercentWithTitle 
                                    name={"Reading Unit"}
                                    type={"select"}
                                    elements={unitOfCost}
                                    setter={setLowSideSecondUnit}
                                />
                            </div>
                            {
                                meterType === 0 &&
                                <div className='flex flex-row justify-between items-center'>
                                    <Input50PercentWithTitle 
                                        name={"High Side Meter Reading"}
                                        type={"number"}
                                        setter={setHighSideSecond}
                                    />
                                    <Select50PercentWithTitle 
                                        name={"Reading Unit"}
                                        type={"select"}
                                        elements={unitOfCost}
                                        setter={setHighSideSecondUnit}
                                    />
                                </div>
                            }
                            <InputFullPercentWithTitle 
                                name={"Submit Meter Photo"}
                                type={"file"}
                                placeholder={"Select File"}
                                setter={setPicSecond}
                            />
                        </>
                </div>
            </div>
            <button 
                className="button-small-blue text-[1rem] mt-[1rem]"
                onClick={()=>{
                    onSubmit()
                }}
            >
                Recalibrate
            </button>
        </div>
    </div>
  )
}

export default RecalibrateModal