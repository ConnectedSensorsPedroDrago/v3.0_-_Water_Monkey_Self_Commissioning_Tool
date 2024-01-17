import Image from 'next/image'
import ButtonSmall from '../buttonSmall/page'
import SucessTick from '@/public/successTick.svg'
import { useRouter } from 'next/navigation'


const Success = ({ success }) => {

  const router = useRouter()

  return (
    <div className="fixed top-0 w-full h-full flex flex-col justify-center items-center z-30">
      <div className="top-[0rem] w-[100%] h-[100%] md:w-[35%] md:h-auto bg-white bg-opacity-100 rounded shadow-lg p-4 flex flex-col items-center justify-center md:justify-around border-dark-grey border-[0.05rem] z-10 ">
        <div className='w-full flex flex-row items-center justify-center border-b-[0.05rem] border-grey'>
          <Image 
            src={SucessTick}
            alt="Success Tick"
            className='mr-[0.5rem] scale-75'
          />
          <p className='font-bold text-purple text-center text-[2rem]'>Readings submitted!</p>
        </div>
        <p className='text-modal mt-[4rem] mb-[4rem] md:mt-[2rem] md:mb-[2rem]'>{success}</p>
        <ButtonSmall
          text={"Take me Home"}
          type={"purple"}
          action={()=> router.push('/home')}
        />
      </div>
    </div>
  )
}

export default Success