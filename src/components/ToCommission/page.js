import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import CloseSmall from '@/public/closeSmall.svg'

const ToCommission = ({device}) => {

    const router = useRouter()
    const [close, setClose] = useState(false)

  return (
    <div className={`${close && "hidden"} hover:scale-[110%] duration-500 shadow-md hover:z-10 hover:shadow-xl border-[0.05rem] border-gold ${device.properties.commission_stage.stage === 'failed' ? 'bg-gradient-to-r from-red-300 to-red-100' : 'bg-gradient-to-t from-gray-50 to-zinc-100'} mr-4 rounded-md`}>
         <Image 
            src={CloseSmall}
            alt="close"
            className="absolute top-1 right-1 cursor-pointer"
            onClick={()=> setClose(true)}
        />
        <div 
            key={device.id} 
            onClick={()=> router.push(`/comm-tool/step-3/${device.label}`)} 
            className={`w-[10rem] h-[10.5rem] rounded-md p-[0.75rem] flex flex-col justify-between items-center cursor-pointer`}
        >
            <p className="w-full text-center text-dark-grey font-semibold text-[0.75rem] border-dark-grey border-b-[0.05rem]">{device.organization.name}</p>
            <p className="w-full text-center text-purple font-semibold text-[1rem] max-h-[3rem] overflow-hidden">{device.properties.address}</p>
            
            <div>
                <p className="w-full text-center text-dark-grey font-light text-[0.65rem]">Status</p>
                <p className="w-full text-center text-dark-grey font-semibold text-[1rem]">{device.properties.commission_stage.stage === "none" ? "Pending first meter reading" : device.properties.commission_stage.stage === "first reading" ? "Pending second meter reading" : device.properties.commission_stage.stage === "second reading" ? "Pending final confirmation" : device.properties.commission_stage.stage === "failed" && "Failed, please try again"}</p>
            </div>
        </div>
    </div>
  )
}

export default ToCommission