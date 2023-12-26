import Image from "next/image"
import Close from '@/public/closeSmallDark.svg'

const Message = ({message, setMessage}) => {


    setTimeout(()=>{
        setMessage()
    }, 5000)

  return (
    <>
    {   message &&
        <div className="fixed z-100 flex flex-col items-start justify-center top-[8%] h-contain w-[20rem] bg-white drop-shadow-md rounded p-4 border-gold border-[0.015rem] z-[200]">
            <div className="w-full flex flex-row justify-between items-start border-b-[0.05rem] border-b-blue-hard">
                <p className="text-blue-hard font-semibold text-[0.75rem]">Message</p>
                <Image 
                    src={Close}
                    className="hover:scale-110 cursor-pointer"
                    onClick={()=> setMessage()}
                />
            </div>
            <p className="text-dark-grey font-light text-[1rem] align-center w-full mt-2">{message}</p>
        </div>
    }
    </>
  )
}

export default Message