"use client"

import Image from "next/image"
import HomeMonkeyLogo from '@/public/homeMonkeyLogo.svg'
import DeviceOffline from '@/public/monkeyAlerts/deviceOffline.svg'
import HighUsage from '@/public/monkeyAlerts/highUsage.svg'
import Leak from '@/public/monkeyAlerts/Leak.svg'
import LeakPercentage from '@/public/monkeyAlerts/leakPercentage.svg'
import { useEffect, useState } from "react"
import Link from "next/link"

const HomeMonkey = ({monkey}) => {

    let [alerts, setAlerts] = useState({})
    let [commissionStage, setcommissionStage] = useState()

    useEffect(()=>{
        monkey.properties.commission_stage !== undefined && setcommissionStage(monkey.properties.commission_stage)

        fetch('/api/devices/water-monkey/get-alerts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                device: monkey.label
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === "ok"){
                setAlerts(data.alerts)
            }
        })
    }, [monkey])

  return (
    <div className='w-full h-30 md:max-h30 flex flex-row items-center justify-between border-b-[0.5px] border-grey flex-wrap lg:p-1'>
        <div className="flex flex-row justify-center md:justify-start items-center w-full md:w-1/2">
            <Image 
                src={HomeMonkeyLogo}
                alt="Home Monkey Logo"
                className="md:mr-4 hidden md:flex md:scale-100"
            />
            <Link 
                href={commissionStage && commissionStage.stage !== undefined && (commissionStage.stage === 'none' || commissionStage.stage === 'first reading' || commissionStage.stage === 'second reading') ? `/comm-tool/step-3/${monkey.label}` : '#'}
            >
                <p className="text-dark-grey text-sm font-semibold md:font-normal lg:text-base mt-4 md:mt-0 text-center md:text-start hover:font-bold hover:text-blue-hard cursor-pointer">{monkey.properties.address}</p>
            </Link>
        </div>
        { commissionStage && commissionStage.stage !== undefined && (commissionStage.stage === 'none' || commissionStage.stage === 'first reading' || commissionStage.stage === 'second reading') 
            ?
            <div className="w-full md:w-1/2 flex h-14 flex-row items-center justify-end">
                <p className="text-center md:text-end w-full text-blue-hard text-sm md:font-semibold lg:text-base mt-4 md:mt-0">{commissionStage.stage === 'none' ? "Commissioning Stage: Pending First Reading" : commissionStage.stage === 'first reading' ? "Commissioning Stage: Pending Second Reading" : commissionStage.stage === 'second reading' && "Commissioning Stage: Pending Final Confirmation"}</p>
            </div>
            :
            <div className="w-full md:w-1/2 flex h-14 flex-row items-center justify-end">
                <div className="w-1/4 lg:w-32 flex items-center justify-center hover:scale-125 duration-500">
                    <Image 
                        src={DeviceOffline}
                        alt="Device Offline Indicator"
                        className={`scale-75 lg:scale-100 ${alerts.device_offline_alert === 1 && 'bg-yellow rounded-md'}`}
                    />
                    <div className="hover:opacity-100 duration-500 opacity-0 absolute text-center font-semibold z-10 w-[55px] h-[55px] flex flex-col justify-end items-bottom">
                        <p className="text-xs leading-3 text-dark-grey font-outline-2">Device Offline</p>
                    </div>
                </div>
                <div className="w-1/4 lg:w-32 flex items-center justify-center hover:scale-125 duration-500">
                    <Image 
                        src={HighUsage}
                        alt="High usage Indicator"
                        className={`scale-75 lg:scale-100 ${alerts.high_usage_alert === 1 && 'bg-yellow rounded-md'}`}
                    />
                    <div className="hover:opacity-100 duration-500 opacity-0 absolute text-center font-semibold z-10 w-[55px] h-[55px] flex flex-col justify-end items-bottom">
                        <p className="text-xs leading-3 text-dark-grey font-outline-2">High Usage</p>
                    </div>
                </div>
                <div className="w-1/4 lg:w-32 flex items-center justify-center hover:scale-125 duration-500">
                    <Image 
                        src={Leak}
                        alt="Leak Indicator"
                        className={`scale-75 lg:scale-100 ${alerts.leak_alert === 1 && 'bg-yellow rounded-md'}`}
                    />
                    <div className="hover:opacity-100 duration-500 opacity-0 absolute text-center font-semibold z-10 w-[55px] h-[55px] flex flex-col justify-end items-bottom">
                        <p className="text-xs leading-3 text-dark-grey font-outline-2">Leak</p>
                    </div>
                </div>
                <div className="w-1/4 lg:w-32 flex flex-col items-center justify-center hover:scale-125 duration-500">
                    <Image 
                        src={LeakPercentage}
                        alt="Leak Percentage Indicator"
                        className={`scale-75 lg:scale-100 ${alerts.leak_percentage_alert === 1 && 'bg-yellow rounded-md'}`}
                    />
                    <div className="hover:opacity-100 duration-500 opacity-0 absolute text-center font-semibold z-10 w-[55px] h-[50px] flex flex-col justify-end items-bottom">
                        <p className="text-xs leading-3 text-dark-grey font-outline-2">Leak %</p>
                    </div>
                </div>
            </div>
        }
    </div>
  )
}

export default HomeMonkey