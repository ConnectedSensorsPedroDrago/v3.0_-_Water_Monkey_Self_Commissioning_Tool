"use client"

import LogoBig from '@/public/logoBig.svg'
import Image from 'next/image'
import { useState, useEffect } from "react"
import Link from 'next/link'
import Message from '@/src/components/Message/page'
import { useRouter } from "next/navigation"
import Loader from '@/src/components/loader/page'

const NewPassword = ({params}) => {
    const [user, setUser] = useState()
    const [message, setMessage] = useState(false)
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [loader, setLoader] = useState(true)

    const router = useRouter()

    useEffect(()=>{
        setUser(params.id)
        setLoader(false)
    }, [params])

    function checkPasswords(password, repeatPassword){
        setLoader(true)
        if(password === repeatPassword){
            changePassword(password)
        }else{
            setLoader(false)
            setMessage('The passwords you enter did not match, please try again.')
        }
    }

    function changePassword(password){
        fetch('/api/auth/new-password', {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({"password": password, "id": params.id})
        })
            .then(res => res.json())
            .then(data => {
                if(data.status === 'ok'){
                    setLoader(false)
                    setMessage("New password created successfully, you can now log in. Redirecting you to the login screen...")
                    setTimeout(()=> {
                        router.push('/auth/signin/')
                    }, 5000)
                }else{
                    setLoader(false)
                    setMessage(data.message)
                }
            })
    }

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
        {
            loader &&
            <Loader />
        }
        {
            message &&
            <Message 
                message={message}
                setMessage={setMessage}
                time={10000}
            />
        }
        <Image
            src={LogoBig}
            alt="Connected Sensors Logo"
            className='mb-24 logo-big'
        />
        <div className="flex flex-col mb-4 p-4 w-1/2 justify-center items-center">
            <input className="input-base" type="password" placeholder="Enter your new password" 
                onChange={e => {
                        setPassword(e.target.value)
                    }
                }
            />
            <input className="input-base" type="password" placeholder="Repeat your new password" 
                onChange={e => {
                        setRepeatPassword(e.target.value)
                    }
                }
            />
            <button 
                className="button-big mb-24 mt-[1rem]"
                onClick={()=> {
                    checkPasswords(password, repeatPassword)
                }}
            >
                Create new password
            </button>
            <hr className="border-[.25px] border-grey w-[240px] lg:w-[350px] mb-2 bg-grey"/>
            <p className="auth-text">Remembered your password? <Link href='/auth/signin'><u className="hover:font-bold hover:text-blue">Login here</u></Link></p>
        </div>
    </div>
  )
}

export default NewPassword