import { toTimestamp } from "@/src/functions/toTimestamp"

async function checkPrevious(user, name, email){
  try{
    let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/users/~${user}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
      },
    })
    let data = await response.json()
    if(data.code && data.code === 404001){
      try{
        let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/organizations/~${name}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
          },
        })
        let data = await response.json()
        if(data.code && data.code === 404001){
          try{
            let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/users/?email=${email}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
              },
            })
            let data = await response.json()
            if(data.results && data.results[0] && (data.results[0].email === email)){
              return {"status": "error", "message": "The email you are trying to use is already being used by another user, please try another one."}
            }else{
              return {"status": "ok"}
            }
          }catch(e){
            return {"status": "error", "message": `There was an error checking the chosen email's availability: ${e}. Please try again or contact support.`}

          }
        }else if(data.username === user){
          return {"status": "error", "message": "Organization name already taken, please try another"}
        }else{
          return {"status": "error", "message": "Organization name already taken, please try another"}
        }
      }catch(e){
        return {"status": "error", "message": `There was an error checking the chosen organization's name availability: ${e}. Please try again or contact support.`}
      }
    }else if(data.username === user){
      return {"status": "error", "message": "Username already taken, please try another"}
    }else{
      return {"status": "error", "message": "Username already taken, please try another"}
    }
  }catch(e){
    return {"status": "error", "message": `There was an error checking the chosen username's availability: ${e}. Please try again or contact support.`}
  }
}

export async function POST(req){

  const {user, email, password, repeatPassword, name, address, description, timezone} = await req.json()

  let response = await checkPrevious(user, name, email)

  if(response.status === "ok"){
    try{
      let response = await fetch('https://industrial.api.ubidots.com/api/v2.0/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
        },
        body: JSON.stringify({
          username: user,
          password: password,
          email: email,
          properties: {
              "terms": {
                  "status": "accepted",
                  "date": new Date(),
                  "timezone": timezone,
                  "timestamp": toTimestamp(new Date())
              }
          }
        })
      })
      let data = await response.json()
      if(response.ok){
        try{
          let response = await fetch('https://industrial.api.ubidots.com/api/v2.0/organizations/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
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
              try{
                let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/users/~${user}/_/assign_organizations/`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                    },
                    body: JSON.stringify([{
                      "label": name.replaceAll(/[^A-Za-z0-9]/g, ''),
                      "role": "super-viewer-test",
                    }])
                  })
                  let data = await response.json()
                  if(response.ok){
                    return new Response(JSON.stringify({"status": "ok"}))
                  } else {
                    return new Response(JSON.stringify({"status": "error", "message": 'There has been an error assigning the organization to the user: ' + data.message + '. The user and organization have been successfully created though. Please login and contact support to ask for the organization to be assigned to your user.'}))
                  }
              } catch(e){
                return new Response(JSON.stringify({"status": "error", "message": 'There has been an error assigning the organization to the user: ' + e + '. The user and organization have been successfully created though. Please login and contact support to ask for the organization to be assigned to your user.'}))
              }
            } else {
              return new Response(JSON.stringify({"status": "error", "message": 'There has been an error creating the organization: "' + data.message + '". The user has been successfully created though. You can login and manually create the organization afterwards or contact support@connectedsensors.com'}))
            }
        } catch(e){
          return new Response(JSON.stringify({"status": "error", "message": 'There has been an error creating the organization: ' + e + '. The user has been successfully created though. You can login and manually create the organization afterwards or contact support@connectedsensors.com'}))
        }
      } else {
        return new Response(JSON.stringify({"status": "error", "message": 'There has been an error creating the user: "' + data.message + '". Please contact try again or contact support@connectedsensors.com'}))
      }
    }catch(e){
      return new Response(JSON.stringify({"status": "error", "message": 'There has been an error creating the user: ' + e + '. Please contact try again or contact support@connectedsensors.com'}))
    }
  }else{
    return new Response(JSON.stringify(response))
  }
}