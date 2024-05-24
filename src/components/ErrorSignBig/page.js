import WarningIcon from '@/public/warningIcon.svg'
import Image from 'next/image'

const ErrorSignBig = ({message}) => {
  return (
    <div className='flex flex-col items-center justify-around bg-white p-[1rem] mb-[2rem] rounded border-red border-[0.25rem]'>
        <Image
            src={WarningIcon}
            alt="Warning Icon"
        />
        <p class="error-message">{message}</p>
    </div>
  )
}

export default ErrorSignBig