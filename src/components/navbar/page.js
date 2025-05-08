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

  function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      document.querySelector(".header").style.height = "50px";
      document.querySelector(".header").style.filter = "drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04))"
      document.querySelector(".logo").style.height = "30px";
      document.querySelector(".logo_small").style.height = "25px";
      document.querySelector(".user_image").style.height = "35px";
      document.querySelector(".user_image").style.width = "35px";
      // document.querySelector(".header").style.backgroundColor = "#ffffff99";
      // document.querySelector(".username").style.fontWeight = "500";
      // document.querySelector(".username").style.color = "#333333";
    } else {
      document.querySelector(".header").style.height = "90px";
      document.querySelector(".header").style.filter = "none"
      document.querySelector(".logo").style.height = "50px";
      document.querySelector(".logo").style.width = "50px";
      document.querySelector(".logo_small").style.height = "50px";
      document.querySelector(".user_image").style.height = "60px";
      document.querySelector(".user_image").style.width = "60px";
      // document.querySelector(".header").style.backgroundColor = "#ffffff";
      // document.querySelector(".username").style.fontWeight = "300";
      // document.querySelector(".username").style.color = "#8E8E8E";
    }
  }

  window.onscroll = function() {scrollFunction()};

  return (
    <>
      {
        error &&
        <div className='container-pages'>
          <p className='error-message'>{error}</p>
        </div>
      }
      { user && !error &&
        <div className="header duration-500 bg-white h-15 md:h-22 w-screen p-6 flex flex-row justify-between items-center sticky top-0 z-40 bg-opacity-75">
            <Link href='/home'>
              <Image
                  src={logoSmall}
                  alt="Connected Sensors Logo"
                  className="logo cursor-pointer hover:scale-105 duration-500 hidden md:flex"
              />
              <Image
                src={logoSmall}
                alt="Connected Sensors Logo"
                className="logo_small cursor-pointer hover:scale-105 duration-500 md:hidden "
              />
            </Link>
            <div className='flex flex-row items-center justify-between'>
            <p className='username mr-6 text-dark-grey font-semibold hidden md:flex'>{session.user ? session.user.name : "Welcome"}</p>
            <div>
                <Image
                    src={(user.photo === undefined || !user.photo.startsWith('http')) ? userDefault : user.photo }
                    alt="User"
                    width={75}
                    height={75}
                    className="user_image cursor-pointer hover:scale-105 scale-75 md:scale-100 duration-500 rounded-full"
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