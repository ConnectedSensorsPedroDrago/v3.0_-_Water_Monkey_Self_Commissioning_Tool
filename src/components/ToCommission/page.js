import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import CloseSmall from '@/public/closeSmall.svg'

const ToCommission = ({device}) => {

    const router = useRouter()
    const [close, setClose] = useState(false)

  return (
    <div className="hover:scale-110 duration-500">
         <Image 
            src={CloseSmall}
            alt="close"
            className="absolute top-1 right-1 scale-[80%] cursor-pointer"
            onClick={()=> setClose(true)}
        />
        <div 
            key={device.id} 
            onClick={()=> router.push(`/comm-tool/step-3/${device.label}`)} 
            className={`${close && "hidden"} ml-[0.5rem] w-[12rem] h-[12rem] rounded-md bg-blue border-grey border-[0.05rem] p-[0.75rem] flex flex-col justify-between items-center cursor-pointer`}
        >
            <p className="w-full text-center text-white font-semibold text-[0.8rem]">Pending finish setting up</p>
            <p className="w-full text-center text-yellow font-semibold text-[1rem]">{device.properties.address}</p>
            <div>
                <p className="w-full text-center text-white font-semibold text-[0.8rem]">Status</p>
                <p className="w-full text-center text-white font-thin text-[1rem]">{device.properties.commission_stage.stage === "none" ? "Pending first meter reading" : device.properties.commission_stage.stage === "first reading" ? "Pending second meter reading" : device.properties.commission_stage.stage === "second reading" && "Pending final confirmation"}</p>
            </div>
        </div>
    </div>
  )
}

export default ToCommission