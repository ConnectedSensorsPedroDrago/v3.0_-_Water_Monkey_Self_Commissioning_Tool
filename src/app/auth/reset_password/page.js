"use client"

import LogoBig from '@/public/logoBig.svg'
import Image from 'next/image'
import { useState } from "react"
import Link from 'next/link'

const ResetPassword = () => {
    const [email, setEmail] = useState('')
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
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
            <button className="button-big mb-24">Send email to reset password</button>
            <hr className="border-[.25px] border-grey w-[240px] lg:w-[350px] mb-2 bg-grey"/>
            <p className="auth-text">Remembered your password? <Link href='/auth/signin'><u class="hover:font-bold hover:text-blue">Login here</u></Link></p>
        </div>
    </div>
  )
}

export default ResetPassword