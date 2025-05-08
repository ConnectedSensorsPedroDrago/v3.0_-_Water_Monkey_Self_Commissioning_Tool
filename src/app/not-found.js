"use client"

import WarningIcon from '@/public/warningIcon.svg'
import Logo from '@/public/logo.svg'
import Image from 'next/image'
import Link from 'next/link'

const Error = ({ params }) => {

  return (
    <div className='container-dashboard h-[100vh] bg-grey-light z-0 justify-around items-center'>
      <div className='flex items-center justify-center flex-col h-[30vh]'>
        <Link
          href="/home"
        >
          <Image 
            src={Logo}
            alt="Connected Sensors Logo"
          />
        </Link>
        <hr className='border-[0.001rem] w-[95vw] border-grey opacity-30 mt-[5rem]'/>
      </div>
      <div className='flex items-center justify-center flex-col h-[40vh] bg-white w-[95vw] rounded'>
        <Image
          src={WarningIcon}
          alt="Warning" 
        />
        <p className="error-message">
          Error 404 | This page could not be found.
        </p>
      </div>
      <div className='flex flex-col items-center justify-center h-[30vh]'>
        <Link
          href="/home"
        >
          <p className='font-semibold text-[1.2rem] hover:undeline text-blue-hard'>Go Home</p>
        </Link>
      </div>
    </div>
    
  )
}

export default Error