"use client"

import { useContext, useEffect, useState } from "react"
import { userContext } from "@/src/context/userContext"
import { useRouter } from "next/navigation"
import AddUser from '@/public/addDevice.svg'
import Image from "next/image"
import Loader from "@/src/components/loader/page"
import Input50PercentWithTitle from "@/src/components/Input50PercentWithTitle/page"
import ButtonSmall from "@/src/components/buttonSmall/page"
import updateUser from "@/src/functions/updateUser"

const Profile = ({ params }) => {

  const { user, setReloadUser, reloadUser } = useContext(userContext)
  const [ name, setName ] = useState()
  const [ surname, setSurname ] = useState()
  const [ load, setLoad ] = useState(false)
  const [ error, setError ] = useState('')
  const [ success, setSuccess ] = useState('') 
  
  const router = useRouter()
  
  // useEffect(()=>{
  //   if(user.users && user.users.some(({id}) => id === params.id)){
  //       user.users.forEach(userToInspect => {
  //           if(userToInspect.id === params.id){
  //               setUserSelected(userToInspect)
  //           }
  //       })
  //   } else {
  //       setUserSelected("Not Found")
  //   }
  // }, [user.users])

  console.log(user)

  const handleUpdate = async() => {
    setError('')
    setSuccess('')
    await updateUser(user.id, name, surname, setLoad)
    .then(data => {
      if(data.data.firstName === name && data.data.lastName === surname){
        setSuccess('User updated successfully!')
        setReloadUser(!reloadUser)
        setTimeout(()=>{
          router.push(`/profile`)
        }, 1500)
      }else{
        setError('There was an error trying to update the user, please try again or contact support')
      }
    })
  }

  return (
    <>
      {load && <Loader />}
      {!user ?
        <Loader />
        :
        <div className="container-pages md:container-pages-scroll">
          <h1 className='title'>Profile</h1>
          <div className="flex flex-col md:flex-row w-full h-full mt-4 md:mt-8">
            <div className="border-r-[0.25px] border-dark-grey h-full w-[320px] md:flex hidden flex-col justify-between">
              <div className="w-full h-3/4 flex flex-col justify-start items-center pr-2 overflow-scroll">
                <div
                    href={name === "User" ? `/users/${user.id}` : `/organizations/${user.id}`}
                    className="w-full bg-light-purple active:bg-light-purple mb-2 rounded flex justify-start items-center p-2 cursor-pointer"
                >                       
                    <p className="font-semibold md:text-base lg:text-lg">{user.name}</p>
                </div>
              </div>
            </div>
            <div className="md:pl-8 w-full h-5/6 md:overflow-scroll mt-4 md:mt-0">
              {
                user &&
                  <div className="w-full">
                    <div className="flex flex-row flex-wrap justify-between">
                      <Input50PercentWithTitle 
                        name={"Username"} 
                        placeholder={user.name ? user.name : "Add Username"}
                        disabled={true}
                      />
                      <Input50PercentWithTitle 
                        name={"Email"} 
                        placeholder={user.email ? user.email : "Add Email"}
                        disabled={true}
                      />
                      <Input50PercentWithTitle 
                        name={"Name"} 
                        setter={setName} 
                        placeholder={user.fistName ? user.fistName : "Add First Name"}
                      />
                      <Input50PercentWithTitle 
                        name={"Surname"} 
                        setter={setSurname} 
                        placeholder={user.lastName ? user.lastName : "Add Last Name"}
                      />
                    </div>
                    <div className="w-full h-full flex flex-row items-center justify-between">
                      <ButtonSmall 
                        text={"Update"} 
                        type={"purple"} 
                        action={()=> handleUpdate()}
                      />
                    </div>
                    {error && <p className="w-full text-center font-semibold text-red">{error}</p>}
                    {success && <p className="w-full text-center font-semibold text-green">{success}</p>}
                  </div>
              }
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Profile