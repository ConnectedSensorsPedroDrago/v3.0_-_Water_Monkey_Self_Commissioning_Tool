import React from 'react'
import Image from 'next/image'
import BackArrow from '@/public/backArrow.svg'
import Link from 'next/link'

const CommToolTop = ({title, back}) => {
  return (
    <div className='border-b-[0.05rem] border-blue-hard w-full flex items-center justify-between pb-[0.5rem] mb-[1rem]'>
        <Link href={back}>
            <div className='flex flex-row items-center'>
                <Image 
                    src={BackArrow}
                    className='mr-[0.5rem]'
                    alt="back button"
                />
                <p className='font-light text-blue-hard'>Back</p>
            </div>
        </Link>
        <p className='font-bold text-blue-hard text-[1.2rem]'>{title}</p>
        {/* <div></div> */}
    </div>
  )
}

export default CommToolTop