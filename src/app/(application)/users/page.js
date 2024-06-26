"use client"

import { useContext, useEffect } from "react"
import { userContext } from "@/src/context/userContext"
import AddUser from '@/public/addDevice.svg'
import Image from "next/image"
import Loader from "@/src/components/loader/page"
import SideMenu from "@/src/components/sideMenu/page"
import DropDownMenuObjects from "@/src/components/DropDownMenuObjects/page"
import MessageScreen from "@/src/components/MessageScreen/page"
import { useRouter } from "next/navigation"

const Users = () => {

  const { user } = useContext(userContext)

  const router = useRouter()

  return (
    <>
      {user.role === "viewer" ?
        <div className="container-pages flex justify-center items-center">
          <p className="text-4xl text-red font-bold text-center">Not Found</p>
        </div>
        :
      !user.organizations ?
        <Loader />
        :
        <div className="container-pages md:container-pages-scroll">
          <h1 className='title'>Users</h1>
          <div 
            className="md:hidden flex flex-row justify-start items-center hover:scale-105 duration-500 cursor-pointer w-full"
            onClick={()=> router.push("/users/new-user")}
          >
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
              name={"User"}
              buttonAction={()=> router.push('/users/new-user')}
            />
            <DropDownMenuObjects 
              elements={user.users}
              action={(id)=> router.push(`/users/${id}`)}
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