"use client"

import { useContext, useEffect, useState } from "react"
import { userContext } from "@/src/context/userContext"
import { useRouter } from "next/navigation"
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
import deleteUser from "@/src/functions/deleteUser"
import updateUser from "@/src/functions/updateUser"
import Modal from "@/src/components/modal/page"
import addUserToOrganization from "@/src/functions/addUserToOrganization"

const User = ({ params }) => {

  const { user, setReloadUser, reloadUser } = useContext(userContext)
  const [ name, setName ] = useState()
  const [ surname, setSurname ] = useState()
  const [ username, setUsername ] = useState()
  const [ email, setEmail ] = useState()
  const [ userSelected, setUserSelected ] = useState()
  const [ orgToAdd, setOrgToAdd ] = useState()
  const [ load, setLoad ] = useState(false)
  const [ message, setMessage ] = useState('')
  const [ error, setError ] = useState('')
  const [ success, setSuccess ] = useState('') 
  const [ modal, setModal ] = useState(false)
  
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

  const handleDelete = async() => {
    setModal(false)
    setError('')
    setSuccess('')
    await deleteUser(params.id, setLoad, setMessage, setReloadUser, reloadUser)
    .then(data => {
      if(data.message === "user deleted"){
        setSuccess('User successfully deleted, redirecting you to Users...')
        setReloadUser(!reloadUser)
        setTimeout(()=>{
          router.push('/users')
        }, 1500)
      } else {
        setError('There was an error trying to delete the user, please try again or contact support')
      }
    })
  }

  const handleUpdate = async() => {
    setError('')
    setSuccess('')
    await updateUser(params.id, name, surname, setLoad)
    .then(data => {
      if(data.data.firstName === name && data.data.lastName === surname){
        setSuccess('User updated successfully!')
        setReloadUser(!reloadUser)
        setTimeout(()=>{
          router.push(`/users/${params.id}`)
        }, 1500)
      }else{
        setError('There was an error trying to update the user, please try again or contact support')
      }
    })
  }

  const handleAddUserToOrg = async() => {
    setError('')
    setSuccess('')
    await addUserToOrganization(userSelected.username, setLoad, orgToAdd, setError)
    .then(data => {
      if(data.message === "User assigned"){
        setReloadUser(!reloadUser)
        setSuccess("User successfully assigned to orgnization!")
        location.reload()
      }
    })
  }

  return (
    <>
      {modal && <Modal message={"Are you sure you want to delete this user?"} action1={()=> handleDelete()} action2={()=> setModal(false)} />}
      {load && <Loader />}
      {user.role === "viewer" ?
        <div className="container-pages flex justify-center items-center">
          <p className="text-4xl text-red font-bold text-center">Not Found</p>
        </div>
        :
        !user.users ?
        <Loader />
        :
        <div className="container-pages md:container-pages-scroll">
          <h1 className='title'>Users</h1>
          <div 
            className="md:hidden flex flex-row justify-start items-center hover:scale-105 duration-500 cursor-pointer w-full"
            onClick={()=> router.push('/users/new-user')}
          >
            <Image
              src={AddUser}
              alt="Add User Button"
              className="scale-[25%] -ml-6"
            />
            <p className="font-semibold text-sm -ml-6">Add new User</p>
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
              {
                userSelected === "Not Found" || message ?
                  <MessageScreen text={userSelected === "Not Found" ? "User not found" : "User successfully deleted, redirecting you to Users..."}/>
                :
                userSelected ?
                    <div className="w-full">
                      <div className="flex flex-row flex-wrap justify-between">
                        <Input50PercentWithTitle 
                          name={"Username"} 
                          setter={setUsername} 
                          placeholder={userSelected.username ? userSelected.username : "Add Username"}
                          disabled={true}
                        />
                        <Input50PercentWithTitle 
                          name={"Email"} 
                          setter={setEmail} 
                          placeholder={userSelected.email ? userSelected.email : "Add Email"}
                          disabled={true}
                        />
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
                      </div>
                      <div className="w-full h-full flex flex-row items-center justify-between">
                        <ButtonSmall 
                          text={"Update"} 
                          type={"purple"} 
                          action={()=> handleUpdate()}
                        />
                        <ButtonSmall 
                          text={"Delete User"}  
                          action={()=> setModal(true)}
                        />
                      </div>
                      <div className="w-full mt-8 mb-8 overflow-scroll">
                        <h2 className="font-semibold text-3xl">Organizations</h2>
                        <DropDownMenuTextBig 
                          elements={user.organizations} 
                          setter={setOrgToAdd} 
                          placeholder={`Add ${userSelected.username} to an Organization`} 
                          buttonText={"Add"} 
                          buttonAction={()=> handleAddUserToOrg()}
                          type={"organization"}
                        />
                        <OrganizationsTable 
                          organizations={user.organizations} 
                          remove={()=>"Organization Removed"} 
                          action={(id)=> router.push(`/organizations/${id}`)} 
                          userId={userSelected.id}
                        />
                      </div>
                      {error && <p className="w-full text-center font-semibold text-red">{error}</p>}
                      {success && <p className="w-full text-center font-semibold text-green">{success}</p>}
                    </div>
                  :
                    <MessageScreen 
                      text={"Choose a User"}
                    /> 
              }
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default User