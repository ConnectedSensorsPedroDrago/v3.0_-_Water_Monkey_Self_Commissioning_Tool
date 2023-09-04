import AddNewSmall from '../AddNewSmall/page'
import Link from 'next/link'

import React from 'react'

const SideMenu = ({elements, setter, name, buttonAction}) => {
  return (
    <div className="border-r-[0.25px] border-dark-grey h-full w-[320px] md:flex hidden flex-col justify-between">
        <div className="w-full h-3/4 flex flex-col justify-start items-center pr-2 overflow-scroll">
            { elements &&
                elements.map(element => 
                    <Link
                        href={name === "User" ? `/users/${element.id}` : `/organizations/${element.id}`}
                        className="w-full hover:bg-light-purple active:bg-light-purple mb-2 rounded flex justify-start items-center p-2 cursor-pointer"
                        key={element.id}
                    >
                        <div>
                            
                            <p className="font-semibold md:text-base lg:text-lg">{element.name ? element.name : element.username ? element.username : "Undefined" }</p>
                        </div>
                    </Link>
                )
            }
        </div>
        <AddNewSmall name={name} action={()=>buttonAction()}/>
    </div>

  )
}

export default SideMenu