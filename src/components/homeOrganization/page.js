"use client"

import orgOpener from '@/public/orgOpener.svg'
import Image from 'next/image'
import HomeMonkey from '../homeMonkey/page'
import { useState } from 'react'

const HomeOrganization = ({org}) => {
    const [open, setOpen] = useState(true)

  return (
    <div className='justify-start w-screen pl-8 pr-8 pb-8 pt-8 flex flex-row items-center flex-wrap'>
        <p className='font-semibold text-xl md:text-3xl text-dark-grey'>{org.organization}</p>
        <Image
            src={orgOpener}
            alt="Organization opener button"
            className={`ml-4 cursor-pointer ${!open && 'rotate-[270deg]'}`}
            onClick={()=> setOpen(!open)}
        />
        { open &&
            <div className='w-full '>
                <div className='w-full flex h-14 flex-row items-center justify-end mt-3 border-b-[0.5px] border-grey'>
                    <div className='w-full md:w-1/2 flex items-center justify-end'>
                    <label className='text-sm w-1/4 lg:w-32 text-grey font-semibold text-center'>Device Offline</label>
                    <label className='text-sm w-1/4 lg:w-32 text-grey font-semibold text-center'>High Usage</label>
                    <label className='text-sm w-1/4 lg:w-32 text-grey font-semibold text-center'>Leak</label>
                    <label className='text-sm w-1/4 lg:w-32 text-grey font-semibold text-center'>Leak %</label>
                    </div>
                </div>
                { org.monkeys !== undefined ? 
                    org.monkeys.map(monkey =>
                        <HomeMonkey monkey={monkey} key={monkey.id}/>
                    )
                    :
                    <p className='w-full h-14 flex flex-row items-center justify-between border-b-[0.5px] border-grey home-text'>You do not have any Water Monkeys in this organization</p>
                }
            </div>
        }
    </div>
  )
}

export default HomeOrganization