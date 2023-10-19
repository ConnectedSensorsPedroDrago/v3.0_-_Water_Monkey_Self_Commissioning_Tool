import Image from "next/image"
import WarningIcon from  '@/public/warningIcon.svg'

const WarningSign = ({head, text}) => {
  return (
    <div className="border-[0.20rem] p-[1.5rem] border-red w-full rounded">
        <div className="flex flex-row items-center">
            <Image 
                src={WarningIcon}
            />
            <h3 className="text-red font-bold text-[1.5rem] ml-[0.5rem]">{head}</h3>
        </div>
        <div className="mt-[0.5rem]">
            <p className="text-red">{text}</p>
        </div>
    </div>
  )
}

export default WarningSign