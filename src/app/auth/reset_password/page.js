"use client"

import LogoBig from '@/public/logoBig.svg'
import Image from 'next/image'
import { useState } from "react"
import Link from 'next/link'
import Message from '@/src/components/Message/page'

const ResetPassword = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState(false)

    async function passwordReset(email){
        fetch('/api/auth/reset-password', {
            "method": "POST",
            "body": JSON.stringify({
                "email": email
            })
        })
            .then(res => res.json())
            .then(data => {
                if(data.status === "ok"){
                    setMessage("An email with a link to reset your password was sent to " + email + ". Please check your inbox and/or your spam folder for instructions on how to reset your password.")
                }else if(data.status === "error"){
                    setMessage(data.message)
                }
            })
    }

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
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
            <input className="input-base" type="text" placeholder="Enter your email" 
                onChange={e => {
                        setEmail(e.target.value)
                    }
                }
            />
            <button 
                className="button-big mb-24"
                onClick={()=> passwordReset(email)}
            >
                Send email to reset password
            </button>
            <hr className="border-[.25px] border-grey w-[240px] lg:w-[350px] mb-2 bg-grey"/>
            <p className="auth-text">Remembered your password? <Link href='/auth/signin'><u className="hover:font-bold hover:text-blue">Login here</u></Link></p>
        </div>
    </div>
  )
}

export default ResetPassword