"use client"

import Head from 'next/head'
import { useRouter } from 'next/navigation'

export default function Header() {

  const router = useRouter()
  setTimeout(()=>{
    router.push("/home")
  },100)
  
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
