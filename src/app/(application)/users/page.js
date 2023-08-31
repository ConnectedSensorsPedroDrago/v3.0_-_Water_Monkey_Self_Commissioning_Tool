"use client"

import { useContext, useState } from "react"
import { userContext } from "@/src/context/userContext"
import AddUser from '@/public/addDevice.svg'
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
import OrganizationsTable from "@/src/components/OrganizationsTable/page"

const Users = () => {

  const { user } = useContext(userContext)
  const [ name, setName ] = useState()
  const [ address, setAddress ] = useState()
  const [ description, setDescription ] = useState()
  const [ userSelected, setUserSelected ] = useState()
  const [ userToAdd, setUserToAdd ] = useState()

  return (
    <>
      {!user.organizations ?
        <Loader />
        :
        <div className="container-pages md:container-pages-scroll">
          <h1 className='title'>Users</h1>
          <div className="md:hidden flex flex-row justify-start items-center hover:scale-105 duration-500 cursor-pointer w-full">
            <Image
              src={AddUser}
              alt="Add Organization Button"
              className="scale-[25%] -ml-6"
            />
            <p className="font-semibold text-sm hover:underline -ml-6">Add new User</p>
          </div>
          <div className="flex flex-col md:flex-row w-full h-full mt-4 md:mt-8">
            <SideMenu 
              elements={user.users} 
              setter={setUserSelected} 
              name={"User"}
            />
            <DropDownMenuObjects 
              elements={user.users} 
              setter={setUserSelected} 
              name={"Choose a User"}
            />
            <div className="md:pl-8 w-full h-5/6 md:overflow-scroll mt-4 md:mt-0">
              {
                userSelected ?
                <div className="w-full">
                  <div className="flex flex-row flex-wrap justify-between">
                    <Input50PercentWithTitle 
                      name={"Name"} 
                      setter={setName} 
                      placeholder={userSelected.firstName ? userSelected.firstName : "Add First Name"}
                    />
                    <Input50PercentWithTitle 
                      name={"Surname"} 
                      setter={setAddress} 
                      placeholder={userSelected.lastName ? userSelected.lastName : "Add Last Name"}
                    />
                    <Input50PercentWithTitle 
                      name={"Username"} 
                      setter={setAddress} 
                      placeholder={userSelected.username ? userSelected.username : "Add Username"}
                    />
                    <Input50PercentWithTitle 
                      name={"Email"} 
                      setter={setAddress} 
                      placeholder={userSelected.email ? userSelected.email : "Add Email"}
                    />
                    <Input50PercentWithTitle 
                      name={"Password"} 
                      setter={setAddress} 
                      placeholder={"Add a Password"}
                      type={"password"}
                    />
                    <Input50PercentWithTitle 
                      name={"Repeat Password"} 
                      setter={setAddress} 
                      placeholder={"Repeat Password"}
                      type={"password"}
                    />
                  </div>
                  <div className="w-full h-full flex flex-row items-center justify-between">
                    <ButtonSmall 
                      text={"Update"} 
                      type={"purple"} 
                      action={()=> console.log("Name: " + name + " / Address: " + address + " / Description: " + description)}
                    />
                  </div>
                  <div className="w-full mt-8 overflow-scroll">
                    <h2 className="font-semibold text-3xl">Organizations</h2>
                    <DropDownMenuTextBig 
                      elements={user.users} 
                      setter={setUserToAdd} 
                      placeholder={`Add ${userSelected.username} to an Organization`} 
                      buttonText={"Add"} 
                      buttonAction={()=> console.log(userToAdd)}
                    />
                    <OrganizationsTable organizations={user.organizations} action={(i)=> console.log("Removed organization: " + i)} userId={userSelected.id}/>
                  </div>
                </div>
                :
                <MessageScreen text={"Choose a User"}/> 
              }
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Users