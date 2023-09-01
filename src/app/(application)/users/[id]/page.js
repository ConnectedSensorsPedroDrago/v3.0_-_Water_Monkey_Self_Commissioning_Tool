"use client"

import { useContext, useEffect, useState } from "react"
import { userContext } from "@/src/context/userContext"
import AddUser from '@/public/addDevice.svg'
import Image from "next/image"
import Loader from "@/src/components/loader/page"
import SideMenu from "@/src/components/sideMenu/page"
import Input50PercentWithTitle from "@/src/components/Input50PercentWithTitle/page"
import DropDownMenuTextBig from "@/src/components/DropDownMenuTextBig/page"
import ButtonSmall from "@/src/components/buttonSmall/page"
import DropDownMenuObjects from "@/src/components/DropDownMenuObjects/page"
import MessageScreen from "@/src/components/MessageScreen/page"
import OrganizationsTable from "@/src/components/OrganizationsTable/page"
import { useRouter } from "next/navigation"

const User = ({ params }) => {

  const { user } = useContext(userContext)
  const [ name, setName ] = useState()
  const [ surname, setSurname ] = useState()
  const [ username, setUsername ] = useState()
  const [ email, setEmail ] = useState()
  const [ password, setPassword ] = useState()
  const [ repeatPassword, setRepeatPassword ] = useState()
  const [ userSelected, setUserSelected ] = useState()
  const [ orgToAdd, setOrgToAdd ] = useState()

  const router = useRouter()

  useEffect(()=>{
    if(user.users && user.users.some(({id}) => id === params.id)){
        user.users.forEach(userToInspect => {
            if(userToInspect.id === params.id){
                setUserSelected(userToInspect)
            }
        })
    } else {
        setUserSelected("Not Found")
    }
    
  }, [user.users])

  return (
    <>
      {!user.users ?
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
              action={(id)=> router.push(`/users/${id}`)}
              // setter={setUserSelected} 
              name={"Choose a User"}
            />
            <div className="md:pl-8 w-full h-5/6 md:overflow-scroll mt-4 md:mt-0">
              {
                userSelected === "Not Found" ?
                    <MessageScreen text={"User not found"}/>
                :
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
                            setter={setSurname} 
                            placeholder={userSelected.lastName ? userSelected.lastName : "Add Last Name"}
                            />
                            <Input50PercentWithTitle 
                            name={"Username"} 
                            setter={setUsername} 
                            placeholder={userSelected.username ? userSelected.username : "Add Username"}
                            />
                            <Input50PercentWithTitle 
                            name={"Email"} 
                            setter={setEmail} 
                            placeholder={userSelected.email ? userSelected.email : "Add Email"}
                            />
                            <Input50PercentWithTitle 
                            name={"Password"} 
                            setter={setPassword} 
                            placeholder={"Add a Password"}
                            type={"password"}
                            />
                            <Input50PercentWithTitle 
                            name={"Repeat Password"} 
                            setter={setRepeatPassword} 
                            placeholder={"Repeat Password"}
                            type={"password"}
                            />
                        </div>
                        <div className="w-full h-full flex flex-row items-center justify-between">
                            <ButtonSmall 
                            text={"Update"} 
                            type={"purple"} 
                            action={()=> console.log("Update")}
                            />
                        </div>
                        <div className="w-full mt-8 overflow-scroll">
                            <h2 className="font-semibold text-3xl">Organizations</h2>
                            <DropDownMenuTextBig 
                            elements={user.organizations} 
                            setter={setOrgToAdd} 
                            placeholder={`Add ${userSelected.username} to an Organization`} 
                            buttonText={"Add"} 
                            buttonAction={()=> console.log(orgToAdd)}
                            />
                            <OrganizationsTable organizations={user.organizations} remove={()=>"Organization Removed"} action={(id)=> router.push(`/organizations/${id}`)} userId={userSelected.id}/>
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

export default User