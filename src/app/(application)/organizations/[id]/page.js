"use client"

import { useContext, useState, useEffect } from "react"
import { userContext } from "@/src/context/userContext"
import { useRouter } from "next/navigation"
import AddOrganization from '@/public/addDevice.svg'
import Image from "next/image"
import Loader from "@/src/components/loader/page"
import SideMenu from "@/src/components/sideMenu/page"
import Input50PercentWithTitle from "@/src/components/Input50PercentWithTitle/page"
import TextArea50PercentWithTitle from "@/src/components/TextArea50PercentWithTitle/page"
import ButtonSmall from "@/src/components/buttonSmall/page"
import DropDownMenuObjects from "@/src/components/DropDownMenuObjects/page"
import DropDownMenuTextBig from "@/src/components/DropDownMenuTextBig/page"
import UserTable from "@/src/components/UserTable/page"
import MessageScreen from "@/src/components/MessageScreen/page"

const Organization = ({ params }) => {

  const { user } = useContext(userContext)
  const [ name, setName ] = useState()
  const [ address, setAddress ] = useState()
  const [ description, setDescription ] = useState()
  const [ userToAdd, setUserToAdd ] = useState()
  const [ orgSelected, setOrgSelected ] = useState()

  const router = useRouter()
  
  useEffect(()=>{
    if(user.organizations && user.organizations.some(({id}) => id === params.id)){
        user.organizations.forEach(orgToInspect => {
            if(orgToInspect.id === params.id){
                console.log(orgToInspect)
                setOrgSelected(orgToInspect)
            }
        })
    } else {
        setOrgSelected("Not Found")
    }
  }, [user.organizations])

  return (
    <>
      {!user.organizations ?
        <Loader />
        :
        <div className="container-pages md:container-pages-scroll">
          <h1 className='title'>Organizations</h1>
          <div className="md:hidden flex flex-row justify-start items-center hover:scale-105 duration-500 cursor-pointer w-full">
            <Image
              src={AddOrganization}
              alt="Add Organization Button"
              className="scale-[25%] -ml-6"
            />
            <p className="font-semibold text-sm hover:underline -ml-6">Add new Organization</p>
          </div>
          <div className="flex flex-col md:flex-row w-full h-full mt-4 md:mt-8">
            <SideMenu 
              elements={user.organizations} 
              name={"Organization"}
              buttonAction={()=> router.push('/organizations/new-organization')}
            />
            <DropDownMenuObjects 
              elements={user.organizations} 
              action={(id)=> router.push(`/organizations/${id}`)}
              name={"Choose an Organization"}
            />
            <div className="md:pl-8 w-full h-5/6 md:overflow-scroll mt-4 md:mt-0">
              {
                orgSelected === "Not Found" ?
                    <MessageScreen text={"Organization not found"}/>
                :
                orgSelected ?
                    <div className="w-full">
                        <Input50PercentWithTitle 
                            name={"Name"} 
                            setter={setName} 
                            placeholder={orgSelected.name ? orgSelected.name : "Add Name"}
                        />
                        <Input50PercentWithTitle 
                            name={"Address"} 
                            setter={setAddress} 
                            placeholder={orgSelected.properties?.address ? orgSelected.properties.address : "Add address"}
                        />
                        <TextArea50PercentWithTitle 
                            name={"Description"} 
                            setter={setDescription} 
                            placeholder={orgSelected.description  ? orgSelected.description : "Add description"}
                        />
                        <div className="w-full h-full flex flex-row items-center justify-between">
                            <ButtonSmall 
                            text={"Update"} 
                            type={"purple"} 
                            action={()=> console.log("Name: " + name + " / Address: " + address + " / Description: " + description)}
                            />
                            <ButtonSmall 
                            text={"Delete Organization"} 
                            type={"white"} 
                            action={()=> console.log(`${organization.name} Deleted`)}
                            />
                        </div>
                        <div className="w-full mt-8 overflow-scroll mb-8">
                            <h2 className="font-semibold text-3xl">Users</h2>
                            <DropDownMenuTextBig 
                            elements={user.users} 
                            setter={setUserToAdd} 
                            placeholder={`Add new user to ${orgSelected.name}`} 
                            buttonText={"Add"} 
                            buttonAction={()=> console.log(userToAdd)}
                            />
                            <UserTable users={orgSelected.users} action={(id)=> router.push(`/users/${id}`)}/>
                        </div>
                    </div>
                :
                    <MessageScreen text={"Choose an Organization"}/> 
              }
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Organization