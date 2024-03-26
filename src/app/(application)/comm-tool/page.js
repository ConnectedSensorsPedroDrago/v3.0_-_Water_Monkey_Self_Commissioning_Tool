"use client"

import CommToolTop from "@/src/components/CommToolTop/page"
import Image from "next/image"
import Devices from '@/public/stepOneDevices.svg'
import WarningSign from "@/src/components/WarningSign/page"
import { userContext } from "@/src/context/userContext"
import { useContext, useState } from "react"
import { useRouter } from "next/navigation"
import Loader from "@/src/components/loader/page"
import ModalSingleButton from "@/src/components/ModalSingleButton/page"
import Message from "@/src/components/Message/page"

const CommToolHome = () => {

    const { user } = useContext(userContext)
    const [code, setCode] = useState()
    const [org, setOrg] = useState()
    const [loader, setLoader] = useState(false)
    const [error, setError] = useState()
    const [modal, setModal] = useState(false)
    const [label, setLabel] = useState()
    
    const router = useRouter()

    const onSubmit = () => {
        setLoader(true)
        setError()
        if(code == undefined || code.length === 0){
            setError("Please add the code to assign the Water Monkey to the organization.")
            setLoader(false)
        }else if(org == undefined){
            setError("Please choose an organization to assign the Water Monkey to.")
            setLoader(false)
        }else if((code == undefined || code.length === 0) && org == undefined){
            setError("Please add the code and choose an organization to assign the Water Monkey to.")
            setLoader(false)
        }else{
            let param
            fetch(`/api/devices/water-monkey/get-device-with-description?code=${code}`)
                .then(resp => resp.json())
                .then(data => {
                    console.log(data.device.properties)
                    if(data.status === "error"){
                        setLoader(false)
                        setError(data.message)
                    }else if(data.status === 'ok'){
                        param = data.device.label
                        setLabel(data.device.label)
                        if(data.device.properties.commission_stage.stage){
                            setLoader(false)
                            setModal(true)
                        }else{
                            fetch(`/api/comm-tool/step-1-assign-wm-to-org?label=${param}&org=${org}`)
                                .then(resp => resp.json())
                                .then(data => {
                                    if(data.status === "error"){
                                        setLoader(false)
                                        setError(data.message)
                                    }else if(data.status === "ok"){
                                        fetch(`/api/devices/water-monkey/delete-historical-data`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type':'application/json',
                                            },
                                            body: JSON.stringify({
                                                "label": param,
                                            })
                                        })
                                            .then(res => res.json())
                                            .then(data => {
                                                if(data.status === "ok"){
                                                    setLoader(false)
                                                        router.push(`/comm-tool/step-2/${param}`)
                                                }else{
                                                    setError(data.message)
                                                }
                                            })
                                            .catch(e => {
                                                setLoader(false)
                                                setError("There was an error deleting the historical data of your Water Monkey to prepare it for commissioning: " + e + ". Please try again or contact support.")}
                                            )
                                    }
                                })
                        }
                    }
                })
        }
    }

    async function onSubmitRecommission(){
        setModal(false)
        setLoader(true)
        setError()
        let param
        fetch(`/api/devices/water-monkey/get-device-with-description?code=${code}`)
            .then(resp => resp.json())
            .then(data => {
                if(data.status === "error"){
                    setLoader(false)
                    setError(data.message)
                }else if(data.status === 'ok'){
                    param = data.device.label
                    fetch(`/api/comm-tool/step-1-assign-wm-to-org?label=${param}&org=${org}`)
                        .then(resp => resp.json())
                        .then(data => {
                            if(data.status === "error"){
                                setLoader(false)
                                setError(data.message)
                            }else if(data.status === "ok"){
                                fetch(`/api/devices/water-monkey/delete-historical-data`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type':'application/json',
                                    },
                                    body: JSON.stringify({
                                        "label": param,
                                    })
                                })
                                    .then(res => res.json())
                                    .then(data => {
                                        if(data.status === "ok"){
                                            setLoader(false)
                                            router.push(`/comm-tool/step-2/${param}`)
                                        }else{
                                            setError(data.message)
                                        }
                                    })
                                    .catch(e => {
                                        setLoader(false)
                                        setError("There was an error deleting the historical data of your Water Monkey to prepare it for commissioning: " + e + ". Please try again or contact support.")}
                                    )
                            }
                        })
                }
            })
    }

  return (
    <div className='container-pages h-fit'>
        {
            modal && <ModalSingleButton message={"It appears that the device you're configuring is undergoing recommissioning. The preparation for recommissioning involves erasing the historical data on your device. This process has already commenced and will require some time to finish, depending on how extensively the device was utilized in its previous operation. You may proceed to the next stage to input the necessary information, but it is advisable to wait a day before submitting your initial readings for convenience."} action={()=> onSubmitRecommission()}/>
        }
        {
            loader && <Loader />
        }
        {
            error &&
            <Message
                message={error}
                time={100000}
                setMessage={setError}
                type={"error"}

            />
        }
        <CommToolTop 
            title={"Step 1"} 
            back={'/home'} 
        />
        <h1 className="text-[1.5rem] lg:text-[3.25rem] font-bold text-center text-blue-hard">Scan the QR Code in your <strong className="text-purple">Water Monkey</strong> and input it in the box below</h1>
        <div className="flex justify-between w-full pt-[1rem] md:pt-[3rem]">
            <div className="hidden md:w-[45vw] md:flex flex-col justify-end">
                <Image 
                    src={Devices}
                    className="absolute bottom-0 w-[45vw]"
                    alt="devices"
                />
            </div>
            <div className="w-full md:w-[45vw] flex flex-col items-center justify-between">
                <WarningSign 
                    head={"WARNING!"} 
                    text={"Keep the provided magnet away from the Water Monkey until time of activation"}
                />
                <div className="mt-[1rem] md:mt-[2rem] w-full">
                    <p className="font-bold text-dark-grey w-full text-center">Enter the code here</p>
                    <input 
                        type="text" 
                        className="rounded border-[0.025rem] border-grey w-full h-[3rem] md:h-[8rem] text-[2rem] md:text-[5rem] text-grey text-center font-light"
                        onChange={e => setCode(e.target.value)}
                        placeholder="CODE" 
                    />
                </div>
                <div className="mt-[1rem] md:mt-[2rem] w-full mb-[2rem]">
                    <p className="font-bold text-dark-grey w-full text-center">Assign to an organization</p>
                    <select 
                        onChange={(e) => setOrg(e.target.value)}
                        className="rounded border-[0.025rem] border-grey w-full h-[2rem] text-grey text-center font-light cursor-pointer"
                    >
                        <option>Choose an organization</option>
                        {
                            user.organizations.map(org =>
                                <option 
                                    key={org.id} 
                                    value={org.id}
                                >
                                    {org.name}
                                </option>
                            )
                        }
                    </select>
                </div>
                <button 
                    className="w-full button-small text-[1rem] h-[2rem]"
                    onClick={()=> onSubmit()}
                >
                    Submit and move to Step 2
                </button>
            </div>
        </div>
    </div>
  )
}

export default CommToolHome