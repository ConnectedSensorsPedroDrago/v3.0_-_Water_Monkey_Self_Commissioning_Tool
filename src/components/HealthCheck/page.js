import Image from "next/image"
import lightGreenSmall from '@/public/lightGreenSmall.svg'
import lightRedSmall from '@/public/lightRedSmall.svg'
import lightYellowSmall from '@/public/lightYellowSmall.svg'
import healthCheck from '@/public/healthCheck.svg'


const HealthCheck = ({rsrp, calibration}) => {
  return (
    <div className='w-full flex flex-row items-center justify-center md:justify-end border-b-[0.025rem] mb-[2rem] pb-[0.75rem] bg'>
        <div className="flex flex-row items-center justify-between">
            <Image
                src={healthCheck}
                alt="Health Check"
            />
            <p className='font-bold text-dark-grey ml-2 w-full'>Health Check:</p>
        </div>
        <div className='pl-6 flex flex-row items-center justify-between'>
            {rsrp === 'none' ?
                <>
                    <Image 
                        src={lightRedSmall}
                        alt="Indicator"
                    />
                    <p className="ml-2 font-bold text-red">Offline</p>
                </>
                
                :
                rsrp > 25 ?
                <>
                    <Image 
                        src={lightGreenSmall}
                        alt="Indicator"
                    />
                    <p className="ml-2 font-bold text-green">Online</p>
                </> 
                :
                <>
                    <Image 
                        src={lightYellowSmall}
                        alt="Indicator"
                    />
                    <p className="ml-2 font-bold text-gold">Poor Signal</p>
                </>
            }
        </div>
        <div className='pl-6 flex flex-row items-center justify-between'>
            {(calibration === "Faulty" || calibration === "No data") ? 
                <>
                    <Image 
                        src={lightRedSmall}
                        alt="Indicator"
                    />
                    <p className="ml-2 font-bold text-red">Not Calibrated</p>
                </>
                :
                <>
                    <Image 
                        src={lightGreenSmall}
                        alt="Indicator"
                    />
                    <p className="ml-2 font-bold text-green">Calibrated</p>
                </>
            }
        </div>
    </div>
  )
}

export default HealthCheck