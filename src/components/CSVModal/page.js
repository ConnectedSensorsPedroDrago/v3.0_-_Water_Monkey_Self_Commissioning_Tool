"use client"

import ButtonSmall from "../buttonSmall/page"
import closeSmallDark from '@/public/closeSmallDark.svg'
import Image from "next/image"
import InputFullPercentWithTitle from "../InputFullPercentWithTitle/page"
import SelectFullPercentWithTitle from "../SelectFullPercentWithTitl/page"
import { timeZones } from "@/src/dbs/formOptions"
import { useState } from "react"

const CSVModal = ({setCsvModal, device, setLoader, setMessage}) => {

    const [email, setEmail] = useState()
    const [start, setStart] = useState()
    const [end, setEnd] = useState()
    const [timezone, setTimezone] = useState()

    async function downloadHistoricalData(){
        setLoader(true)
        if(device && email && start && end && timezone){
            fetch('/api/devices/dowload-historical-data', {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({
                    email: email,
                    label: device,
                    timezone: timezone,
                    timestamp_start: start.timestamp,
                    timestamp_end: end.timestamp
                })
            })
                .then(res => res.json())
                .then(data => {
                    if(data.status === "ok"){
                        setLoader(false)
                        setMessage(`The report has been requested properly. You will receive an email (at ${email}) with a csv file containing the requested data. This may take some minutes, please be patient. If you do not receive it soon, please try again or contact support. Thanks.`)
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
    <div className="fixed top-0 w-full h-full flex flex-col justify-center items-center background-blur z-1000">
        <div className=" flex flex-col items-center justify-center w-full md:w-[40rem] h-full md:h-fit bg-white rounded shadow-md p-4 md:border-grey border-[0.05rem]">
            <div className="w-full flex flex-row items-end justify-end">
                <Image
                    src={closeSmallDark}
                    className="md:hover:scale-125 cursor-pointer scale-[300%] md:scale-100"
                    alt="close modal"
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
                <ButtonSmall text="Request CSV" type="blue" action={downloadHistoricalData} />
               </div>
            </div>
        </div>
    </div>
  )
}

export default CSVModal