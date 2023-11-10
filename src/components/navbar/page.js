"use client"

import Logo from '@/public/logo.svg'
import logoSmall from '@/public/logoSmall.svg'
import userDefault from '@/public/userDefault.svg'
import Image from 'next/image'
import Link from 'next/link'
import NavBarMenu from '../navbarMenu/page'
import { useState, useEffect, useContext } from 'react'
import { userContext } from '@/src/context/userContext'

const NavBar = ({session}) => {

  const { setUser, user, setLoader, reloadUser, setUserSession } = useContext(userContext)

  const [menu, setMenu] = useState(false)

  useEffect( ()=>{
    setUserSession(session)
    fetch('/api/auth/complete-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        session: session,
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      setUser(data.user_info)
      setLoader(false)
    })
  }, [reloadUser])

  return (
    <>
      { user &&
        <div className="bg-white h-28 w-screen drop-shadow-md p-6 flex flex-row justify-between items-center absolute">
            <Link href='/home'>
              <Image
                  src={Logo}
                  alt="Connected Sensors Logo"
                  className="cursor-pointer hover:scale-105 duration-500 hidden md:flex"
              />
              <Image
                src={logoSmall}
                alt="Connected Sensors Logo"
                className="cursor-pointer hover:scale-105 duration-500 md:hidden "
              />
            </Link>
            <div className='flex flex-row items-center justify-between'>
            <p className='mr-6 text-grey font-light hidden md:flex'>{session.user ? session.user.name : "Welcome"}</p>
            <div>
                <Image
                    src={(user.photo === undefined || !user.photo.startsWith('http')) ? userDefault : user.photo }
                    alt="User"
                    width={75}
                    height={75}
                    className="cursor-pointer hover:scale-105 scale-75 md:scale-100 duration-500 rounded-full"
                    onMouseEnter={()=> {
                      setMenu(true)
                    }}
                    onMouseLeave={()=> {
                      setMenu(false)
                    }}
                />
                { menu === true &&
                  <NavBarMenu setMenu={setMenu} user={user}  />
                }
            </div>
        </div>
        </div>
        }
    </>
  )
}

export default NavBar