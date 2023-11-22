import CredentialsProvider from "next-auth/providers/credentials"

export const options = {
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth/signin',
        newUser: '/auth/register'
    },
    providers: [
        CredentialsProvider({
            name: 'your Connected Sensors account',
            credentials: {
                username: { label: "User:", type: "text", placeholder: "Your username" },
                password: { label: "Password:", type: "password" }
            },
            async authorize(credentials){
                
                let body = {
                    "grant_type": "password",
                    "username": credentials.user,
                    "password": credentials.password,
                    "scope": "read",
                    "client_id": process.env.UBIDOTS_CLIENT_ID,
                    "client_secret": process.env.UBIDOTS_CLIENT_SECRET
                }

                let reqBody = [];

                for(let property in body){
                    let encodedKey = encodeURIComponent(property);
                    let encodedValue = encodeURIComponent(body[property]);
                    reqBody.push(encodedKey + "=" + encodedValue)
                }

                reqBody = reqBody.join("&")

                try{
                    let response = await fetch('https://cs.api.ubidots.com/o/token/', {
                        method: 'POST',
                        headers:{
                            'Content-Type':'application/x-www-form-urlencoded',
                            'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                        },
                        body: reqBody
                    })
                    let data = await response.json()
                    console.log(data)
                    if(response.ok){
                        try{
                            let response = await fetch(`https://industrial.api.ubidots.com/api/v2.0/users/~${credentials.user}`, {
                                method: 'GET',
                                headers:{
                                    'Content-Type':'application/json',
                                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                                },
                            })
                            let data = await response.json()
                            let user = {
                                name: credentials.user,
                                email: data.email,
                                firstName: data.firstName,
                                lastName: data.lastName
                            }
                            return user
                        } catch(e){
                            console.log('Error requesting user: ' + e)
                        }
                    } else {
                        console.log("No user")
                        return null
                    }
                }catch(e){
                    console.log('Error: ' + e)
                }                
            }
        })
    ]
}