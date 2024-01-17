import Image from 'next/image'
import ButtonSmall from '../buttonSmall/page'
import SucessTick from '@/public/successTick.svg'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import arrowLeft from '@/public/arrowLeft.svg'
import arrowRight from '@/public/arrowRight.svg'
import arrowLeftDisabled from '@/public/arrowLeftDisabled.svg'
import arrowRightDisabled from '@/public/arrowRightDisabled.svg'

const Carousell = ({message}) => {

    const router = useRouter()
    const [last, setLast] = useState(message.length -1)
    const [ subMessage, setSubMessage ] = useState(0)


  return (
    <div className="fixed top-0 w-full h-full flex flex-col justify-center items-center z-2000">
      <div className="top-[0rem] w-[100%] h-[100%] md:w-[35%] md:h-auto bg-white bg-opacity-100 rounded shadow-lg p-4 flex flex-col items-center justify-center md:justify-around border-dark-grey border-[0.05rem]">
        <div className='w-full flex flex-row items-center justify-center border-b-[0.05rem] border-grey'>
          <Image 
            src={SucessTick}
            alt="Success Tick"
            className='mr-[0.5rem] scale-75'
          />
          <p className='font-bold text-purple text-center text-[2rem]'>Readings submitted!</p>
        </div>
        <div className='flex flex-row w-full items-center justify-between mt-[4rem] mb-[4rem] md:mt-[2rem] md:mb-[2rem]'>
            {   
                subMessage === 0 ?
                <Image
                    src={arrowLeftDisabled}
                    alt="arrow"
                />
                :
                <Image 
                    src={arrowLeft}
                    onClick={()=> setSubMessage(subMessage === 0 ? 0 : subMessage -1)}
                    className='hover:scale-105 cursor-pointer'
                    alt="arrow"
                />
            }
            <div className='p-2 min-h-[20rem] md:min-h-[12rem] flex flex-col items-center justify-center'>
                <p className='text-modal p-2 text-center'>{message[subMessage][0]}</p>
                {
                    message[subMessage][1] &&
                    message[subMessage][1].map( msg =>
                        <p className={`font-semibold text-sm ${subMessage[subMessage.length] !== msg && 'mb-2'}`} key={msg}>{msg}</p>
                    ) 
                }
            </div>
            {
                subMessage === last ?
                <Image 
                    src={arrowRightDisabled}
                    alt="arrow"
                />
                :
                <Image 
                    src={arrowRight}
                    onClick={()=> setSubMessage(subMessage === last ? last : subMessage +1)}
                    className='hover:scale-105 cursor-pointer'
                    alt="arrow"
                />
            }
        </div>
        {
            subMessage === last &&
            <ButtonSmall
            text={"Take me Home"}
            type={"purple"}
            action={()=> router.push('/home')}
            />
        }
      </div>
    </div>
  )
}

export default Carousell