"use client"

import { useContext } from "react"
import { userContext } from "@/src/context/userContext"
import AddUser from '@/public/addDevice.svg'
import Image from "next/image"
import Loader from "@/src/components/loader/page"
import SideMenu from "@/src/components/sideMenu/page"
import DropDownMenuObjects from "@/src/components/DropDownMenuObjects/page"
import MessageScreen from "@/src/components/MessageScreen/page"

const Users = () => {

  const { user } = useContext(userContext)

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
              // setter={setUserSelected} 
              name={"User"}
            />
            <DropDownMenuObjects 
              elements={user.users} 
              // setter={setUserSelected}
              name={"Choose a User"}
            />
            <div className="md:pl-8 w-full h-5/6 md:overflow-scroll mt-4 md:mt-0">
                <MessageScreen text={"Choose a User"}/> 
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Users