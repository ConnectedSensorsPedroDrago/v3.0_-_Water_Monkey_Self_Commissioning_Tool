export async function POST(req){


  const createUserCheck = () => { 
    if(user.length > 0 && email.length > 0 && password.length > 0 && repeatPassword.length > 0 && name.length > 0 && description.length > 0){
      console.log({user, email, password, repeatPassword, name, description})
      userCreation()
    }else{
      setProcessing(false)
      setError('Please fill all the requested fields')
    }
  }

  const userCreation = async() =>{
    try{
        let response = await fetch('https://industrial.api.ubidots.com/api/v2.0/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t"
          },
          body: JSON.stringify({
            username: user,
            password: password,
            email: email
          })
        })
        let data = await response.json()
        if(response.ok){
          createOrganization()
        } else {
          setProcessing(false)
          setError('There has been an error creating the user: "' + data.message + '". Please contact try again or contact support@connectedsensors.com')
        }
      } catch(e){
        setProcessing(false)
        setError('There has been an error creating the user: ' + e + '. Please contact try again or contact support@connectedsensors.com')
      }
  }

  const createOrganization = async() =>{
    try{
      let response = await fetch('https://industrial.api.ubidots.com/api/v2.0/organizations/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t"
          },
          body: JSON.stringify({
            label: name.replaceAll(/[^A-Za-z0-9]/g, ''),
            name: name,
            description: description,
            properties: {
              address: address
            }
          })
        })
        let data = await response.json()
        console.log(data)
        console.log(response)
        if(response.ok){
          assignOrgToUser()
        } else {
          setProcessing(false)
          setError(data.message)
        }
    } catch(e){
      setProcessing(false)
      setError('There has been an error creating the organization: ' + e + '. Please contact try again or contact support@connectedsensors.com')
    }
  }

  const assignOrgToUser = async () => {
    try{
      let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/users/~${user}/_/assign_organizations/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t"
          },
          body: JSON.stringify([{
            "label": name.replaceAll(/[^A-Za-z0-9]/g, ''),
            "role": "super-viewer-test",
          }])
        })
        let data = await response.json()
        console.log(data)
        console.log(response)
        if(response.ok){
          setCreated(true)
          setTimeout(()=>{
            router.push("/auth/signin")
          }, 3000)
        } else {
          setProcessing(false)
          setError(`There was an error assigning the user to the organization: "` + data.message +  `". Please contact support at support@connectedsensors.com`)
        }

    } catch(e){
      setProcessing(false)
      setError(`There was an error assigning the user to the organization: "` + e +  `" . Please contact support at support@connectedsensors.com`)
    }
  }

  createUserCheck()
}