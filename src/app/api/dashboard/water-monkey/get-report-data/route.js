import waterMonkeyGetData from '@/src/functions/waterMonkeyGetData'

export async function GET(req){
    let device = req.nextUrl.searchParams.get("device")
    let start = req.nextUrl.searchParams.get("start")
    let end = req.nextUrl.searchParams.get("end")
    let quick = req.nextUrl.searchParams.get("quick")

    console.log(device)
    console.log(start)
    console.log(end)
    console.log(quick)

    if(!start || !end || start == "undefined" || end == "undefined" || start == null || end == null){
        return new Response(JSON.stringify({"status": "error", "message": "Please select a start and end date or a Quick Report option"}))
    }else{
        try{
            let response = await waterMonkeyGetData(device, start, end, quick)
            let data = response
            console.log(data)
        }catch(e){
            return new Response(JSON.stringify({"status": "error", "message": "There was a problem requesting the report data: " + e + ". Please try again or contact support"}))
        }
        
    }
}