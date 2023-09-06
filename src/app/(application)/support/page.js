"use client"

import BackButton from "@/src/components/backButton/page"
import { useState } from "react"
import mailIcon from '@/public/mailIcon.svg'
import phoneIcon from '@/public/phoneIcon.svg'
import Image from "next/image"
import { useRouter } from "next/navigation"

const Support = () => {

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const router = useRouter()

  return (
    <div className="container-pages">
      <div className="w-full flex flex-row justify-start items-start">
        {/* <BackButton url={'/home'}/> */}
      </div>
        <h1 className="title">Contact Us</h1>
        
        <div className="w-full text-dark-grey flex flex-col justify-start h-screen">
          <div className="w-full mt-8 text-dark-grey flex flex-col justify-around mb-8">
            {/* <p className="text-lg font-light text-dark-grey">To receive support you can email or phone us</p> */}
          </div>
          <div className="mb-8 p-8">
            <p className="text-3xl font-semibold text-purple mb-2">Email</p>
            <p className="mb-4 font-light text-dark-grey">You can email us. If you do, please be as thorough in the request as possible, specifying your Organization, User and device identifyers if needed so we can assist you faster.</p>
            <div className="flex flex-row items-center justify-start">
              <Image 
                src={mailIcon}
                width={25}
                height={25}
                className="mr-1"
              />
              <p className="text-lg font-semibold text-blue-hard hover:text-purple cursor-pointer md:text-left text-right" onClick={()=> router.push('mailto:service.desk@connectedsensors.ca')}>service.desk@connectedsensors.ca</p>
            </div>
          </div>
          <div className="mb-8 p-8">
          <p className="text-3xl font-semibold text-purple mb-2">Phone</p>
            <p className="mb-4 font-light text-dark-grey">Or you can call us at the number bellow. Available Monday to Friday from 9 to 17hs ET time</p>
            <div className="flex flex-row items-center justify-start">
              <Image 
                src={phoneIcon}
                width={25}
                height={25}
                className="mr-1"
              />
              <p className="text-lg font-semibold text-blue-hard hover:text-purple cursor-pointer md:text-left text-right" onClick={()=> router.push('tel:+12896781663')}>+1 289-678-1663</p>
            </div>
          </div>
        </div>

    </div>
  )
}

export default Support