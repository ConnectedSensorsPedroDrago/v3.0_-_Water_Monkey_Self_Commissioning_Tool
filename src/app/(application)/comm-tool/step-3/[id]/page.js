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
import Carousell from '@/src/components/Carousell/Carousell'
import { toTimestamp } from '@/src/functions/toTimestamp'
import Message from '@/src/components/Message/page'
import ModalSingleButton from '@/src/components/ModalSingleButton/page'

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
    const [picSecond, setPicSecond] = useState()
    const [meterType, setMeterType] = useState()
    const [load, setLoad] = useState(true)
    const [error, setError] = useState()
    const [commStage, setCommStage] = useState()
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState()
    const [propertyType, setPropertyType] = useState()
    const [deviceId, setDeviceId] = useState()
    const [recalibrate, setRecalibrate] = useState()
    const [rsrp, setRsrp] = useState()
    const [calibration, setCalibration] = useState()
    
    useEffect(()=>{
        fetch(`/api/devices/water-monkey/get-device?id=~${params.id}`)
            .then(res => res.json())
            .then(data => {
                setLoad(false)
                if(data.status === "ok"){
                    let commissionStage = JSON.parse(data.device.properties.commission_stage)
                    setPropertyType(data.device.properties.property_type)
                    setMeterType(data.device.properties.meter_type)
                    setOrg(data.device.organization.name)
                    setDeviceId(data.device.id)
                    setCommStage(commissionStage)
                    commissionStage.first.date_time && setDateFirst(commissionStage.first.date_time)
                    commissionStage.second.date_time && setDateSecond(commissionStage.second.date_time)
                    commissionStage.stage === 'failed' && setError(`Commissioning failed: ${commissionStage.message}. Please reset readings and try again`)
                }
                if(data.status === "error"){
                    setError(data.message)
                }
            })
            .then(()=> {
                fetch(`/api/dashboard/water-monkey/get-last-values/?device=~${params.id}`)
                    .then(res => res.json())
                    .then(data => {
                        if(data.status === 'ok'){                           
                            data.data.rsrp && data.data.rsrp.value && setRsrp(data.data.rsrp.value)
                            data.data.rc && data.data.rc.value && setRecalibrate(data.data.rc.value === 0 ? 'no' : data.data.rc.value)
                            data.data.rc && (data.data.rc.value === 1) && setMessage("Your Water Monkey is now configured and assigned to your organization and is ready to install. In this step, you will be required to first install and activate your device to then take your first reading. You will find our Video and PDF Install Guides bellow to guide you through the installation process. Once you have properly installed and activated it, and we have detected your device came online, in this same page you will find the input forms for your first reading.")
                            if(data.data.cal_h.value && data.data.cal_l.value){
                                Math.abs(data.data.cal_h.value - data.data.cal_l.value) <= 8 && setCalibration('The Calibration of your device seems to be faulty and will require relocation and/or recalibration. Please contact support for more assistance.')
                            }else{
                                setCalibration('There is no data to ensure the proper calibration of your Water Monkey device and it will require Recalibration. Please contact support for more information.')
                            }
                        }else{
                            setError('There was an error requesting the activation status of your Water Monkey. Please refresh the page to try again or contact support.')
                        }
                    })
            })
            .catch((e) => {
                setError('There has been an error requesting your Water Monkey: ' + e + '. Please refresh the page and try again.')
            })
    }, [params])

    const onSubmitFirst = async() => {
        setError()
        let picURL
        let comm_stage
        if(picFirst === undefined){
            setError("No Meter Photo was found for your first readings. Please submit one before sending it.")
        }else if(!dateFirst || !lowSideFirst || !lowSideFirstUnit || (meterType == 'Compound' && (!highSideFirst || highSideFirst.length < 1)) || (meterType == 'Compound' && (!highSideFirstUnit || highSideFirstUnit.length < 1))){
            (!dateFirst || dateFirst.length < 1) ? setError("Please add the Date and Time of your first readings before sending it.") :
            (!lowSideFirst || lowSideFirst.length < 1) ? setError("Please add the value for the Low Side of your water meter.") :
            (!lowSideFirstUnit || lowSideFirstUnit.length < 1) ? setError("Please add the value for the Low Side Unit of your water meter.") :
            (meterType == 'Compound' && (!highSideFirst || highSideFirst.length < 1)) ? setError("Please add the value for the High Side Unit of your water meter.") :
            (meterType == 'Compound' && (!highSideFirstUnit || highSideFirstUnit.length < 1)) && setError("Please add the value for the High Side Unit of your water meter.")
        }else{
            setLoad(true)
            const imageRef = ref(storage, `WM_Readings/${org}/${params.id}/${org}_${params.id}_FirstReadings_${user.name}_${dateFirst.timestamp}.jpg`)
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
                                    lowSideFirstUnit: lowSideFirstUnit,
                                    picFirst: picFirst,
                                    highSideFirst: highSideFirst,
                                    highSideFirstUnit: highSideFirstUnit,
                                    params: params,
                                    commStage: commStage,
                                    picURL: picURL,
                                    deviceId: deviceId
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
                                            let in24hs = Number(dateFirst.timestamp) + 86400000
                                            setSuccess([["Congratulations your first reading has been successfully submitted!"], ["Ensuring that your reading is as close as possible to your Water Monkey's cloud update time will yield the most accurate volume representation."], [`To confirm HERE are the 4 cloud update times (starting in 24hs time):`, [
                                                dateFirst && (new Date(in24hs + 21600000).toLocaleDateString('en-US') + ' ' + new Date(in24hs + 21600000).toLocaleTimeString('en-US')), 
                                                dateFirst && (new Date(in24hs + 43200000).toLocaleDateString('en-US') + ' ' + new Date(in24hs + 43200000).toLocaleTimeString('en-US')), 
                                                dateFirst && (new Date(in24hs + 64800000).toLocaleDateString('en-US') + ' ' + new Date(in24hs + 64800000).toLocaleTimeString('en-US')), 
                                                dateFirst && (new Date(in24hs + 86400000).toLocaleDateString('en-US') + ' ' + new Date(in24hs + 86400000).toLocaleTimeString('en-US'))]], [`Please try to take your secondary reading as close to one of these previously stated dates and times${propertyType !== "Residential - Single Family Home" ? ` and having let at least 10m3 of water (or its equivalent) flow through your water meter` : ""}.`], ["We will be waiting for your final meter readings! Thanks!"]])
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
    }

    const onSubmitSecond = async() => {
        setError()
        let picURL
        let comm_stage
        if(picSecond === undefined){
            setError("No Meter Photo was found for your second readings. Please submit one before sending it.")
        }else if(!dateSecond || !lowSideSecond || !lowSideSecondUnit || (meterType == 'Compound' && (!highSideSecond || highSideSecond.length < 1)) || (meterType == 'Compound' && (!highSideSecondUnit || highSideSecondUnit.length < 1))){
            (!dateSecond || dateSecond.length < 1) ? setError("Please add the Date and Time of your second readings before sending it.") :
            (!lowSideSecond || lowSideSecond.length < 1) ? setError("Please add the value for the Low Side of your water meter.") :
            (!lowSideSecondUnit || lowSideSecondUnit.length < 1) ? setError("Please add the value for the Low Side Unit of your water meter.") :
            (meterType == 'Compound' && (!highSideSecond || highSideSecond.length < 1)) ? setError("Please add the value for the High Side Unit of your water meter.") :
            (meterType == 'Compound' && (!highSideSecondUnit || highSideSecondUnit.length < 1)) && setError("Please add the value for the High Side Unit of your water meter.")
        }else{
            setLoad(true)
            const imageRef = ref(storage, `WM_Readings/${org}/${params.id}/${org}_${params.id}_SecondReadings_${user.name}_${dateSecond.timestamp}.jpg`)
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
                                    setPortfolio: setPortfolio,
                                    propertyType: propertyType
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
                                            let today = toTimestamp(new Date(dateSecond.timestamp).toLocaleDateString('en-US') + ' ' + new Date(commStage.first.date_time.timestamp).getHours() + ':' + new Date(commStage.first.date_time.timestamp).getMinutes())
                                            setUser(data.user_info)
                                            setCommStage(comm_stage)
                                            setLoad(false)
                                            setSuccess(
                                                ((commStage && commStage.first.date_time && ((((dateSecond.timestamp - commStage.first.date_time.timestamp)/21600000)%1) > 0.1 ) && (commStage && commStage.first.date_time && dateSecond && ((((dateSecond.timestamp - commStage.first.date_time.timestamp)/21600000)%1) < 0.9)))) ? 
                                                [["Congratulations your second reading has been successfully submitted!"], ["Ensuring that your second reading is as close as possible to your Water Monkey's cloud update time will yield the most accurate volume representation."], [`To confirm HERE are the 4 cloud update times:`, [
                                                commStage.first && (new Date(today + 21600000).toLocaleDateString('en-US') + ' ' + new Date(today + 21600000).toLocaleTimeString('en-US')), 
                                                commStage.first && (new Date(today + 43200000).toLocaleDateString('en-US') + ' ' + new Date(today + 43200000).toLocaleTimeString('en-US')) , 
                                                commStage.first && (new Date(today+ 64800000).toLocaleDateString('en-US') + ' ' + new Date(today + 64800000).toLocaleTimeString('en-US')), 
                                                commStage.first && (new Date(today + 86400000).toLocaleDateString('en-US') + ' ' + new Date(today + 86400000).toLocaleTimeString('en-US'))]], ["In the event that you wish to update your Secondary reading you may do so from the home page by editing the last submitted secondary reading."], ["Now that you've submitted your secondary reading a Connected Sensors representative will reach out once your dashboard and data has been validated."]]
                                                : 
                                                [["Congratulations your reading have been successfully submitted! You will be contacted by one of our representatives once the calibration process is finished"]]
                                            )
                                        }else if(data.status === "error"){
                                            setError(data.message)
                                        }
                                    })
                                }
                            })
                        })
                })
        }
    }

    const resetReadings = async() => {
        setLoad(true)
        setError()
        fetch(`/api/comm-tool/step-3-reset-readings?id=${params.id}`)
        .then(res => res.json())
        .then(data => {
            if(data.status === 'ok'){
                fetch(`/api/devices/water-monkey/delete-historical-data`, {
                        method: 'POST',
                        headers: {
                            'Content-Type':'application/json',
                        },
                        body: JSON.stringify({
                            "label": params.id,
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if(data.status === "ok"){
                            setCommStage()
                            setLoad(false)
                            setMessage('Readings resetted, reloading page...')
                            setTimeout(()=> {
                                location.reload()
                            }, 2000)
                        }else{
                            setLoad(false)
                            setError(data.message)
                        }
                    })
                    .catch(e => {
                        setLoader(false)
                        setError("There was an error deleting the historical data of your Water Monkey to prepare it for commissioning: " + e + ". Please try again or contact support.")}
                    )
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
            <Carousell message={success} propertyType={propertyType}/>
        }
        {
            error &&
            <Message message={error} setMessage={()=> setError()} time={100000} type={'error'}/>
        }
        {
            message &&
            <Message message={message} setMessage={()=> setMessage()} time={100000} type={'error'}/>
        }
        {
            calibration &&
            <ModalSingleButton 
                message={calibration} 
                action={()=> setCalibration()}
            />
        }
        {
            rsrp && rsrp < 25 &&
            <ModalSingleButton 
                message={"We have detected that the signal stregth of your Water Monkey is below the expected level for it to operate and transmit information properly. Please consider installing the External Antenna to improve its connectivity (contact support for more details)."}
                action={()=> setRsrp(26)}
            />
        }
        {   commStage &&
            <>
                <CommToolTop 
                    title={"Step 3"}
                    back={`/comm-tool/step-2/${params.id}`}
                />
                {
                    recalibrate !== "no" ?
                        <div className={`flex flex-col w-full items-center justify-around mb-[4rem] `}>
                            <h1 className="text-[1.5rem] lg:text-[3.25rem] font-bold text-center text-blue-hard mb-[1.5rem] md:mb-[1.5rem]">{commStage && commStage.first.date_time ? 'With your Water Monkey already installed, now its time to take the readings' : 'After successful install...'}</h1>
                            {
                                commStage && commStage.stage === 'failed' &&
                                <div className=' mb-[2rem] w-full flex items-center justify-center'>
                                    <ButtonSmall
                                        text={"Reset readings"}
                                        type={"purple"}
                                        action={()=> resetReadings()}
                                    />
                                </div>
                            }
                            <div className='w-full md:w-[90%] flex md:flex-row flex-col items-start justify-center'>
                                <div className='w-full flex flex-col'>
                                    <div className='flex flex-row items-start justify-between w-full'>
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
                                    {   commStage && !commStage.first.date_time ?
                                        <>
                                            <InputFullPercentWithTitle 
                                                name={"Date and Time"}
                                                type={"datetime-local"}
                                                placeholder={(commStage && commStage.first.date_time) ? commStage.first.date_time : ""}
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
                                        
                                            <button 
                                                className=" md:mt-0 w-full button-small text-[1rem] h-[2.5rem]"
                                                onClick={()=> onSubmitFirst()}
                                            >
                                                Submit
                                            </button>
                                        </>
                                        :
                                        <div className='w-full border-grey border-[0.05rem] bg-light-yellow rounded p-3 min-h-[12rem]'>
                                            <div className='w-full flex items-center justify-start'>
                                                <Image 
                                                    src={successTick}
                                                    alt="Success Tick"
                                                    className='scale-[75%]'
                                                />
                                                <div className='w-full flex flex-col md:flex-row justify-start items-center'>
                                                    <p className='ml-[0.5rem] font-semibold text-[1rem] text-dark-grey'>Readings successfully submitted at:</p>
                                                    <p className='w-fullxs ml-[0.5rem] font-normal text-[1rem] text-start text-dark-grey'>{dateFirst && new Date(dateFirst.utc_time).toLocaleString('en-US', {timeZone: dateFirst.timezone}) + ` (${dateFirst.timezone.replaceAll('_', ' ')} time)`}</p>
                                                </div>
                                            </div>
                                            <div className='w-full flex flex-col justify-between mt-[1rem] mb-[0.5rem]'>
                                                <p className='w-fullxs ml-[1.5rem] font-normal text-[0.9rem] text-dark-grey'><b>Low Side Meter Reading:</b> {commStage && commStage.first.date_time && Number(commStage.first.low).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} {commStage && commStage.first.date_time && commStage.first.low_unit}</p>
                                            </div>
                                            {
                                                commStage && commStage.first.high &&
                                                <div className='w-full flex flex-col justify-between mb-[0.5rem]'>
                                                    <p className='w-fullxs ml-[1.5rem] font-normal text-[0.9rem] text-dark-grey'><b>High Side Meter Reading:</b> {commStage && commStage.first.date_time && Number(commStage.first.high).toLocaleString('en-US',  {minimumFractionDigits: 2, maximumFractionDigits: 2})} {commStage && commStage.first.date_time && commStage.first.high_unit}</p>
                                                </div>
                                            }
                                                <div className='w-full flex flex-col justify-between'>
                                                    <p className='w-fullxs ml-[1.5rem] font-normal text-[0.9rem] text-dark-grey'><b>Picture:</b> <a target="_blank" href={commStage && commStage.first.date_time && commStage.first.pic}>Click here</a></p>
                                                </div>
                                            <p className='text-dark-grey font-light text-[1rem] mt-[1rem]'>Please remember to take your second readings as close to 6 hour gaps after these first readings and after having used at least 10m3 (or it's equivalent) of water.</p>
                                        </div>
                                    }
                                </div>
                                <div className='w-full flex flex-col md:ml-[1rem] md:mt-0 mt-[2rem]'>
                                    <div className='flex flex-row items-start justify-between w-full'>
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
                                    {   commStage && !commStage.second.date_time ?
                                        <>
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
                                            {
                                                commStage && !commStage.second.date_time && commStage.first.date_time &&
                                                <button 
                                                    className="md:mt-0 w-full button-small text-[1rem] h-[2.5rem]"
                                                    onClick={()=> onSubmitSecond()}
                                                >
                                                    Submit
                                                </button>
                                            }
                                        </>
                                        :
                                        commStage && commStage.second.date_time &&
                                        <div className='w-full border-grey border-[0.05rem] bg-light-yellow rounded p-3 min-h-[13.75rem]'>
                                            <div className='w-full flex items-center justify-start'>
                                                <Image 
                                                    src={successTick}
                                                    alt="Success Tick"
                                                    className='scale-[75%]'
                                                />
                                                <div className='w-full flex flex-col md:flex-row justify-start items-center'>
                                                    <p className='ml-[0.5rem] font-semibold text-[1rem] text-dark-grey'>Readings successfully submitted at:</p>
                                                    <p className='w-fullxs ml-[0.5rem] font-normal text-[1rem] text-start text-dark-grey'>{dateSecond && new Date(dateSecond.utc_time).toLocaleString('en-US', {timeZone: dateSecond.timezone}) + ` (${dateSecond.timezone.replaceAll('_', ' ')} time)`}</p>
                                                </div>
                                            </div>
                                            <div className='w-full flex flex-col justify-between ml-[0rem] mt-[1rem]'>
                                                <p className='w-fullxs ml-[1.5rem] font-normal text-[0.9rem] text-dark-grey mb-[0.5rem]'><b>Low Side Meter Reading:</b> {commStage && commStage.second.date_time && Number(commStage.second.low).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} {commStage && commStage.second.date_time && commStage.second.low_unit}</p>
                                            </div>
                                            {
                                                commStage && commStage.second.high &&
                                                <div className='w-full flex flex-col justify-between ml-[0rem]'>
                                                    <p className='w-fullxs ml-[1.5rem] font-normal text-[0.9rem] text-dark-grey mb-[0.5rem]'><b>High Side Meter Reading:</b> {commStage && commStage.second.date_time && Number(commStage.second.high).toLocaleString('en-US',  {minimumFractionDigits: 2, maximumFractionDigits: 2})} {commStage && commStage.second.date_time && commStage.second.high_unit}</p>
                                                </div>
                                            }
                                                <div className='w-full flex flex-col justify-between ml-[0rem]'>
                                                    <p className='w-fullxs ml-[1.5rem] font-normal text-[0.9rem] text-dark-grey'><b>Picture:</b> <a target="_blank" href={commStage && commStage.second.date_time && commStage.second.pic}>Click here</a></p>
                                                </div>
                                            <p className='text-dark-grey font-light text-[1rem] mt-[1rem]'>Your readings are complete! You will be contacted by one of our representatives once the calibration process is finished.</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        :
                        <div className={`flex flex-col w-full items-center justify-around mb-[4rem] `}>
                            <p class="error-message">No value detected for "RC", please contact support.</p>
                        </div>
                }
                <div className={`flex flex-col w-full items-center justify-around mb-[2rem] `}>
                    <h1 className="text-[1.5rem] lg:text-[3.25rem] font-bold text-center text-blue-hard">{commStage && commStage.first.date_time ? 'Review the Water Monkey Installation Guides' : 'First, install your Water Monkey following the Installation Guides'}</h1>
                    <div className='flex flex-col md:flex-row justify-center items-center w-full mt-[1.5rem] md:mt-[1.5rem]'>
                        <div className='flex flex-col items-center w-full justify-center'>
                            <h1 className="text-[1rem] lg:text-[1rem] font-bold text-center text-dark-grey mb-[0.5rem]">Watch the YouTube Installation Guide</h1>
                            <YouTubeVideo 
                                videoId="aHAi1LEUCRc" 
                            />                   
                        </div>
                        <div className='flex flex-col items-center w-full justify-center mt-[1rem] md:mt-[-3rem]'>
                            <h1 className="text-[1rem] lg:text-[1rem] mb-[0.5rem] font-bold text-start md:text-center text-dark-grey">Download the On-site Installation Guide</h1>
                            <Link 
                                className='flex flex-col items-center cursor-pointer hover:scale-110 duration-500'
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
                </div>

                
            </>
        }
    </div>
  )
}

export default Step3