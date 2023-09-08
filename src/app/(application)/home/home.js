"use client"

import { userContext } from "@/src/context/userContext"
import { useContext } from "react"
import HomeOrganization from "@/src/components/homeOrganization/page"
import Image from "next/image"
import AddDevice from '@/public/addDevice.svg'

const Portfolio = () => {

  const { user } = useContext(userContext)

  return (
    <div className="mb-32">
        {
          (!user.devices || user.devices.length < 1) ?
            <p className='h-100 w-100 flex justify-center items-center text-8xl h-screen text-blue'>Please add a device</p>
          :
            <div className="container-pages h-fit">
              <div className="w-[100px] h-[100px] fixed flex flex-col justify-around items-center z-10 bottom-8 right-8 hover:scale-125 duration-500 cursor-pointer">
                <Image
                  src={AddDevice}
                  alt="Add Device Button"
                />
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