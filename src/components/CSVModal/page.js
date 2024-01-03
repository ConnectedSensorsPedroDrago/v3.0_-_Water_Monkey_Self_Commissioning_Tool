"use client"

import ButtonSmall from "../buttonSmall/page"
import closeSmallDark from '@/public/closeSmallDark.svg'
import Image from "next/image"
import InputFullPercentWithTitle from "../InputFullPercentWithTitle/page"
import SelectFullPercentWithTitle from "../SelectFullPercentWithTitl/page"
import { timeZones } from "@/src/dbs/formOptions"
import { useState } from "react"

const CSVModal = ({setCsvModal, device, setLoader}) => {

    const [email, setEmail] = useState()
    const [start, setStart] = useState()
    const [end, setEnd] = useState()
    const [timezone, setTimezone] = useState()
    const [error, setError] = useState()
    const [success, setSuccess] = useState()

    async function handleSubmit(){
        setLoader(true)
        if(email && start && end && timezone){
            fetch(`/api/dashboard/water-monkey/actions/request-csv`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    device: device,
                    email: email,
                    start: start,
                    end: end,
                    timezone: timezone
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if(data.status === "ok"){
                    setLoader(false)
                    setSuccess(data.message)
                }else if(data.status === "error"){
                    setLoader(false)
                    setError(data.message)
                }
            })
        }else{
            setLoader(false)
            setError("Please complete all the required fields.")
        }
    }

  return (
    <div className="fixed top-0 w-full h-full flex flex-col justify-center items-center z-30">
        <div className=" flex flex-col items-center justify-center w-full md:w-[40rem] h-full md:h-fit bg-white rounded shadow-md p-4 md:border-gold border-[0.05rem]">
            <div className="w-full flex flex-row items-end justify-end">
                <Image
                    src={closeSmallDark}
                    className="md:hover:scale-125 cursor-pointer scale-[300%] md:scale-100"
                    onClick={()=>{
                        setCsvModal(false)
                    }}
                />
            </div>
            <div className="flex flex-col items-center w-full">
                <p className="font-semibold text-3xl text-blue-hard w-full text-start mb-[1rem]">Request CSV Report</p>
                <InputFullPercentWithTitle 
                    name={"Email"}
                    type={"text"}
                    setter={setEmail}
                />
                <InputFullPercentWithTitle 
                    name={"Start"}
                    type={"datetime-local"}
                    setter={setStart}
                />
                <InputFullPercentWithTitle 
                    name={"End"}
                    type={"datetime-local"}
                    setter={setEnd}
                />
               <SelectFullPercentWithTitle 
                    name={"Choose Timezone"}
                    elements={timeZones}
                    setter={setTimezone}
               />
               <div className="mt-[1rem] w-full h-fit flex justify-center items-center">
                <ButtonSmall text="Request CSV" type="blue" action={handleSubmit} />
               </div>
                {
                    error &&
                    <p className="error-message">{error}</p>
                }
                {
                    success &&
                    <p className="success-message">{success}</p>
                }
            </div>
        </div>
    </div>
  )
}

export default CSVModal