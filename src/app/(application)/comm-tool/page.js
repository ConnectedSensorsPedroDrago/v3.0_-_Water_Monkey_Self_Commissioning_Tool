"use client"

import CommToolTop from "@/src/components/CommToolTop/page"
import Image from "next/image"
import Devices from '@/public/stepOneDevices.svg'
import WarningSign from "@/src/components/WarningSign/page"
import ButtonSmall from "@/src/components/buttonSmall/page"
import { userContext } from "@/src/context/userContext"
import { useContext, useState } from "react"

const CommToolHome = () => {

    const { user } = useContext(userContext)

    const [code, setCode] = useState()
    const [org, setOrg] = useState()

    const onSubmit = () => {
        console.log("Code: " + code + ' | Org: ' + org)    
    }

    console.log(user)

  return (
    <div className='container-pages h-fit'>
        <CommToolTop 
            title={"Step 1"} 
            back={'/home'} 
        />
        <h1 className="text-[3.8rem] font-bold text-center text-purple">Scan the QR Code in your Water Monkey and enter the given code in the box below</h1>
        <div className="flex justify-between w-full pt-[3rem]">
            <div className="w-[45vw] flex flex-col justify-end">
                <Image 
                    src={Devices}
                    className="absolute bottom-0 w-[45vw]"
                />
            </div>
            <div className="w-[45vw] flex flex-col items-center justify-between">
                <WarningSign 
                    head={"WARNING!"} 
                    text={"Keep the provided magnet away from the Water Monkey until time of activation"}
                />
                <div className="mt-[2rem] w-full">
                    <p className="font-bold text-dark-grey w-full text-center">Enter the code here</p>
                    <input 
                        type="text" 
                        className="rounded border-[0.025rem] border-grey w-full h-[8rem] text-[5rem] text-grey text-center font-light"
                        onChange={(e)=> setCode(e.target.value)}    
                    />
                </div>
                <div className="mt-[2rem] w-full mb-[2rem]">
                    <p className="font-bold text-dark-grey w-full text-center">Assign to an organization</p>
                    <select 
                        onChange={(e) => setOrg(e.target.value)}
                        className="rounded border-[0.025rem] border-grey w-full h-[2rem] text-grey text-center font-light cursor-pointer"
                    >
                        <option>Choose an organization</option>
                        {
                            user.organizations.map(org =>
                                <option 
                                    key={org.id} 
                                    value={org.id}
                                >
                                    {org.name}
                                </option>
                            )
                        }
                    </select>
                </div>
                <button 
                    className="w-full button-small text-[1rem] h-[2rem]"
                    onClick={()=> onSubmit()}
                >
                    Submit
                </button>
            </div>
        </div>
    </div>
  )
}

export default CommToolHome