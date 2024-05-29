"use client"

import WarningIcon from '@/public/warningIcon.svg'
import Image from 'next/image'

const Error = ({ params }) => {

  return (
    <div className='container-dashboard bg-grey-light z-0'>
      <Image
        src={WarningIcon}
        alt="Warning" 
      />
      <p className="error-message">
        There has been an error, please refresh the page. If the problem persists, try navigating Home clicking the Connected Sensors logo on top and entering again.
      </p>
    </div>
    
  )
}

export default Error