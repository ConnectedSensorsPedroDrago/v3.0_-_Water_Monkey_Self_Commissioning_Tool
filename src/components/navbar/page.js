"use client"

import Logo from '@/public/logo.svg'
import logoSmall from '@/public/logoSmall.svg'
import userDefault from '@/public/userDefault.svg'
import Image from 'next/image'
import Link from 'next/link'
import NavBarMenu from '../navbarMenu/page'
import { useState, useEffect, useContext } from 'react'
import { userContext } from '@/src/context/userContext'
import { useRouter } from 'next/navigation'

const NavBar = ({session}) => {

  const { setUser, user, setLoader, reloadUser, setUserSession } = useContext(userContext)

  const [menu, setMenu] = useState(false)
  const [error, setError] = useState()

  const router = useRouter()

  useEffect(()=>{
   async function getSession(){
    setUserSession(session)
    fetch(`/api/auth/complete-user?user=${session.user.name}&email=${session.user.email}`)
    .then(res => 
        res.json()
    )
    .then(data => {
      if(data.status === 'ok'){
        setUser(data.user_info)
        setLoader(false)
      }else{
        setLoader(false)
        setError(data.message)
        setTimeout(()=>{
          router.push('/auth/signin')
        }, 5000)
      }
      
    })
   }
   getSession()
  }, [reloadUser, session])

  return (
    <>
      {
        error &&
        <div className='container-pages'>
          <p className='error-message'>{error}</p>
        </div>
      }
      { user && !error &&
        <div className="bg-white h-28 w-screen drop-shadow-md p-6 flex flex-row justify-between items-center absolute z-40">
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