"use client"

import { useContext, useEffect, useState } from "react"
import { userContext } from "@/src/context/userContext"
import { useRouter } from "next/navigation"
import AddOrganization from '@/public/addDevice.svg'
import Image from "next/image"
import Loader from "@/src/components/loader/page"
import SideMenu from "@/src/components/sideMenu/page"
import Input50PercentWithTitle from "@/src/components/Input50PercentWithTitle/page"
import DropDownMenuTextBig from "@/src/components/DropDownMenuTextBig/page"
import ButtonSmall from "@/src/components/buttonSmall/page"
import DropDownMenuObjects from "@/src/components/DropDownMenuObjects/page"
import MessageScreen from "@/src/components/MessageScreen/page"
import UserTable from "@/src/components/UserTable/page"
import deleteOrganization from "@/src/functions/deleteOrganization"
import Modal from "@/src/components/modal/page"
import TextArea50PercentWithTitle from "@/src/components/TextArea50PercentWithTitle/page"
import addUserToOrganization from "@/src/functions/addUserToOrganization"
import updateOrganization from "@/src/functions/updateOrganization"
import removeUserFromOrganization from "@/src/functions/removeUserFromOrganization"

const Organization = ({ params }) => {

  const { user, setReloadUser, reloadUser } = useContext(userContext)
  const [ name, setName ] = useState()
  const [ description, setDescription ] = useState()
  const [ address, setAddress ] = useState()
  const [ orgSelected, setOrgSelected ] = useState()
  const [ userToAdd, setUserToAdd ] = useState()
  const [ load, setLoad ] = useState(false)
  const [ message, setMessage ] = useState('')
  const [ error, setError ] = useState('')
  const [ success, setSuccess ] = useState('') 
  const [ modal, setModal ] = useState(false)
  const [ modalMessage, setModalMessage ] = useState('')
  const [ userToRemove, setUserToRemove ] = useState()
  
  const router = useRouter()
  
  useEffect(()=>{
    if(user.organizations && user.organizations.some(({id}) => id === params.id)){
        user.organizations.forEach(orgToInspect => {
            if(orgToInspect.id === params.id){
                setOrgSelected(orgToInspect)
            }
        })
    } else {
        setOrgSelected("Not Found")
    }
  }, [user.users])

  const handleDelete = async() => {
    setModal(false)
    setModalMessage("")
    setError('')
    setSuccess('')
    await deleteOrganization(params.id, setMessage, setLoad, setReloadUser, setError, reloadUser)
    .then(data => {
      if(data.message === "Organization deleted"){
        setSuccess('Organization successfully deleted, redirecting you to Users...')
        setTimeout(()=>{
          router.push('/organizations')
        }, 500)
      } else {
        setError('There was an error trying to delete the organization, please try again or contact support')
      }
    })
  }

  const handleUpdate = async() => {
    setError('')
    setSuccess('')
    await updateOrganization(params.id, address, description, setLoad)
    .then(data => {
      console.log(data)
      if(data.data.description === description || data.data.properties.address === address){
        setSuccess('Organization updated successfully!')
        setReloadUser(!reloadUser)
        setTimeout(()=>{
          router.push(`/organizations/${params.id}`)
        }, 2500)
      }else{
        setError('There was an error trying to update the organization, please try again or contact support')
      }
    })
  }

  const handleAddUserToOrg = async() => {
    setError('')
    setSuccess('')
    fetch('/api/users/add-user-to-org', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToAdd: userToAdd,
        orgSelected: orgSelected.label
      })
    })
    .then(resp => resp.json())
    .then(data => {
      if(data.status === "ok"){
        setReloadUser(!reloadUser)
        setSuccess("User successfully assigned to orgnization!")
        setLoad(false)
        location.reload()
      }else if(data.status === "error"){
        setError(data.message)
      }
    })
  }

  const handleRemove = async(userToRemove) => {
    setModal(false)
    setError('')
    setSuccess('')
    setModalMessage("")
    await removeUserFromOrganization(userToRemove, setLoad, orgSelected.label, setError)
    .then(data => {
      if(data.message === "User removed"){
        setReloadUser(!reloadUser)
        setSuccess("User successfully removed from orgnization!")
        location.reload()
      }
    })
  }

  return (
    <>
      {modal && <Modal message={modalMessage} action1={()=> modalMessage === 'Are you sure you want to delete this organization?' ? handleDelete() : modalMessage === 'Are you sure you want to remove this user from this organization?' && handleRemove(userToRemove)} action2={()=> setModal(false)} />}
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
          <h1 className='title'>Organizations</h1>
          <div 
            className="md:hidden flex flex-row justify-start items-center hover:scale-105 duration-500 cursor-pointer w-full"
            onClick={()=> router.push('/users/new-user')}
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
              name={"Organizations"}
              buttonAction={()=> router.push('/organizations/new-organization')}
            />
            <DropDownMenuObjects 
              elements={user.organizations} 
              action={(id)=> router.push(`/organizations/${id}`)}
              name={"Choose an Organization"}
            />
            <div className="md:pl-8 w-full h-5/6 md:overflow-scroll mt-4 md:mt-0">
              {
                orgSelected === "Not Found" || message ?
                  <MessageScreen text={orgSelected === "Not Found" ? "Organization not found" : "Organization successfully deleted, redirecting you to Organizations..."}/>
                :
                orgSelected ?
                    <div className="w-full">
                      <div className="flex flex-col justify-start">
                        <Input50PercentWithTitle 
                          name={"Name"} 
                          setter={setName} 
                          placeholder={orgSelected.name ? orgSelected.name : "Add Name"}
                          disabled={true}
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
                      </div>
                      <div className="w-full h-full flex flex-row items-center justify-between">
                        <ButtonSmall 
                          text={"Update"} 
                          type={"purple"} 
                          action={()=> handleUpdate()}
                        />
                        <ButtonSmall 
                          text={"Delete Organization"}  
                          action={()=> {
                            setModalMessage('Are you sure you want to delete this organization?')
                            setModal(true)
                          }}
                        />
                      </div>
                      <div className="w-full mt-8 mb-8 overflow-scroll">
                        <h2 className="font-semibold text-3xl">Organizations</h2>
                        <DropDownMenuTextBig 
                          elements={user.users} 
                          setter={setUserToAdd} 
                          placeholder={`Add a User to ${orgSelected.name}`} 
                          buttonText={"Add"} 
                          buttonAction={()=> handleAddUserToOrg()}
                        />
                        <UserTable 
                          users={orgSelected.users} 
                          remove={()=>"Organization Removed"}
                          action={(id)=> {
                            setModalMessage('Are you sure you want to remove this user from this organization?')
                            setModal(true)
                            setUserToRemove(id)
                          }}
                          seeUser={(id)=> router.push(`/users/${id}`)}
                          userId={orgSelected.id}
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

export default Organization