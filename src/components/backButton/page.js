"use client"

import Image from "next/image"
import buttonBack from '@/public/buttonBack.svg'
import { useRouter } from "next/navigation"

const BackButton = ({ url }) => {

    const router = useRouter()

  return (
    <div 
        className="flex flex-row justify-between items-center w-[55px] cursor-pointer"
        onClick={()=>{
            router.push(url)
        }}
    >
        <Image
            src={buttonBack}
            alt="Back button"
        />
        <p className="hover:underline hover:underline-offset-4 text-blue-hard">Back</p>
    </div>
  )
}

export default BackButton