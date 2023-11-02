"use client"

import { userContext } from "@/src/context/userContext"
import { useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import HomeOrganization from "@/src/components/homeOrganization/page"
import Image from "next/image"
import AddDevice from '@/public/addDevice.svg'
import Link from "next/link"

const Portfolio = () => {

  const { user } = useContext(userContext)
  const [toCommission, setToCommission] = useState([])
  console.log(user)
  const router = useRouter()

  useEffect(()=>{
    let toCommissionMonkeys = []
    user && user.devices.map(org => {
      console.log(org)
      org.monkeys !== undefined && org.monkeys.map(device => {
        let commission_stage = device.properties.commission_stage !== undefined ? JSON.parse(device.properties.commission_stage) : undefined
        device.properties.commission_stage = commission_stage
        if(commission_stage !== undefined && (commission_stage.stage === 'none' || commission_stage.stage === 'first reading' || commission_stage.stage === 'second reading')){
          toCommissionMonkeys.push(device)
        }
      })
    })
    setToCommission(toCommissionMonkeys)
  },[])

  console.log(toCommission)

  return (
    <div className="mb-32">
        {
          (!user.devices || user.devices.length < 1) ?
            <p className='h-100 w-100 flex justify-center items-center text-8xl h-screen text-blue'>Please add a device</p>
          :
            <div className="container-pages h-fit">
            <div className="fixed flex flex-row justify-around items-center z-10 bottom-8 left-[2rem]">
                {
                  toCommission &&
                  toCommission.map(device => 
                    <div key={device.id} onClick={()=> router.push(`/comm-tool/step-3/${device.label}`)} className="ml-[0.5rem] hover:scale-125 duration-500 w-[12rem] h-[12rem] rounded-md bg-blue border-grey border-[0.05rem] p-[0.75rem] flex flex-col justify-between items-center cursor-pointer">
                      <p className="w-full text-center text-white font-semibold text-[0.8rem]">Pending finish setting up</p>
                      <p className="w-full text-center text-yellow font-semibold text-[1rem]">{device.properties.address}</p>
                      <div>
                        <p className="w-full text-center text-white font-semibold text-[0.8rem]">Status</p>
                        <p className="w-full text-center text-white font-thin text-[1rem]">{device.properties.commission_stage.stage === "none" ? "Pending first meter reading" : device.properties.commission_stage.stage === "first reading" ? "Pending second meter reading" : device.properties.commission_stage.stage === "second reading" && "Pending final confirmation"}</p>
                      </div>
                    </div>
                  )
                }
              </div>
              <div className="w-[100px] h-[100px] fixed flex flex-col justify-around items-center z-10 bottom-8 right-8 hover:scale-125 duration-500 cursor-pointer">
                <Link href='/comm-tool'>
                  <Image
                    src={AddDevice}
                    alt="Add Device Button"
                  />
                </Link>
              </div>
              <div className="flex flex-row items-center justify-start w-full mt-6 mb-3 md:mb-6">
                <p className="text-purple text-2xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4">Water Monkey </p>
                <p className="text-grey text-xl md:text-4xl lg:text-5xl font-thin ml-2">| Device Overview</p>
              </div>
              {user.devices.map((org) => 
                <HomeOrganization org={org} key={org.org_id}/>
              )}
            </div>
        }
    </div>
  )
}

export default Portfolio