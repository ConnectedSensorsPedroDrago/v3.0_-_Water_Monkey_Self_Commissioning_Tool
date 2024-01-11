"use client"

import Link from "next/link"
import { userContext } from "@/src/context/userContext"
import { useContext, useState } from "react"
import Loader from "../loader/page"
import { useRouter } from "next/navigation"

const TermsAndConidtions = () => {

    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const { user, reloadUser, setReloadUser } = useContext(userContext)
    const [ load, setLoad ] = useState(false)
    const [ error, setError ] = useState()

    const router = useRouter()

    async function handleTermsAndConditions(user, timezone){
    setLoad(true)
    fetch('/api/users/terms-and-conditions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: user,
            timezone: timezone
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        if(data.status === "error"){
            setLoad(false)
            setError(data.message)
        }else if(data.status === "ok"){
            setReloadUser(!reloadUser)
            router.push("/home")
        }
    })
}

  return (
    <div className='z-1000 container-pages justify-center'>
        {
            load &&
            <Loader />
        }
        <p className="title justify-center text-center mb-16 md:mb-32">
            There's been a change in our Terms & Conditions and Monitorning Agreement
        </p>
        <div className="flex flex-col items-center justify-around rounded p-8">
            <div className="flex flex-col items-center justify-center ">
                <p className="w-full flex justify-center items-center font-semibold text-blue-hard text-2xl md:text-4xl mt-4 mb-2 text-center">
                    You can review them
                </p>
                <p className="w-full flex justify-center items-center font-semibold underline text-blue-hard text-2xl md:text-4xl mt-2 mb-16 md:mb-32 text-center">
                    <Link href={'http://connectedsensors.com/'}>here</Link>
                </p>
            </div>
            <div className="w-full flex flex-col items-center justify-center">
                <p className="home-text mb-2">
                    Please review and accept them below to continue:
                </p>
                <button 
                    className="button-adapt"
                    onClick={()=> handleTermsAndConditions(user.id, timezone)}
                >
                    I have read and ACCEPT the new Terms & Conditions and Monitorning Agreement
                </button>
                {
                    error &&
                    <p className="error-message">{error}</p>
                }
            </div>
        </div>
    </div>
  )
}

export default TermsAndConidtions