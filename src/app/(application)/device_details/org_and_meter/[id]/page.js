"use client"

import { userContext } from "@/src/context/userContext"
import { useContext, useState } from "react"
import { useRouter } from "next/navigation"
import Loader from "@/src/components/loader/page"
import ModalSingleButton from "@/src/components/ModalSingleButton/page"
import Message from "@/src/components/Message/page"

const OrgAndMeter = ({params}) => {
    
  const { user } = useContext(userContext)
  const [org, setOrg] = useState()
  const [loader, setLoader] = useState(false)
  const [error, setError] = useState()
  const [modalRecommission, setModalRecommission] = useState(false)
  const [meterType, setMeterType] = useState()

  const router = useRouter()

  const onSubmit = () => {
      setLoader(true)
      setError()
      if(org == undefined){
          setError("Please choose an organization to assign the Water Monkey to.")
          setLoader(false)
      }else if(meterType == undefined){
          setError("Please choose a Meter Type.")
          setLoader(false)
      }else{
        fetch(`/api/comm-tool/step-1-assign-wm-to-org?label=${params.id}&org=${org}&meter_type=${meterType}`)
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
                            "label": params.id,
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if(data.status === "ok"){
                                setLoader(false)
                                    router.push(`/device_details/${params.id}`)
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

  async function onSubmitRecommission(){
      setModalRecommission(false)
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
                  fetch(`/api/comm-tool/step-1-assign-wm-to-org?label=${param}&org=${org}&meter_type=${meterType}`)
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
    <>
        {
            user && user.organizations ?
            <div className='container-pages'>
                {
                    modalRecommission && <ModalSingleButton message={"It appears that the device you're configuring is undergoing recommissioning. The preparation for recommissioning involves erasing the historical data on your device. This process has already commenced and will require some time to finish, depending on how extensively the device was utilized in its previous operation. You may proceed to the next stage to input the necessary information, but it is advisable to wait a day before submitting your initial readings for convenience."} action={()=> onSubmitRecommission()}/>
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
                <h1 className="text-[1.5rem] lg:text-[3.25rem] font-bold text-center text-purple">Confirm the Meter Type and Organization of this Water Monkey</h1>
                <div className="flex justify-center w-full pt-[1rem] md:pt-[3rem]">
                    <div className="w-[50vw] flex flex-col items-center justify-between">
                        {/* <WarningSign 
                            head={"WARNING!"} 
                            text={"Keep the provided magnet away from the Water Monkey until time of activation"}
                        /> */}
                        {/* <div className="mt-[1rem] md:mt-[2rem] w-full">
                            <p className="font-bold text-dark-grey w-full text-center">Enter the code here</p>
                            <input 
                                type="text" 
                                className="rounded border-[0.025rem] border-grey w-full h-[3rem] md:h-[8rem] text-[2rem] md:text-[5rem] text-grey text-center font-light"
                                onChange={e => setCode(e.target.value)}
                                placeholder="CODE" 
                            />
                        </div> */}
                        <div className="mt-[1rem] md:mt-[2rem] w-full">
                            <p className="font-bold text-dark-grey w-full text-center">Choose your Meter Type</p>
                            <select 
                                onChange={(e) => setMeterType(e.target.value)}
                                className="rounded border-[0.025rem] border-grey w-full h-[2rem] text-grey text-center font-normal cursor-pointer p-[0.25rem] pl-[0.5rem]"
                            >
                                <option>Choose Meter Type</option>
                                <option value="Single">Single</option>
                                <option value="Compound">Compound</option>
                            </select>
                        </div>
                        <div className="mt-[1rem] md:mt-[2rem] w-full mb-[2rem]">
                            <p className="font-bold text-dark-grey w-full text-center">Assign to an organization</p>
                            <select 
                                onChange={(e) => setOrg(e.target.value)}
                                className="rounded border-[0.025rem] border-grey w-full h-[2rem] text-grey text-center font-normal cursor-pointer p-[0.25rem] pl-[0.5rem]"
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
                            className="w-full button-small text-[1rem] min-h-fit"
                            onClick={()=> onSubmit()}
                        >
                            Confirm Meter Type and Organization
                        </button>
                    </div>
                </div>
            </div>
            :
            <Loader />
        }
    </>
  )
}

export default OrgAndMeter