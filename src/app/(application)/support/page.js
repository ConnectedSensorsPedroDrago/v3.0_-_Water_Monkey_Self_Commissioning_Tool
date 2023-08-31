"use client"

import BackButton from "@/src/components/backButton/page"
import { useState } from "react"

const Support = () => {

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const submit = async(e) => {
    e.preventDefault()
    if(subject.length === 0 || message.length === 0){

    } else {
      console.log({
        subject: subject,
        message: message,
      })
    }
  }

  return (
    <div className="container-pages">
      <div className="w-full flex flex-row justify-start items-center">
        <BackButton url={'/home'}/>
      </div>
        <h1 className="title">Contact Support</h1>
      <form
        className="flex flex-col w-full h-full items-center"
        onSubmit={(e)=> submit(e)}
        method='POST'
      >
        <input 
          className="input-base w-full"
          type="text"
          onChange={(e)=>{
            setSubject(e.target.value)
          }} 
          placeholder="Subject"
          required
        />
        <textarea 
          className="border-[0.5px] border-grey p-2 lg:text-xl font-light text-grey mb-2 text-sm md:text-lg rounded h-full w-full resize-none" 
          onChange={(e)=>{
            setMessage(e.target.value)
          }} 
          placeholder="Message"
          required
        />
        <button type="submit" className="button-big w-full self-center">Send</button>
      </form>
    </div>
  )
}

export default Support