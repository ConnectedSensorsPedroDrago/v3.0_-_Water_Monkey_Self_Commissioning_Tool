"use client"

import mailIcon from '@/public/mailIcon.svg'
import phoneIcon from '@/public/phoneIcon.svg'
import Image from "next/image"
import { useRouter } from "next/navigation"

const Support = () => {

  const router = useRouter()

  return (
    <div className="container-pages">
      <div className="w-full flex flex-row justify-start items-start">
      </div>
        <h1 className="title">Contact Us</h1>
        
        <div className="w-full text-dark-grey flex flex-col md:flex-row justify-center md:justify-around h-screen md:mt-16">

          <div className="flex flex-col items-start justify-around md:w-[49%] md:h-[250px] mb-16 p-4 md:p-8 bg-light-yellow border-[0.5px] border-grey rounded">
            <div className="flex flex-row justify-start w-full h-full">
              <Image 
                src={mailIcon}
                width={35}
                height={35}
                className="mr-1 flex items-center justify-start"
                alt="Mail"
              />
              <p className="text-2xl md:text-3xl font-semibold text-dark-grey mb-2">Email</p>
            </div>
            <hr className='w-full border-grey mb-4 mt-4' />
            <p className="mb-4 font-light text-dark-grey">You can email us. If you do, please be as thorough in the request as possible, specifying your Organization, User and device identifyers if needed so we can assist you faster.</p>
            <p className="w-full md:text-xl text-lg font-semibold text-blue-hard hover:text-purple cursor-pointer text-right" onClick={()=> router.push('mailto:servicedesk@connectedsensors.ca')}>servicedesk@connectedsensors.ca</p>
          </div>

          <div className="flex flex-col items-start justify-around md:w-[49%] md:h-[250px] mb-16 p-4 md:p-8 bg-light-yellow border-[0.5px] border-grey rounded">
            <div className="flex flex-row items-center justify-start">
              <Image 
                src={phoneIcon}
                width={35}
                height={35}
                className="mr-1"
                alt="Phone"
              />
              <p className="text-2xl md:text-3xl font-semibold text-dark-grey mb-2">Phone</p>
            </div>
            <hr className='w-full border-grey mb-4 mt-4' />
            <p className="mb-4 font-light text-dark-grey">Or you can call us at the number bellow. Available Monday to Friday from 9 to 17hs ET time</p>
              <p className="w-full md:text-xl text-lg font-semibold text-blue-hard hover:text-purple cursor-pointer text-right" onClick={()=> router.push('tel:+12896781663')}>+1 289-678-1663</p>
          </div>
        </div>
    </div>
  )
}

export default Support