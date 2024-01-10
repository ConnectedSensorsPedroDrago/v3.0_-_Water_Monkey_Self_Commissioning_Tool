"use client"

import { useState } from "react"
import Image from 'next/image'
import LogoBig from '@/public/logoBig.svg'
import Link from "next/link"
import { useRouter } from "next/navigation"
import loaderBig from '@/public/loaderBig.svg'
import Loader from "@/src/components/loader/page"

const Register = () => {

  let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const router = useRouter()

  const [user, setUser] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [created, setCreated] = useState(false)
  const [terms, setTerms] = useState(false)

  const createUserCheck = () => {
    setError()
    if(terms === false){
      setProcessing(false)
      setError('Please read and accept the Terms & Conditions and the Monitoring Agreement')
    }else{
      if(user.length > 0 && email.length > 0 && password.length > 0 && repeatPassword.length > 0 && name.length > 0 && description.length > 0){
        fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user: user,
            email: email,
            password: password,
            repeatPassword: repeatPassword,
            name: name,
            address: address,
            description: description,
            timezone: timezone
          })
        })
        .then(res => res.json())
        .then(data => {
          if(data.status === 'ok'){
            setCreated(true)
            setProcessing(false)
            setTimeout(()=>{
              router.push("/auth/signin")
            }, 3000)
          }else{
            setProcessing(false)
            setError(data.message)
          }
        })
      }else{
        setProcessing(false)
        setError('Please fill all the requested fields')
      }
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
    {
      processing &&
        <Loader/>
    }
    {
      created ? 
        <div className="flex flex-col justify-between items-center">
          <Image
            src={loaderBig}
            className="mb-8"
            alt="Loader"
          />        
          <p className="font-semibold text-2xl text-purple">User and organization created!<br/><br/>Redirecting you to sign in page</p>
        </div>
        :
        <>
          <Image
            src={LogoBig}
            alt="Connected Sensors Logo"
            className='mb-8 lg:mb-24 logo-big mt-24'
          />
          <div className="flex flex-col lg:flex-row md:flex-row mb-4 justify-center items-center">
            <div className="h-100 flex flex-col items-center md:items-start">
                <h2 className="mb-4 text-xl lg:text-4xl font-medium text-dark-grey">Create User</h2>
                <input className="input-base" type="text" placeholder="Username" onChange={e => {
                    setUser(e.target.value)
                }}/>
                <input className="input-base" type="email" placeholder="Email" onChange={e => {
                    setEmail(e.target.value)
                }}/>
                <input className="input-base" type="password" placeholder="Password" onChange={e => {
                    setPassword(e.target.value)
                }}/>
                <input className="input-base" type="password" placeholder="Repeat Password" onChange={e => {
                    setRepeatPassword(e.target.value)
                    if(password !== e.target.value){
                      setError("Passwords do not match, please check again.")
                    }else{
                      setError('')
                    }
                }}/>
            </div>
            <div className="lg:ml-6 md:ml-4 h-100 flex flex-col items-center md:items-start mt-4 md:mt-0 lg:mt-0">
                <h2 className="mb-4 text-xl lg:text-4xl font-medium text-dark-grey">Create Organization</h2>
                <input className="input-base" type="text" placeholder="Name" onChange={e => {
                    setName(e.target.value)
                }}/>
                <input className="input-base" type="text" placeholder="Address" onChange={e => {
                    setAddress(e.target.value)
                }}/>
                <textarea className="w-[240px] md:w-[350px] lg:w-[460px] border-grey border-[0.5px] p-2 lg:text-xl font-light mb-2 text-grey rounded h-[120px] md:text-lg text-sm resize-none" type="text" placeholder="Description" onChange={e => {
                    setDescription(e.target.value)
                }}/>
            </div>
          </div>
          <div className="flex flex-row mb-4">
            <input 
              type="checkbox"
              className="cursor-pointer"
              onClick={()=> setTerms(!terms)}
            />
            <p className="ml-[0.5rem] font-light text-[0.85rem] text-dark-grey">I have read and accept the <strong className="font-bold cursor-pointer underline hover:text-purple">Terms & Conditions</strong> and the <strong className="font-bold cursor-pointer underline hover:text-purple">Monitoring Agreement</strong></p>
          </div> 
          <button 
            className="button-big mb-4"
            onClick={()=>{
              setProcessing(true)
              createUserCheck()
            }}
            disabled={error ? true : false}
          >Create User and Organization</button>
          <p className="error-message mb-4">{error}</p>
          <hr className="border-[.25px] border-grey w-[240px] lg:w-[350px] mb-2 bg-grey"/>
          <p className="auth-text">Already registered? <Link href='/auth/signin'><u className="hover:font-bold hover:text-blue">Login here</u></Link></p>
        </>
    }
      </div>
  )
}

export default Register