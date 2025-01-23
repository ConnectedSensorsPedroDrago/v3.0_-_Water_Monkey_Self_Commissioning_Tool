export function convertToLiters(value, unit){
    return unit === "liters" ? Number(value) : unit === "m3" ? Number(value)*1000 : unit === "gallons" && Number(value)*3.78541
}