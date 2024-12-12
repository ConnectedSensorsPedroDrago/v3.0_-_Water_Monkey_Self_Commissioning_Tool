import React from 'react'
import Image from 'next/image'
import BackArrow from '@/public/backArrow.svg'
import Link from 'next/link'

const CommToolTop = ({title, back, address, stage}) => {
  return (
    <div className='border-b-[0.05rem] border-blue-hard w-full flex items-center justify-between pb-[0.5rem] mb-[1rem] flex-wrap'>
        <Link 
          href={back}
          className='order-4 md:order-1'
        >
            <div className='flex flex-row items-center'>
                <Image 
                    src={BackArrow}
                    className='mr-[0.5rem]'
                    alt="back button"
                />
                <p className='font-light text-blue-hard'>{stage && (stage === "commissioned" || stage === "recommission" || stage === "recommission_failed") ? "Dashboard" : stage && (stage === "none" || stage === "first reading" || stage === "second reading") ? "Edit Details" : "Back"}</p>
            </div>
        </Link>
        {
          address &&
          <p className='order-1 md:order-1 w-[100vw] md:w-fit text-center font-semibold text-blue-hard text-[1.2rem] mb-[0.5rem] md:mb-0 border-b-[0.05rem] pb-[0.5rem] border-blue-hard md:border-b-[0rem] md:pb-[0rem]'>{address}</p>
        }
        <p className='font-bold text-blue-hard text-[1.2rem] order-4 md:order-1'>{title}</p>
    </div>
  )
}

export default CommToolTop