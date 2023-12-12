import SwitchOn from '@/public/Dashboard/WaterMonkey/SwitchOn.svg'
import SwitchOnRight from '@/public/Dashboard/WaterMonkey/SwitchOnRight.svg'
import Image from 'next/image'

const SwitchDoubleText = ({ value }) => {

  return (
    <div className='flex flex-row items-center'>
        <p className='text-blue-hard font-light text-sm'>{value.value1}</p>
        { value.value && value.value === 1 ?
          <Image 
            src={SwitchOn}
            alt="Switch On"
            className='m-2 cursor-pointer'
          />
          :
          <Image 
            src={SwitchOnRight}
            alt="Switch Off"
            className='m-2 cursor-pointer'
          />
        }
        <p className='text-blue-hard font-light text-sm'>{value.value2}</p>
    </div>
  )
}

export default SwitchDoubleText