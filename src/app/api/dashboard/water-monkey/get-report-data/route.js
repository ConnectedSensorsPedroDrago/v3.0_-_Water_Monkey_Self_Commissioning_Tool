export async function POST(req){

    const { device, start, end, variables } = await req.json()

    let values = {}

    if(!start || !end || start == "undefined" || end == "undefined" || start == null || end == null){
        return new Response(JSON.stringify({"status": "error", "message": "Please select a start and end date or a Quick Report option"}))
    }else{ 
        console.log("variables.length:" + variables.length)
        if(variables.length < 9){
            return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the aggregated variables: some variables were not found, only " + variables.length + " out of 9" }))
        }else{
            let count = 0
            for(let i = 0; i <= variables.length; i++){
                try{
                    let response = await fetch(`https://industrial.api.ubidots.com/api/v1.6/variables/${variables[i].id}/statistics/sum/${start}/${end}`, {
                        headers: {
                            "X-Auth-Token": process.env.UBIDOTS_AUTHTOKEN
                        }
                    })
                    let data = await response.json()
                    values[variables[i].label] = data.sum
                }catch(e){
                    return new Response(JSON.stringify({"status": "error", "message": "There was an error requesting the aggregated variables: " + e}))
                }finally{
                    count = count + 1
                    if(count === variables.length){
                        return new Response(JSON.stringify({"status": "ok", "data": values}))
                    }
                }
            }
        }
    }
}

