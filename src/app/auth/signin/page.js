"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import Image from 'next/image'
import LogoBig from '@/public/logoBig.svg'
import Link from "next/link"
import loaderBig from '@/public/loaderBig.svg'
import { useRouter } from "next/navigation"

const SignIn = () => {

    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState('')

    const router = useRouter()

    function trySignIn(user, password, event){
        event.preventDefault()
        setError('')
        setProcessing(true)
        signIn("credentials", { user, password, redirect: false })
            .then(({ok, error})=>{
                console.log(ok)
                if(error !== null){
                    if(error === 'CredentialsSignin'){
                        setError("Wrong user and/or password, please try again")
                    } else {
                        setError("There was an error logging in: " + error)
                    }
                }
                if(ok && error === null){
                    router.push("/home")
                }
            })
            .then(()=>{
                setProcessing(false)
            })
    }

  return (
    <div className="flex justify-center flex-col items-center w-screen h-screen">
        <Image 
            src={LogoBig}
            alt="Connected Sensors Logo"
            className="mb-24 logo-big"
        />
        <div className="flex justify-around flex-col items-center mb-24">
            <input 
                className="input-base"
                type="text" 
                placeholder="Username" 
                onChange={e => {
                setUser(e.target.value)
            }}/>
            <input 
                className="input-base"
                type="password" 
                placeholder="Password" 
                onChange={e => {
                setPassword(e.target.value)
            }}/>
            <button className="button-big mb-2" onClick={(e)=> {
                trySignIn(user, password, e)
            }}>Sign In</button>
            <p className="auth-text">Forgot your password? <Link href='https://www.connectedwater.ca/accounts/password/reset/'><u className="hover:font-bold hover:text-blue">Reset it here</u></Link></p>
            <p className="error-message">{error}</p>
        </div>
        {processing &&
          <div className="absolute flex flex-col items-center justify-around mb-20 opacity-50 w-screen h-screen bg-white bg-opacity-80">
            <Image
              src={loaderBig}
              alt="Loader small"
              className="scale-[250%] "
            />
          </div>
        }
        <hr className="border-[.25px] border-grey w-[240px] lg:w-[350px] mb-2 bg-grey"/>
        <p className="auth-text">Not registered? <Link href='/auth/register'><u className="hover:font-bold hover:text-blue">Create a new user here</u></Link></p>
    </div>
  )
}

export default SignIn