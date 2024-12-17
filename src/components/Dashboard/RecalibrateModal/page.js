"use client"

import { useState } from "react"
import closeSmallDark from '@/public/closeSmallDark.svg'
import warningIcon from '@/public/warningIcon.svg'
import InputFullPercentWithTitle from "../../InputFullPercentWithTitle/page"
import Image from "next/image"
import { useRouter } from "next/navigation"

function RecalibrateModal({ setRecalibrateModal, setMessage, label }) {

    const [historicalStart, setHistoricalStart] = useState()
    const [historicalEnd, setHistoricalEnd] = useState()

    const router = useRouter()

    async function downloadHistoricalData(){
        setMessage('Feature not available yet, to be launched soon.')
        // setLoader(true)
        // if(id && email && historicalStart && historicalStart.timestamp && historicalEnd && historicalEnd.timestamp){
        //     fetch(`/api/devices/water-monkey/download-historical-data?device_id=${id}&email=${email}&timezone=${historicalStart.timezone}&start=${historicalStart.timestamp}&end=${historicalEnd.timestamp}`)
        //         .then(res => res.json())
        //         .then(data => {
        //             setLoader(false)
        //             if(data.status === "ok"){
        //                 setMessage(`Data requested successfully: you will shortly receive an email at ${email} with an CSV file with the requested historical data.`)
        //             }else if(data.status === "error"){
        //                 setMessage(`${data.message}`)
        //             }
        //         })
        // }else{
        //     setLoader(false)
        //     setMessage('Please complete all the requested fields to request the Historical Data.')
        // }
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
                       A Recalibration is normally needed when there was physical interference with the device (it was moved, taken off the meter or it has been offline to too long) and it needs to be fully reseted. This process will imply erasing the old data and resetting the device.
                    </p>
                    <p>
                        This process will delete the historical data in it leaving it the same way it was prior to the first installation. After that, you will be required to reinstall it the same way you did the first time.
                    </p>
                    <p>
                        As triggering a Recalibration will cause your current historical data to be deleted, if you intend to keep a backup of such data, please make sure to download it below before starting the process.
                    </p>
                    <p>
                        This process will imply confirming or changing the Meter Type and organization this device is attached to, as well as the Property and Meter Details, before restarting it and sumbitting the new redings.
                    </p>
                </div>
            </div>
            <p className="font-semibold text-3xl text-blue-hard w-full text-start mt-[1rem] mb-[1rem]">Download Historical Data</p>
            <p className={`text-dark-grey font-bold text-[1rem] md:text-[1.2rem] mb-[0.5rem]`}>Download historical data before Recalibration</p>
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
            <hr className="mt-4 mb-4 border-dark-grey w-full"/>
            <p className="font-semibold text-3xl text-blue-hard w-full text-start mb-[1rem]">Proceed to Recalibration</p>
            <p className={`text-dark-grey font-bold text-[1rem] md:text-[1.2rem] mb-[0.5rem]`}>Once you are happy with your data back-up</p>
            <button 
                className="button-small-blue text-[1rem]"
                onClick={()=>{
                    // setMessage('Process to be lauched soon')
                    router.push(`/device_details/org_and_meter/${label}`)
                }}
            >
                Recalibrate
            </button>
        </div>
   </div>
  )
}

export default RecalibrateModal