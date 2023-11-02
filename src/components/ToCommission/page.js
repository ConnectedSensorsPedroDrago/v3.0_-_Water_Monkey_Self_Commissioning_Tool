import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import CloseSmall from '@/public/closeSmall.svg'

const ToCommission = ({device}) => {

    const router = useRouter()
    const [close, setClose] = useState(false)

    console.log(device)

  return (
    <div className="hover:scale-[120%] duration-500 drop-shadow-md">
         <Image 
            src={CloseSmall}
            alt="close"
            className="absolute top-1 right-1 scale-[80%] cursor-pointer opacity-20 hover:opacity-90"
            onClick={()=> setClose(true)}
        />
        <div 
            key={device.id} 
            onClick={()=> router.push(`/comm-tool/step-3/${device.label}`)} 
            className={`${close && "hidden"} ml-[0.5rem] w-[12rem] h-[12rem] rounded-md bg-blue-hard p-[0.75rem] flex flex-col justify-between items-center cursor-pointer`}
        >
            <p className="w-full text-center text-white font-thin text-[0.8rem] mt-2">Pending finish setting up</p>
            <p className="w-full text-center text-yellow font-semibold text-[1rem]">{device.properties.address}</p>
            <p className="w-full text-center text-yellow font-semibold text-[0.8rem] mt-0">({device.organization.name})</p>
            <div>
                <p className="w-full text-center text-white font-thin text-[0.75rem]">Status</p>
                <p className="w-full text-center text-white font-semibold text-[1rem]">{device.properties.commission_stage.stage === "none" ? "Pending first meter reading" : device.properties.commission_stage.stage === "first reading" ? "Pending second meter reading" : device.properties.commission_stage.stage === "second reading" && "Pending final confirmation"}</p>
            </div>
        </div>
    </div>
  )
}

export default ToCommission