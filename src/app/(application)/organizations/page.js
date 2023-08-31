"use client"

import { useContext, useState } from "react"
import { userContext } from "@/src/context/userContext"
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

const Organization = () => {

  const { user } = useContext(userContext)
  const [ name, setName ] = useState()
  const [ address, setAddress ] = useState()
  const [ description, setDescription ] = useState()
  const [ organization, setOrganization ] = useState()
  const [ userToAdd, setUserToAdd ] = useState()

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
              setter={setOrganization} 
              name={"Organization"}
            />
            <DropDownMenuObjects 
              elements={user.organizations} 
              setter={setOrganization} 
              name={"Choose an Organization"}
            />
            <div className="md:pl-8 w-full h-5/6 md:overflow-scroll mt-4 md:mt-0">
              {
                organization ?
                <div className="w-full">
                  <Input50PercentWithTitle 
                    name={"Name"} 
                    setter={setName} 
                    placeholder={organization.name}
                  />
                  <Input50PercentWithTitle 
                    name={"Address"} 
                    setter={setAddress} 
                    placeholder={organization.properties?.address ? organization.properties.address : "Add address"}
                  />
                  <TextArea50PercentWithTitle 
                    name={"Description"} 
                    setter={setDescription} 
                    placeholder={organization.description  ? organization.description : "Add description"}
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
                  <div className="w-full mt-8 overflow-scroll">
                    <h2 className="font-semibold text-3xl">Users</h2>
                    <DropDownMenuTextBig 
                      elements={user.users} 
                      setter={setUserToAdd} 
                      placeholder={`Add new user to ${organization.name}`} 
                      buttonText={"Add"} 
                      buttonAction={()=> console.log(userToAdd)}
                    />
                    <UserTable users={organization.users} action={(i)=> console.log(i)}/>
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