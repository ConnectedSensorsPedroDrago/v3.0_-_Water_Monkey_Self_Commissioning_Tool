"use client"

import { useContext, useState } from "react"
import { userContext } from "@/src/context/userContext"
import { useRouter } from "next/navigation"
import Loader from "@/src/components/loader/page"
import Input50PercentWithTitle from "@/src/components/Input50PercentWithTitle/page"
import ButtonSmall from "@/src/components/buttonSmall/page"

const Profile = () => {

  const { user, setReloadUser, reloadUser } = useContext(userContext)
  const [ name, setName ] = useState()
  const [ surname, setSurname ] = useState()
  const [ load, setLoad ] = useState(false)
  const [ error, setError ] = useState('')
  const [ success, setSuccess ] = useState('') 
  
  const router = useRouter()

  const handleUpdate = async() => {
    setError('')
    setSuccess('')
    fetch('/api/users/update-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'user': user.id,
        'firstName': name,
        'lastName': surname
      })
    })
      .then(res => res.json())
      .then(data => {
        if(data.status && data.status === 'ok'){
          setSuccess('User updated successfully!')
          setReloadUser(!reloadUser)
          setTimeout(()=>{
            router.push(`/profile`)
          }, 1500)
        }else if(data.status && data.status === 'error'){
          setError(data.message)
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
                    <div className="w-full flex flex-col items-start justify-around h-[100px]">
                      <ButtonSmall 
                        text={"Reset Password"} 
                        action={()=> router.push('https://www.connectedwater.ca/accounts/password/reset/')}
                      />
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