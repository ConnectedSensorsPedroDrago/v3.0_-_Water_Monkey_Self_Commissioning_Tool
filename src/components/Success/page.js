import Image from 'next/image'
import ButtonSmall from '../buttonSmall/page'
import SucessTick from '@/public/successTick.svg'


const Success = ({ setter }) => {
  return (
    <div className="absolute flex flex-col items-center justify-center mb-20 w-screen h-screen z-500">
      <div className="w-[95%] h-[30%] md:w-[35%] md:h-[20%] bg-white bg-opacity-100 rounded shadow-lg p-4 flex flex-col items-center justify-around border-dark-grey border-[0.05rem]">
        <div className='w-full flex flex-row items-center justify-center border-b-[0.05rem] border-grey'>
          <Image 
            src={SucessTick}
            alt="Success Tick"
            className='mr-[0.5rem] scale-75'
          />
          <p className='font-bold text-purple text-center text-[2rem]'>Readings completed!</p>
        </div>
        <p className='text-modal'>You will be contacted by one of our representatives once the calibration process is finished.</p>
        <ButtonSmall
          text={"Ok"}
          type={"purple"}
          action={()=> setter()}
        />
      </div>
    </div>
  )
}

export default Success