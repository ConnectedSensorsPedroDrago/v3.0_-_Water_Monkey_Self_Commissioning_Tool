"use client"

import closeSmallDark from '@/public/closeSmallDark.svg'
import Image from 'next/image'
import ButtonSmall from '../../buttonSmall/page'
import { useState } from 'react'

const RecalculateModal = ({ setRecalculate, setRecommissionModal, setMessage, setRecalibrateModal }) => {

    const [page, setPage] = useState(0)

  return (
    <div className='fixed top-0 w-full h-full flex flex-col justify-center items-center background-blur z-1000'>
        <div className=" flex flex-col items-center justify-start md:justify-center w-full md:max-w-[60rem] h-full md:h-fit bg-white rounded shadow-md p-4 md:border-grey border-[0.05rem] overflow-scroll">
            <div className="w-full flex flex-row items-end justify-end">
                <Image
                    src={closeSmallDark}
                    className="md:hover:scale-125 cursor-pointer scale-[300%] md:scale-100"
                    alt={"close modal"}
                    onClick={()=>{
                        setRecalculate(false)
                    }}
                />
            </div>
            {
                page === 0 &&
                    <div className="flex flex-col items-center w-full h-full align-center justify-center">
                        <p className='text-[1.5rem] text-center text-dark-grey font-semibold'>
                            Would you like to Recommission or Recalibrate?
                        </p>
                        <br />
                        <p className='text-[0.80rem] text-center text-dark-grey'>
                            <b>RECALIBRATE</b>: is normally needed when there was physical interference with the device (it was moved, taken off the meter or it has been offline to too long) and it needs to be fully reseted. This process will imply erasing the old data and resetting the device (you will be able to export your old data on the next step before moving on to this process).
                        </p>
                        <br />
                        <ButtonSmall 
                            text={"Recalibrate"}
                            type={"blue"}
                            action={()=> {
                                setRecalibrateModal(true)
                                setRecalculate(false)
                            }}
                        />
                        <br />
                        <hr className='w-full border-dark-grey'/>
                        <br />
                        <p className='text-[0.80rem] text-center text-dark-grey'>
                            <b>RECOMMISSION</b>: is suggested for situations in which the data shown on the dashboard seems not fully accurate and an adjustment to the measuring variables would be beneficial. In that case, the device must not have been physically tampered with, moved or its position modified for it to work. Since the measuring variables will be modified, the old data will be adjusted to this new metrics (you will be able to export your old data on the next step before moving on to this process).
                        </p>
                        <br />
                        <ButtonSmall 
                            text={"Recommission"}
                            action={()=> {
                                setPage(0)
                                setRecommissionModal(true)
                                setRecalculate(false)
                            }}
                            type={"blue"}
                        />
                        <br />
                        <hr className='w-full border-dark-grey'/>
                        <br />
                        <p className='text-[0.80rem] text-center text-dark-grey'>
                            I'm not sure
                        </p>
                        <br />
                        <ButtonSmall 
                            text={"Not Sure"}
                            action={()=> setPage(page +1)}
                            type={"blue"}
                        />
                    </div>
            }
            {
                page === 1 &&
                <div className="flex flex-col items-center w-full h-full align-center justify-center">
                    <p className='text-[1.5rem] text-center text-dark-grey font-semibold mb-[1rem]'>Has your device been moved or tampered with?</p>
                    <div className='w-full flex flex-row items-center justify-around'>
                        <ButtonSmall 
                            text={"Yes"}
                            type={"blue"}
                            action={()=> {
                                setRecalibrateModal(true)
                                setRecalculate(false)
                            }}
                        />
                        <ButtonSmall 
                            text={"No"}
                            action={()=> setPage(page +1)}
                            type={"blue"}
                        />
                    </div>
                </div>
            }
            {
                page === 2 &&
                <div className="flex flex-col items-center w-full h-full align-center justify-center">
                    <p className='text-[1.5rem] text-center text-dark-grey font-semibold mb-[1rem]'>Has anything changed on the water meter?</p>
                    <div className='w-full flex flex-row items-center justify-around'>
                        <ButtonSmall 
                            text={"Yes"}
                            type={"blue"}
                            action={()=> {
                                setRecalibrateModal(true)
                                setRecalculate(false)
                            }}
                        />
                        <ButtonSmall 
                            text={"No"}
                            action={()=> setPage(page +1)}
                            type={"blue"}
                        />
                    </div>
                </div>
            }
            {
                page === 3 &&
                <div className="flex flex-col items-center w-full h-full align-center justify-center">
                    <p className='text-[1.5rem] text-center text-dark-grey font-semibold mb-[1rem]'>Has it been offline for longer than 5 days?</p>
                    <div className='w-full flex flex-row items-center justify-around'>
                        <ButtonSmall 
                            text={"Yes"}
                            type={"blue"}
                            action={()=> {
                                setRecalibrateModal(true)
                                setRecalculate(false)
                            }}
                        />
                        <ButtonSmall 
                            text={"No"}
                            action={()=> setPage(page +1)}
                            type={"blue"}
                        />
                    </div>
                </div>
            }
            {
                page === 4 &&
                <div className="flex flex-col items-center w-full h-full align-center justify-center">
                    <p className='text-[1.5rem] text-center text-dark-grey font-semibold mb-[1rem]'>Your device seems to be suitable for Recommission</p>
                    <div className='w-full flex flex-row items-center justify-around'>
                        <ButtonSmall 
                            text={"Cancel"}
                            action={()=> setPage(0)}
                            type={"blue"}
                        />
                        <ButtonSmall 
                            text={"Recommission"}
                            action={()=> {
                                setPage(0)
                                setRecommissionModal(true)
                                setRecalculate(false)
                            }}
                            type={"blue"}
                        />
                    </div>
                </div>
            }
        </div>
    </div>
  )
}

export default RecalculateModal