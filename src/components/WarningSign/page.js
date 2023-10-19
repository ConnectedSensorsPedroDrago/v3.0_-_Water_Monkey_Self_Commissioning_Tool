import Image from "next/image"
import WarningIcon from  '@/public/warningIcon.svg'

const WarningSign = ({head, text}) => {
  return (
    <div className="border-[0.20rem] p-[1.5rem] border-red w-full rounded">
        <div className="w-full flex flex-row items-center justify-center md:justify-start">
            <Image 
                src={WarningIcon}
                alt="Warning Sign"
            />
            <h3 className="text-red font-bold text-[2rem] ml-[1rem]">{head}</h3>
        </div>
        <div className="mt-[0.5rem]">
            <p className="text-red text-center md:text-start">{text}</p>
        </div>
    </div>
  )
}

export default WarningSign