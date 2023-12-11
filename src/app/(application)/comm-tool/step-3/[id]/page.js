"use client"

import CommToolTop from '@/src/components/CommToolTop/page'
import Image from 'next/image'
import DownloadPDF from "@/public/downloadPDF.svg"
import InputFullPercentWithTitle from '@/src/components/InputFullPercentWithTitle/page'
import Link from 'next/link'
import { useState, useEffect, useContext } from 'react'
import Loader from '@/src/components/loader/page'
import successTick from '@/public/successTick.svg'
import { userContext } from '@/src/context/userContext'
import YouTubeVideo from '@/src/components/YouTubeVideo/page'
import Input50PercentWithTitle from '@/src/components/Input50PercentWithTitle/page'
import Select50PercentWithTitle from '@/src/components/Select50PercentWithTitl/page'
import { unitOfCost } from '@/src/dbs/formOptions'
import { storage } from '@/src/firebase/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import ButtonSmall from '@/src/components/buttonSmall/page'
import EditButton from '@/public/editButton.svg'
import Success from '@/src/components/Success/page'
import { timeZones } from '@/src/dbs/formOptions'

const Step3 = ({params}) => {

    const { setUser, user, setLoader, setPortfolio, userSession } = useContext(userContext)

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
    const [timeZoneFirst, setTimeZoneFirst] = useState()
    const [timeZoneSecond, setTimeZoneSecond] = useState()
    const [picSecond, setPicSecond] = useState()
    const [meterType, setMeterType] = useState()
    const [load, setLoad] = useState(true)
    const [error, setError] = useState()
    const [commStage, setCommStage] = useState()
    const [success, setSuccess] = useState(false)
    
    useEffect(()=>{
        fetch(`/api/devices/water-monkey/get-device?id=~${params.id}`)
            .then(res => res.json())
            .then(data => {

                setLoad(false)
                if(data.status === "ok"){
                    let commissionStage = JSON.parse(data.device.properties.commission_stage)
                    setMeterType(data.device.properties.meter_type)
                    setOrg(data.device.organization.name)
                    setCommStage(commissionStage)
                    commissionStage.first.date_time && setDateFirst(commissionStage.first.date_time)
                    commissionStage.second.date_time && setDateSecond(commissionStage.second.date_time)
                    commissionStage.stage === 'failed' && setError(`Commissioning failed: ${commissionStage.message}. Please reset readings and try again`)
                }
                if(data.status === "error"){
                    setError(data.message)
                }
            })
    }, [params])

    const onSubmitFirst = async() => {
        setError()
        setLoad(true)
        let picURL
        let comm_stage
        if(picFirst === null){
            setError("No image was found")
            return
        }
        const imageRef = ref(storage, `WM_Readings/${org}/${params.id}/${org}_${params.id}_FirstReadings_${user.name}_${dateFirst}.jpg`)
        uploadBytes(imageRef, picFirst, {contentType: 'image/jpg'})
            .then((snapshot)=> {
                getDownloadURL(snapshot.ref)
                    .then((url) =>{
                        picURL = url.toString()
                    })
                    .then(()=>{
                        fetch('/api/comm-tool/step-3-first-readings', {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                meterType: meterType,
                                lowSideFirst: lowSideFirst,
                                dateFirst: dateFirst,
                                timeZoneFirst: timeZoneFirst,
                                lowSideFirstUnit: lowSideFirstUnit,
                                picFirst: picFirst,
                                highSideFirst: highSideFirst,
                                highSideFirstUnit: highSideFirstUnit,
                                org: org,
                                params: params,
                                user: user,
                                commStage: commStage,
                                picURL: picURL,
                                setUser: setUser,
                                userSession: userSession,
                                setLoader: setLoader,
                                setPortfolio: setPortfolio
                            })
                        })
                        .then(data => data.json())
                        .then(response => {
                            if(response.status === "error"){
                                setError(response.message)
                                setLoad(false)
                            }
                            if(response.status === "ok"){
                                comm_stage = JSON.parse(response.commission_stage)
                                fetch(`/api/auth/complete-user?user=${user.name}&email=${user.email}`)
                                .then(res => res.json())
                                .then(data => {
                                    if(data.status === 'ok'){
                                        setCommStage(comm_stage)
                                        setUser(data.user_info)
                                        setLoad(false)
                                    }else if(data.status === "error"){
                                        setError(data.message)
                                    }
                                })
                            }
                        })
                    })
            })
    }

    const onSubmitSecond = async() => {
        setError()
        setLoad(true)
        let picURL
        let comm_stage
        if(picSecond === null){
            setError("No image was found")
            return
        }
        const imageRef = ref(storage, `WM_Readings/${org}/${params.id}/${org}_${params.id}_SecondReadings_${user.name}_${dateSecond}.jpg`)
        uploadBytes(imageRef, picSecond, {contentType: 'image/jpg'})
            .then((snapshot)=> {
                getDownloadURL(snapshot.ref)
                    .then((url) =>{
                        picURL = url.toString()
                    })
                    .then(()=>{
                        fetch('/api/comm-tool/step-3-second-readings', {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                meterType: meterType,
                                lowSideSecond: lowSideSecond,
                                dateSecond: dateSecond,
                                lowSideSecondUnit: lowSideSecondUnit,
                                picSecond: picSecond,
                                highSideSecond: highSideSecond,
                                highSideSecondUnit: highSideSecondUnit,
                                org: org,
                                params: params,
                                user: user,
                                commStage: commStage,
                                picURL: picURL,
                                setUser: setUser,
                                userSession: userSession,
                                setLoader: setLoader,
                                setPortfolio: setPortfolio
                            })
                        })
                        .then(data => data.json())
                        .then(response => {
                            if(response.status === "error"){
                                setError(response.message)
                                setLoad(false)
                            }else if(response.status === "ok"){
                                comm_stage = response.commission_stage
                                fetch(`/api/auth/complete-user?user=${user.name}&email=${user.email}`)
                                .then(res => res.json())
                                .then(data => {
                                    if(data.status === 'ok'){
                                        setUser(data.user_info)
                                        setCommStage(comm_stage)
                                        setLoad(false)
                                        setSuccess(true)
                                    }else if(data.status === "error"){
                                        setError(data.message)
                                    }
                                })
                            }
                        })
                    })
            })
    }

    const resetReadings = async() => {
        setLoad(true)
        setError()
        setCommStage()
        fetch(`/api/comm-tool/step-3-reset-readings?id=${params.id}`)
        .then(res => res.json())
        .then(data => {
            if(data.status === 'ok'){
                setLoad(false)
                setSuccess('Readings resetted, reloading page...')
                setTimeout(()=> {
                    location.reload()
                }, 2000)
            }else if(data.status === "error"){
                setLoad(false)
                setError(data.message)
            }

        })
    }

  return (
    <div className='container-pages h-fit'>
        {
            load &&
            <Loader />
        }
        {
            success &&
            <Success setter={setSuccess}/>
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
                    <h1 className="text-[1rem] lg:text-[1rem] mb-[0.5rem] font-bold text-start md:text-center text-dark-grey">Download the On-site Installation Guide</h1>
                    <Link 
                        className='flex flex-col items-center cursor-pointer hover:scale-125 duration-500'
                        href={'https://firebasestorage.googleapis.com/v0/b/wm-readings-storage.appspot.com/o/Installation%20Guide_Water%20Monkey.pdf?alt=media&token=cb7d9760-0a69-4a62-b875-0d129d332faf'}
                        download={'https://firebasestorage.googleapis.com/v0/b/wm-readings-storage.appspot.com/o/Installation%20Guide_Water%20Monkey.pdf?alt=media&token=cb7d9760-0a69-4a62-b875-0d129d332faf'}
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
                <div className='flex flex-row items-center justify-between w-full'>
                    <p className={`${(commStage && (commStage.first.date_time !== undefined)) ? `text-grey` : `text-dark-grey`} font-bold text-[1.2rem] md:text-[1.5rem] mb-[1rem]`}>Enter initial meter readings</p>
                    {
                        commStage && commStage.stage === "first reading" &&
                        <Image
                            src={EditButton}
                            alt="Edit readings"
                            className='fill-blue-hard scale-[80%] cursor-pointer'
                            onClick={()=> setCommStage({"stage": "none", "first": {}, "second": {}})}
                        />
                    }
                </div>
                {/* <div className='flex flex-row justify-between items-center'> */}
                <InputFullPercentWithTitle 
                    name={"Date and Time"}
                    type={"datetime-local"}
                    placeholder={(commStage && commStage.first.date_time) ? commStage.first.date_time : ""}
                    setter={setDateFirst}
                    disabled={commStage && commStage.first.date_time ? true : false}
                />
                {/* <Select50PercentWithTitle 
                    name={"Timezone"}
                    placeholder={"Choose Timezone"}
                    setter={setTimeZoneFirst}
                    elements={timeZones}
                    disabled={commStage && commStage.first.date_time ? true : false}
                /> */}
                {/* </div> */}
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
                <div className='flex flex-row items-center justify-between w-full'>
                    <p className={`${commStage && !commStage.second.date_time && commStage.first.date_time ? `text-dark-grey` : `text-grey`} font-bold text-[1.2rem] md:text-[1.5rem] mb-[1rem]`}>Enter final meter readings</p>
                    {
                        commStage && commStage.stage === "second reading" &&
                        <Image
                            src={EditButton}
                            alt="Edit readings"
                            className='fill-blue-hard scale-[80%] cursor-pointer hover:fill-grey'
                            onClick={()=> setCommStage({"stage": "first reading", "first": commStage.first, "second": {}})}
                        />
                    }
                </div>
                {/* <div className='flex flex-row justify-between items-center'> */}
                    <InputFullPercentWithTitle 
                        name={"Date and Time"}
                        type={"datetime-local"}
                        placeholder={commStage && commStage.second.date_time ? commStage.second.date_time : ""}
                        setter={setDateSecond}
                        disabled={commStage && !commStage.second.date_time && commStage.first.date_time ? false : true}
                    />
                    {/* <Select50PercentWithTitle 
                        name={"Timezone"}
                        placeholder={"Choose Timezone"}
                        setter={setTimeZoneSecond}
                        elements={timeZones}
                        disabled={commStage && commStage.second.date_time ? true : false}
                    /> */}
                {/* </div> */}
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
                        <Input50PercentWithTitle 
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
            <p className='error-message mb-[1rem]'>{error}</p>
        }
        {
            success &&
            <p className="success-message">{success}</p>
        }
        {
            commStage && commStage.stage === 'failed' &&
            <ButtonSmall
                text={"Reset readings"}
                type={"purple"}
                action={()=> resetReadings()}
                className="mt-[1rem]"
            />
        }
    </div>
  )
}

export default Step3