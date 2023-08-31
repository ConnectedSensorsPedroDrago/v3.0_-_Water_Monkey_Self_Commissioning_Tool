"use client"

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'


const NavBarMenu = ({ setMenu }) => {

    const router = useRouter();

  return (
    <div 
        className='flex flex-col w-[160px] bg-white rounded p-5 absolute -ml-20 md:-ml-24 mt-0.5'
        onMouseEnter={()=> {
            setMenu(true)
        }}
        onMouseLeave={()=>{
            setMenu(false)
        }}
    >
        <button 
            className='text-start text-sm h-9 border-b-[0.5px] border-grey text-dark-grey font-light hover:font-bold cursor-pointer hover:text-blue'
            onClick={()=>{
                router.push("/profile")
            }}
        >Profile</button>
        <button 
            className='text-start text-sm h-9 border-b-[0.5px] border-grey text-dark-grey font-light hover:font-bold cursor-pointer hover:text-blue'
            onClick={()=>{
                router.push("/users")
            }}
        >Users</button>
        <button 
            className='text-start text-sm h-9 border-b-[0.5px] border-grey text-dark-grey font-light hover:font-bold cursor-pointer hover:text-blue'
            onClick={()=>{
                router.push("/organizations")
            }}
        >Organizations</button>
        <button 
            className='text-start text-sm h-9 border-b-[0.5px] border-grey text-dark-grey font-light hover:font-bold cursor-pointer hover:text-blue'
            onClick={()=>{
                router.push("/support")
            }}
        >Conatact Support</button>
        <button 
            className='text-start text-sm h-9 border-b-[0.5px] border-grey text-dark-grey font-light hover:font-bold cursor-pointer hover:text-blue'
            onClick={()=>{ 
                signOut({ redirect: false })
                    .then(()=> {
                        router.push("/auth/signin"); 
                })
            }}
        
        >Sign Out</button>
    </div>
  )
}

export default NavBarMenu