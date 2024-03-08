export const getMonkeys = (user, setPortfolio) => {

    let devices

    user.organizations.forEach(async(org) =>{
        try{
            let response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/?deviceType=watermonkeyv2.0&organization__id=${org.id}&page_size=50000`, {
                method: 'GET',
                headers:{
                    'Content-Type':'application/json',
                    'X-Auth-Token': "BBFF-xQknHkxQgISqybh9pWb18ego7pOK4t",
                    // 'X-Auth-Token': process.env.UBIDOTS_AUTHTOKEN
                },
            })
            let data = await response.json()
            data.results.length > 0 &&  monkeys.push(data.results[0])
        }catch(e){
            console.log("There was an error requesting the Water Monkey devices:" + e)
        }finally{
            setPortfolio(monkeys)
        }
    })

}