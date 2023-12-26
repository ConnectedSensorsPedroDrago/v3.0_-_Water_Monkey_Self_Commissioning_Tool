import SwitchOn from '@/public/Dashboard/WaterMonkey/SwitchOn.svg'
import SwitchOnRight from '@/public/Dashboard/WaterMonkey/SwitchOnRight.svg'
import Image from 'next/image'

const SwitchDoubleText = ({ value, device }) => {

  return (
    <div className='flex flex-row items-center md:mr-[3rem]'>
        <p className='text-blue-hard font-light text-[0.75rem]'>{value.value1}</p>
        { (value.value === 0 || !value.value) ?
          <Image 
            src={SwitchOn}
            alt="Switch On"
            className='m-1 cursor-pointer scale-75'
            onClick={()=>{
              value.setter(1, device)
            }}
          />
          :
          <Image 
            src={SwitchOnRight}
            alt="Switch Off"
            className='m-1 cursor-pointer scale-75'
            onClick={()=>{
              value.setter(0, device)
            }}
          />
        }
        <p className='text-blue-hard font-light text-[0.75rem]'>{value.value2}</p>
    </div>
  )
}

export default SwitchDoubleText