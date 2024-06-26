"use client"

import { useContext, useState } from "react"
import { userContext } from "@/src/context/userContext"
import { useRouter } from "next/navigation"
import Loader from "@/src/components/loader/page"
import SideMenu from "@/src/components/sideMenu/page"
import Input50PercentWithTitle from "@/src/components/Input50PercentWithTitle/page"
import ButtonSmall from "@/src/components/buttonSmall/page"
import TextArea50PercentWithTitle from "@/src/components/TextArea50PercentWithTitle/page"

const NewOrganization = () => {
    
    const { user, setUser, setReloadUser, reloadUser } = useContext(userContext)

    const router = useRouter()
    
    const [ address, setAddress ] = useState('')
    const [ name, setName ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ load, setLoad ] = useState(false)
    const [ error, setError ] = useState()
    const [ success, setSuccess ] = useState()
    
    const handleSubmit = async () => {
      setError('')
      setSuccess('')
      setLoad(true)
       if(name.length < 1 || address.length < 1){
        setLoad(false)
        setError("Please fill all the required fields")
       }else{
        fetch('/api/organizations/create-organization', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            address: address,
            description: description ? description : '',
            user: user
          })
        })
        .then(res => res.json())
        .then(data => {
          setLoad(false)
          if(data.status === "ok"){
            setSuccess(`Organization ${name} successfully created! Redirecting you to it...`)
            setReloadUser(!reloadUser)
            setTimeout(()=>{
              router.push(`/organizations/${data.id}`)
            }, 5000)
          } else if(data.status === "error"){
            setError(data.message)
          }
        })
       }
    }

  return (
    <>
      {load && <Loader />}
      {user.role === "viewer" ?
        <div className="container-pages flex justify-center items-center">
          <p className="text-4xl text-red font-bold text-center">Not Found</p>
        </div>
        :
        !user.organizations?
        <Loader />
        :
        <div className="container-pages md:container-pages-scroll">         
          <h1 className='title'>Add new Organization</h1>
          <div className="flex flex-col md:flex-row w-full h-full mt-4 md:mt-8">
            <SideMenu 
              elements={user.organizations} 
              name={"Organization"}
              buttonAction={()=> location.reload()}
            />
            <div className="flex flex-col flex-wrap justify-between items-start w-full h-fit md:pl-8">
                <div className="flex flex-col justify-start w-full">
                  <Input50PercentWithTitle 
                    name={"Name"} 
                    setter={setName} 
                    placeholder={"Add Name"}
                  />
                  <Input50PercentWithTitle 
                    name={"Address"} 
                    setter={setAddress} 
                    placeholder={"Add address"}
                  />
                  <TextArea50PercentWithTitle 
                    name={"Description"} 
                    setter={setDescription} 
                    placeholder={"Add description"}
                  />
                </div>
                <div className="flex flex-row w-full justify-center md:justify-start items-center mt-4 md:mt-0">
                    <ButtonSmall 
                        type={"purple"} 
                        text={"Create Organization"}
                        action={()=>handleSubmit()}
                    />
                </div>
                <div className="flex flex-row w-full justify-center items-center">
                    {error && <p className="text-red font-semibold text-center md:text-lg mt-4">{error}</p>}
                    {success && <p className="text-green font-semibold text-center md:text-lg mt-4">{success}</p>}
                </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default NewOrganization