"use client"

import CommToolTop from '@/src/components/CommToolTop/page'
import { useState, useEffect, useContext } from 'react'
import Loader from '@/src/components/loader/page'
import { userContext } from '@/src/context/userContext'
import { storage } from '@/src/firebase/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Carousell from '@/src/components/Carousell/Carousell'
import { toTimestamp } from '@/src/functions/toTimestamp'
import Message from '@/src/components/Message/page'
import ModalSingleButton from '@/src/components/ModalSingleButton/page'
import HealthCheck from '@/src/components/HealthCheck/page'
import InstallationGuides from '@/src/components/InstallationGuides/page'
import ReadingsInputs from '@/src/components/ReadingsInputs/page'
import ErrorSignBig from '@/src/components/ErrorSignBig/page'

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
    const [lowSignal, setLowSignal] = useState(false)
    const [address, setAddress] = useState()
    
    useEffect(()=>{
        let commissionStage
        fetch(`/api/devices/water-monkey/get-device?id=~${params.id}`)
            .then(res => res.json())
            .then(data => {
                setLoad(false)
                if(data.status === "ok"){
                    commissionStage = JSON.parse(data.device.properties.commission_stage)
                    setAddress(`${data.device.properties.address} (${data.device.organization.name})`)
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
                            data.data.rsrp && data.data.rsrp.value ? setRsrp(data.data.rsrp.value) : setRsrp('none')
                            data.data.rsrp && data.data.rsrp.value && data.data.rsrp.value < 25 && setLowSignal(true)
                            data.data.rc && data.data.rc.value && setRecalibrate(data.data.rc.value === 0 ? 'no' : data.data.rc.value)
                            data.data.rc && (data.data.rc.value === 1) && commissionStage && commissionStage.stage === 'none' && setMessage("Your Water Monkey is now configured and assigned to your organization and is ready to install. In this step, you will be required to first install and activate your device to then take your first reading. You will find our Video and PDF Install Guides bellow to guide you through the installation process. Once you have properly installed and activated it, and we have detected your device came online, in this same page you will find the input forms for your first reading.")
                            if((data.data.cal_h.value && data.data.cal_l.value) || (commissionStage && !commissionStage.second.date_time)){    
                               if((Math.abs(data.data.cal_h.value - data.data.cal_l.value) <= 8) && commissionStage.first.date_time){
                                    setCalibration("Faulty")
                                    setMessage('The Calibration of your device seems to be faulty and will require relocation and/or recalibration. Please contact support for more assistance.')
                               }else{
                                    setCalibration("Ok")
                               }
                            }else{
                                setCalibration("No data")
                                setMessage('There is still no data to ensure the proper calibration of your Water Monkey device. Make sure your Water Monkey is active and with water flow. If you just activated it, please wait until we have received a cloud update to submit your second readings. If 12 hours have passed since you activated it and there is still no calibration data, it may require recalibration, in that case please contact support for more information')
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
                                    comm_stage = response.commission_stage
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
            lowSignal &&
            <ModalSingleButton 
                message={"We have detected that the signal stregth of your Water Monkey is below the expected level for it to operate and transmit information properly. Please consider installing the External Antenna to improve its connectivity (contact support for more details)."}
                action={()=> setLowSignal(false)}
            />
        }
        {   commStage &&
            <>
                <CommToolTop 
                    title={"Step 3"}
                    back={`/device_details/${params.id}`}
                    address={address}
                    stage={commStage.stage}
                />
                { calibration && rsrp &&
                    <HealthCheck 
                        rsrp={rsrp && rsrp}
                        calibration={calibration && calibration}
                    />
                }
                <div className='flex flex-col justify-around items-center w-[100%] min-h-[75vh] grow'>
                    {
                        (recalibrate !== "no" && calibration === "Ok") && (!commStage.first.date_time || (commStage.first.date_time && (rsrp !== 'none' || rsrp > 24))) ?
                            <ReadingsInputs 
                                commStage={commStage && commStage}
                                setCommStage={setCommStage}
                                setDateFirst={setDateFirst}
                                setLowSideFirst={setLowSideFirst}
                                setLowSideFirstUnit={setLowSideFirstUnit}
                                setHighSideFirst={setHighSideFirst}
                                setHighSideFirstUnit={setHighSideFirstUnit}
                                setPicFirst={setPicFirst}
                                onSubmitFirst={onSubmitFirst}
                                dateFirst={dateFirst && dateFirst}
                                setDateSecond={setDateSecond}
                                setLowSideSecond={setLowSideSecond}
                                setLowSideSecondUnit={setLowSideSecondUnit}
                                setHighSideSecond={setHighSideSecond}
                                setHighSideSecondUnit={setHighSideSecondUnit}
                                setPicSecond={setPicSecond}
                                onSubmitSecond={onSubmitSecond}
                                meterType={meterType && meterType}
                                resetReadings={resetReadings}
                                dateSecond={dateSecond}
                            />
                            :
                            <div className={`flex flex-col w-full items-center justify-around ${commStage.first.date_time ? 'order-1' : 'order-2'}`}>
                                {
                                    recalibrate === "no" &&
                                    <ErrorSignBig 
                                        message={`No value detected for "RC", please make sure your device is activated before taking your first readings. If your device is online and the problem persists please contact support.`}
                                    />
                                }
                                {
                                    commStage.first.date_time && (rsrp === 'none') &&
                                    <ErrorSignBig 
                                        message={`Your device appears to be offline, please check the connectivity of your Water Monkey before submitting your second redings.`}
                                    />
                                }
                            </div>
                    }
                    <InstallationGuides commStage={commStage && commStage}/>
                </div>

                
            </>
        }
    </div>
  )
}

export default Step3