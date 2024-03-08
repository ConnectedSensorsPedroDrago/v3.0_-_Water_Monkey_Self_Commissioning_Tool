export async function POST(req){

    const { user } = await req.json()

    let monkeys = []

    user.organizations.forEach(async(org) =>{
        try{
            let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/?deviceType=watermonkeyv2.0&organization__id=${org.id}&page_size=50000`, {
                method: 'GET',
                headers:{
                    'Content-Type':'application/json',
                    'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                },
            })
            let data = await response.json()
            if(data.results[0]){
                data.results.length > 0 && data.results.forEach( device => {
                    monkeys.push(device)
                })
            }
            return new Response(JSON.stringify({"status": "ok", "monkeys": monkeys}))
        }catch(e){
            return new Response(JSON.stringify({"status": "error","message": "There was an error requesting the Water Monkey devices:" + e}))
        }
    })

}

