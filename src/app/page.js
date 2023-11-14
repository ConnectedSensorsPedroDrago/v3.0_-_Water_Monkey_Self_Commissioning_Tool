"use client"

import Head from 'next/head'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Header() {

  const router = useRouter()
  useEffect(()=>{
    setTimeout(()=>{
    router.push("/home")
  },100)
  }, [])
  
  return (
    <>
      <Head>
        <title>Connected Sensors | Water Monkey Self-Commissioning Tool</title>
        <meta name="Connected Sensors | Water Monkey Self-Commissioning Tool" content="Connected Sensors | Water Monkey Self-Commissioning Tool"/>
        <link rel="icon" href="/public/favicon.ico"/>
      </Head>
    </>
  )
}
