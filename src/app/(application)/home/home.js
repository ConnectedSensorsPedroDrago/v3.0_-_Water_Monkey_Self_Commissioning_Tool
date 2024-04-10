"use client"

import { userContext } from "@/src/context/userContext"
import { useContext, useState, useEffect } from "react"
import HomeOrganization from "@/src/components/homeOrganization/page"
import Image from "next/image"
import AddDevice from '@/public/addDevice.svg'
import Link from "next/link"
import ToCommission from "@/src/components/ToCommission/page"
import warningIcon from '@/public/warningIcon.svg'

const Portfolio = () => {

  const { user } = useContext(userContext)
  const [toCommission, setToCommission] = useState([])

  useEffect(()=>{
    let toCommissionMonkeys = []
    user && user.devices && user.devices.map(org => {
      org.monkeys !== undefined && org.monkeys.map(device => {
        let commission_stage = device.properties.commission_stage !== undefined ? device.properties.commission_stage : undefined
        device.properties.commission_stage = commission_stage
        if(commission_stage !== undefined && (commission_stage.stage === 'none' || commission_stage.stage === 'first reading' || commission_stage.stage === 'second reading' || commission_stage.stage === 'failed')){
          toCommissionMonkeys.push(device)
        }
      })
    })
    setToCommission(toCommissionMonkeys)
  },[user])

  return (
    <div className="mb-32">
        {
          (!user.devices || user.devices.length < 1) ?
            <div className="container-pages h-fit">
              <div className="w-[100px] h-[100px] fixed flex flex-col justify-around items-center z-10 bottom-8 right-8 hover:scale-125 duration-500 cursor-pointer">
                <Link href='/comm-tool'>
                  <Image
                    src={AddDevice}
                    alt="Add Device Button"
                  />
                </Link>
              </div>
              <div className="flex flex-row items-center justify-start w-full mt-6 mb-3 md:mb-6">
                <p className="text-purple text-2xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4">Water Monkey v3.0 </p>
                <p className="text-grey text-xl md:text-4xl lg:text-5xl font-thin ml-2">| Device Overview</p>
              </div>
              <div className='justify-center w-screen pl-8 pr-8 pb-8 pt-8 flex flex-col items-center flex-wrap'>
                <div className="flex flex-col md:flex-row items-center justify-center md:justify-start">
                  <Image 
                    src={warningIcon}
                    alt="Warning Icon"
                  />
                  <p className='font-semibold text-xl md:text-3xl text-dark-grey md:ml-4 text-center md:text-start'>You do not have any organizations {user.role === 'super-viewer-test' ? ' created' : ' assigned'} yet</p>
                </div>
                <p className='font-normal text-xl md:text-xl text-dark-grey mt-4 text-center md:text-start'>{user.role === 'super-viewer-test' ? 'Please enter the Organizations section by clicking your user avatar on the top right of the screen and create your first Organization to add your first Water Monkey' : 'Please ask your Admin user to assign you an organization to start deploying Water Monkeys'}</p>
              </div>
            </div>
            :
            <div className="container-pages h-fit">
              <div className="fixed flex flex-row justify-start items-center z-10 bottom-0 left-[2rem] overflow-x-scroll w-full p-8">
                {
                  toCommission &&
                  toCommission.map(device => 
                    <ToCommission key={device.id} device={device} />
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
                <p className="text-purple text-2xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4">Water Monkey v3.0</p>
                <p className="text-grey text-xl md:text-4xl lg:text-5xl font-thin ml-2">| Device Overview</p>
              </div>
              {user.devices.length === 0 ?
                  <div className='justify-start w-screen pl-8 pr-8 pb-8 pt-8 flex flex-row items-center flex-wrap'>
                    <p className='font-semibold text-xl md:text-3xl text-dark-grey'>You do not have any organizations {user.role === 'super-viewer-test' ? 'created' : 'assigned'} yet.</p>
                  </div>
                :
                user.devices.map((org) => 
                <HomeOrganization org={org} key={org.org_id}/>
              )}
            </div>
        }
    </div>
  )
}

export default Portfolio