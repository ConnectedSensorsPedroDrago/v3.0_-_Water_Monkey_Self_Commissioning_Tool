import Image from 'next/image'
import AddButton from '@/public/addDevice.svg'

import React from 'react'

const SideMenu = ({elements, setter, name}) => {
  return (
    <div className="border-r-[0.25px] border-dark-grey h-full w-[320px] md:flex hidden flex-col justify-between">
        <div className="w-full h-3/4 flex flex-col justify-start items-center pr-2 overflow-scroll">
            { elements &&
                elements.map(element => 
                    <div 
                        className="w-full hover:bg-light-purple active:bg-light-purple mb-2 rounded flex justify-start items-center p-2 cursor-pointer"
                        onClick={()=> setter(element)}
                        key={element.id}
                    >
                        <p className="font-semibold md:text-base lg:text-lg">{element.name ? element.name : element.username ? element.username : "Undefined" }</p>
                    </div>
                )
            }
        </div>
        <div className="absolute bottom-4 flex flex-row justify-center items-center hover:scale-105 duration-500 cursor-pointer">
            <Image
                src={AddButton}
                alt="Add Button"
                className="scale-50"
            />
            <p className="font-semibold text-sm hover:underline -ml-3">Add new {name}</p>
        </div>
    </div>

  )
}

export default SideMenu