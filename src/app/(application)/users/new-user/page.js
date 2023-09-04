"use client"

import { useContext } from "react"
import { userContext } from "@/src/context/userContext"
import AddUser from '@/public/addDevice.svg'
import Image from "next/image"
import Loader from "@/src/components/loader/page"
import SideMenu from "@/src/components/sideMenu/page"
import DropDownMenuObjects from "@/src/components/DropDownMenuObjects/page"
import MessageScreen from "@/src/components/MessageScreen/page"
import { useRouter } from "next/navigation"
import Input50PercentWithTitle from "@/src/components/Input50PercentWithTitle/page"
import ButtonSmall from "@/src/components/buttonSmall/page"
import DropDownMenuTextBig from "@/src/components/DropDownMenuTextBig/page"

const NewUser = () => {

  const { user } = useContext(userContext)

  const router = useRouter()

  return (
    <>
      {!user.organizations ?
        <Loader />
        :
        <div className="container-pages md:container-pages-scroll">
          <h1 className='title'>Add new User</h1>
          <div className="flex flex-col md:flex-row w-full h-full mt-4 md:mt-8">
            <SideMenu 
              elements={user.users} 
              name={"User"}
            />
          <div className="flex flex-row flex-wrap justify-between items-start w-full h-fit md:pl-8">
            {/* <SideMenu 
              elements={user.users} 
              name={"User"}
            />
            <DropDownMenuObjects 
              elements={user.users}
              action={(id)=> router.push(`/users/${id}`)}
              name={"Choose a User"}
            /> */}
            <Input50PercentWithTitle 
                name={"Username"} 
                placeholder={"Add Username"}
            />
            <Input50PercentWithTitle 
                name={"Email"} 
                placeholder={"Add Email"}
            />
            <Input50PercentWithTitle 
                name={"Name"} 
                placeholder={"Add Name"}
            />
            <Input50PercentWithTitle 
                name={"Last Name"} 
                placeholder={"Add Last Name"}
            />
            <Input50PercentWithTitle 
                name={"Password"} 
                placeholder={"Add Password"}
                type={"password"}
            /> 
            <Input50PercentWithTitle 
                name={"Repeat Password"} 
                placeholder={"Repeat Password"}
                type={"password"}
            />
            <div className="flex flex-col w-full md:w-[49%]">
                <p className="font-semibold text-sm">Role</p>
                <select
                    className="input-small w-full"
                    onChange={(e)=> setter(e.target.value)}
                >
                <option value="#">Select Role</option>
                        <option
                            value="Admin"
                            key="Admin"
                        >
                            Admin
                        </option>
                        <option
                            value="Viewer"
                            key="Viewer"
                        >
                            Viewer
                        </option>
                </select>
            </div>
            <div className="flex flex-col justify-start items-start w-full md:w-[49%] mb-8 md:mt-2">
                <p className="font-semibold text-sm">Choose Organizations</p>
                {
                    user.organizations.map(org =>
                        <div className="flex flex-row items-center justify-start font-light hover:font-semibold hover:text-blue-hard">
                            <input className="cursor-pointer" type="checkbox" id={org.id} name={org.id} />
                            <label className="ml-4" for={org.id}>{org.name}</label>
                        </div>
                    )
                }
            </div>
            <div className="flex flex-row w-full justify-center md:justify-end items-center">
                <ButtonSmall 
                    type={"purple"} 
                    text={"Create User"}
                />
            </div>
          </div>
          </div>
        </div>
      }
    </>
  )
}

export default NewUser