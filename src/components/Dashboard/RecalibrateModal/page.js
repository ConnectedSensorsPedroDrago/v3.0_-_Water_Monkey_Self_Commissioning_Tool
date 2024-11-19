"use client"

import closeSmallDark from '@/public/closeSmallDark.svg'
import Image from "next/image"
import warningIcon from 'public/warningIcon.svg'
import InputFullPercentWithTitle from '../../InputFullPercentWithTitle/page'
import Input50PercentWithTitle from '../../Input50PercentWithTitle/page'
import Select50PercentWithTitle from '../../Select50PercentWithTitl/page'
import { useState } from 'react'
import { unitOfCost } from '@/src/dbs/formOptions'

function RecalibrateModal({ setRecalibrateModal, meterType, commStage, volumePerPulse, label }) {

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

    async function onSubmit(){
        let body = meterType === 0 ?
            {
                "label": label,
                "commStage": JSON.parse(commStage),
                "meterType": "Compound",
                "dateFirst": dateFirst,
                "lowSideFirst": lowSideFirst,
                "lowSideFirstUnit": lowSideFirstUnit,
                "highSideFirst": highSideFirst,
                "highSideFirstUnit": highSideFirstUnit,
                "picFirst": picFirst,
                "dateSecond": dateSecond,
                "lowSideSecond": lowSideSecond,
                "lowSideSecondUnit": lowSideSecondUnit,
                "highSideSecond": highSideSecond,
                "highSideSecondUnit": highSideSecondUnit,
                "picSecond": picSecond,
                "volumePerPulse": volumePerPulse
            }
            :
            {
                "label": label,
                "commStage": JSON.parse(commStage),
                "meterType": "Single",
                "dateFirst": dateFirst,
                "lowSideFirst": lowSideFirst,
                "lowSideFirstUnit": lowSideFirstUnit,
                "picFirst": picFirst,
                "dateSecond": dateSecond,
                "lowSideSecond": lowSideSecond,
                "lowSideSecondUnit": lowSideSecondUnit,
                "picSecond": picSecond,
                "volumePerPulse": volumePerPulse
            }
        
        fetch(`/api/dashboard/water-monkey/recalibrate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.status && data.status === 'ok'){
                console.log(data.data)
                let combination
                Object.keys(data.data).forEach(function(key, index) {
                    if(key !== 'pulses_edges'){
                        if(key == 0){
                            combination = {key: key, percentage: data.data[key].mrl_percentage_low}
                        }else{
                            combination > data.data[key].mrl_percentage_low && (combination =  {key: key, percentage: data.data[key].mrl_percentage_low})
                            if(key == '3'){
                                console.log(combination)
                                console.log(data.data[combination.key])
                            }
                        }
                    }
                })
            }
        })
    }

  return (
    <div className='fixed top-0 w-full h-full flex flex-col justify-center items-center background-blur z-1000'>
        <div className=" flex flex-col items-center justify-start md:justify-center w-full md:max-w-[60rem] h-full md:h-fit bg-white rounded shadow-md p-4 md:border-gold border-[0.05rem] overflow-scroll">
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
                        To recalibrate your Water Monkey you will be required to submit two new meter readings. We will use those readings in combination with the ones you already submited to determine the combination that will provide the best results possible for your calibration.
                    </p>
                    <p>
                        Please keep in mind that triggering a recalibration may result in calibration data loss for dates previous dates to the new first reading. Also keep in mind that the data prior to the date of your readings will remain the same and the new calibration will impact your stats after you trigger the process so you may see a different trend of data before and after the recalibration date.
                    </p>
                </div>
            </div>
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