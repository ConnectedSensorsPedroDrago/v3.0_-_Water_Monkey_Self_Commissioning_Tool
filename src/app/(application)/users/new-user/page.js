"use client"

import { useContext, useState } from "react"
import { userContext } from "@/src/context/userContext"
import { useRouter } from "next/navigation"
import Loader from "@/src/components/loader/page"
import SideMenu from "@/src/components/sideMenu/page"
import Input50PercentWithTitle from "@/src/components/Input50PercentWithTitle/page"
import ButtonSmall from "@/src/components/buttonSmall/page"
import CheckBox from "@/src/components/CheckBox/page"
import createUserWithOrgs from "@/src/functions/createUserWithOrgs"

const NewUser = () => {
    
    const { user, setUser, setReloadUser, reloadUser } = useContext(userContext)

    const router = useRouter()
    
    const [ username, setUsername ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ name, setName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ repeatPassword, setRepeatPassword ] = useState('')
    const [ role, setRole ] = useState('')
    const [ organizations, setOrganizations ] = useState([])
    const [ load, setLoad ] = useState(false)
    const [ error, setError ] = useState()
    const [ success, setSuccess ] = useState()
    
    const handleSubmit = async () => {
        if(!(password === repeatPassword)){
            setError("Passwords do not match")
        }else if(!(email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/g))){
            setError("Please provide a valid email address")
        }else if(!role){
            setError("Please select a role for this user")
        }else if(!(role === "super-viewer-test") && organizations.length < 1){
            setError("Please assign the user an organization if it's role is 'Viewer'")
        }else if(username.length < 1 || name.length < 1 || lastName.length < 1 || password.length < 1 || repeatPassword.length < 1 || role.length < 1){
            setError("Please complete all the required information")
        }else{
            console.log({username: username, email: email, name: name, lastName: lastName, password: password, repeatPassword: repeatPassword, role: role, organizations: organizations})
            setError('')
            setLoad(true)
            await createUserWithOrgs(username, email, name, lastName, password, role, organizations, setError, setLoad, setUser)
            .then(data => {
                console.log(data)
                setReloadUser(!reloadUser)
                if(data.message === "User created"){
                    setSuccess(`User "${username}" successfully created! Redirecting you to the new user...`)
                    setTimeout(()=>{
                        router.push(`/users/${data.id}`)
                    },1500)
                }
            })
        }
    }

  return (
    <>
      {load && <Loader />}
      {!user.organizations?
        <Loader />
        :
        <div className="container-pages md:container-pages-scroll">         
          <h1 className='title'>Add new User</h1>
          <div className="flex flex-col md:flex-row w-full h-full mt-4 md:mt-8">
            <SideMenu 
              elements={user.users} 
              name={"User"}
              buttonAction={()=> location.reload()}
            />
            <div className="flex flex-row flex-wrap justify-between items-start w-full h-fit md:pl-8">
                <Input50PercentWithTitle 
                    name={"Username"} 
                    placeholder={"Add Username"}
                    setter={setUsername}
                />
                <Input50PercentWithTitle 
                    name={"Email"} 
                    placeholder={"Add Email"}
                    setter={setEmail}
                />
                <Input50PercentWithTitle 
                    name={"Name"} 
                    placeholder={"Add Name"}
                    setter={setName}
                />
                <Input50PercentWithTitle 
                    name={"Last Name"} 
                    placeholder={"Add Last Name"}
                    setter={setLastName}
                />
                <Input50PercentWithTitle 
                    name={"Password"} 
                    placeholder={"Add Password"}
                    type={"password"}
                    setter={setPassword}
                /> 
                <Input50PercentWithTitle 
                    name={"Repeat Password"} 
                    placeholder={"Repeat Password"}
                    type={"password"}
                    setter={setRepeatPassword}
                />
                <div className="flex flex-col w-full md:w-[49%]">
                    <p className="font-semibold text-sm">Role</p>
                    <select
                        className="input-small w-full"
                        onChange={(e)=> {
                            setRole(e.target.value)
                            if(e.target.value === "super-viewer-test"){
                                let orgs = []
                                user.organizations.forEach(org => orgs.push(org.label))
                                setOrganizations(orgs)
                            } else{
                                setOrganizations([])
                            }
                        }}
                    >
                    <option value="#">Select Role</option>
                            <option
                                value="super-viewer-test"
                                key="Admin"
                            >
                                Admin (sees and edits all users and organizations)
                            </option>
                            <option
                                value="viewer"
                                key="Viewer"
                            >
                                Viewer (sees only the organizations assigned)
                            </option>
                    </select>
                </div>
                {
                    role === "viewer" &&
                    <div className="flex flex-col justify-start items-start w-full md:w-[49%] md:mb-8 md:mt-2">
                        <p className="font-semibold text-sm">Choose Organizations (for "Viewer" only)</p>
                        {
                            user.organizations.map(org =>
                                <CheckBox element={org} setter={setOrganizations} set={organizations} key={org.id}/>
                            )
                        }
                    </div>
                }
                <div className="flex flex-row w-full justify-center md:justify-end items-center mt-4 md:mt-0">
                    <ButtonSmall 
                        type={"purple"} 
                        text={"Create User"}
                        action={handleSubmit}
                    />
                </div>
                <div className="flex flex-row w-full justify-center items-center">
                    {error && <p className="text-red font-semibold text-center md:text-lg mt-4">{error}</p>}
                    {success && <p className="text-green font-semibold text-center md:text-lg mt-4">{success}</p>}
                </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default NewUser