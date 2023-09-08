"use client"

import { useContext } from "react"
import { userContext } from "@/src/context/userContext"
import AddOrganization from '@/public/addDevice.svg'
import Image from "next/image"
import Loader from "@/src/components/loader/page"
import SideMenu from "@/src/components/sideMenu/page"
import DropDownMenuObjects from "@/src/components/DropDownMenuObjects/page"
import MessageScreen from "@/src/components/MessageScreen/page"
import { useRouter } from "next/navigation"

const Organizations = () => {

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
          <h1 className='title'>Organizations</h1>
          <div 
            className="md:hidden flex flex-row justify-start items-center hover:scale-105 duration-500 cursor-pointer w-full"
            onClick={()=> router.push('/organizations/new-organization')}  
          >
            <Image
              src={AddOrganization}
              alt="Add Organization Button"
              className="scale-[25%] -ml-6"
            />
            <p className="font-semibold text-sm -ml-6">Add new Organization</p>
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
                <MessageScreen text={"Choose an Organization"}/>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Organizations