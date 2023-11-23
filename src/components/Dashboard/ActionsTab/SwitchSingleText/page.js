import SwitchOn from '@/public/Dashboard/WaterMonkey/SwitchOn.svg'
import SwitchOff from '@/public/Dashboard/WaterMonkey/SwitchOff.svg'
import Image from 'next/image'

const SwitchSingleText = ({ value }) => {

  console.log(value)

  return (
    <div className='flex flex-row items-center w-[9.25rem]'>
        { value.value.value && value.value.value === 1 ?
          <Image 
            src={SwitchOn}
            alt="Switch On"
            className='m-2'
          />
          :
          <Image 
            src={SwitchOff}
            alt="Switch Off"
            className='m-2'
          />
        }
        <p className='text-blue-hard font-light text-sm'>{value.name}</p>
    </div>
  )
}

export default SwitchSingleText