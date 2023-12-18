import SwitchOn from '@/public/Dashboard/WaterMonkey/SwitchOn.svg'
import SwitchOff from '@/public/Dashboard/WaterMonkey/SwitchOff.svg'
import Image from 'next/image'

const SwitchSingleText = ({ value }) => {

  return (
    <div className='flex flex-row items-center w-[8.25rem]'>
        { value.value.value && value.value.value === 1 ?
          <Image 
            src={SwitchOn}
            alt="Switch On"
            className='mr-[0.5rem] cursor-pointer scale-75'
          />
          :
          <Image 
            src={SwitchOff}
            alt="Switch Off"
            className='mr-[0.5rem] cursor-pointer scale-75'
          />
        }
        <p className='text-blue-hard font-light text-[0.75rem]'>{value.name}</p>
    </div>
  )
}

export default SwitchSingleText