"use client"

import CommToolTop from "@/src/components/CommToolTop/page"
import InputFullPercentWithTitle from "@/src/components/InputFullPercentWithTitle/page"
import WarningSign from "@/src/components/WarningSign/page"
import Input50PercentWithTitle from "@/src/components/Input50PercentWithTitle/page"
import Select50PercentWithTitle from "@/src/components/Select50PercentWithTitl/page"
import SelectFullPercentWithTitle from "@/src/components/SelectFullPercentWithTitl/page"
import { useState } from "react"
import { State, City } from "country-state-city"
import { countries, propType, metType, metBrand, sideSizes, flowDetails, roomDet } from "@/src/dbs/formOptions"
import { useRouter } from "next/navigation"

const Step2 = () => {

  const [address, setAddress] = useState()
  const [buildingName, setBuildingName] = useState()
  const [country, setCountry] = useState()
  const [state, setState] = useState()
  const [city, setCity] = useState()
  const [zipCode, setZipCode] = useState()
  const [propertyType, setPropertyType] = useState()
  const [meterType, setMeterType] = useState()
  const [zone, setZone] = useState()
  const [costPerUnit, setCostPerUnit] = useState()
  const [costUnit, setCostUnit] = useState()
  const [meterBrand, setMeterBrand] = useState()
  const [meterModel, setMeterModel] = useState()
  const [lowSideSize, setLowSideSize] = useState()
  const [highSideSize, setHighSideSize] = useState()
  const [flow, setFlow] = useState()
  const [floor, setFloor] = useState()
  const [unit, setUnit] = useState()
  const [roomDetails, setRoomDetails] = useState()
  const [terms, setTerms] = useState(false)

  const router = useRouter()

  const onSubmit = () => {
    if(terms){
      alert(JSON.stringify({
        country: country,
        state: state,
        city: city,
        zip_code: zipCode,
        address: address,
        building_name: buildingName,
        property_type: propertyType,
        meter_type: meterType,
        zone: zone,
        cost_per_unit: costPerUnit,
        cost_unit: costUnit,
        room_details: roomDetails,
        flow_details: flow,
        floor: floor,
        unit: unit,
        meter_brand: meterBrand,
        meter_model: meterModel,
        low_side: lowSideSize,
        high_side: highSideSize,
        terms: terms
      }))
      router.push('/comm-tool/step-3')
    }else{
      alert("Please accept the Terms and Conditions")
    }
  }

  const statesData = (country) => {
    let states = []
    State.getStatesOfCountry(country).forEach(
      state => states.push({displayValue: state.name, value: state.isoCode, country: state.country})
    )
    return states
  }

  const citiesData = (state, country) => {
    let cities = []
    City.getCitiesOfState(country, state).forEach(
      city => cities.push({value: city.name, displayValue: city.name, state: city.stateCode, country: city.countryCode})
    )
    return cities
  }

  return (
    <div className='container-pages h-fit'>
      <CommToolTop title={"Step 2"} back={"/comm-tool"} />
      <h1 className="text-[1.5rem] lg:text-[3.25rem] font-bold text-center text-blue-hard">Enter <strong className="text-purple">Property</strong> and <strong className="text-purple">Meter</strong> Details</h1>
      <div className="w-full flex flex-col md:flex-row mb-[1rem]">
        <div className="w-full mr-[0.5rem]">
          <div className="flex flex-row justify-between">
            <Select50PercentWithTitle 
              name={"Country"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setCountry}
              elements={countries}
            />
            <Select50PercentWithTitle 
              name={"State"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setState}
              elements={country && statesData(country)}
            />
          </div>
          <div className="flex flex-row justify-between">
            <Select50PercentWithTitle 
              name={"City"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setCity}
              elements={state && citiesData(state, country)}
            />
            <Input50PercentWithTitle 
              name={"Zip Code"}
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setZipCode}
            />
          </div>
          <div className="flex flex-row justify-between">
            <Input50PercentWithTitle 
              name={"Address"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setAddress}
            />
            <Input50PercentWithTitle 
              name={"Building Name"}
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setBuildingName}
            />
          </div>
          <SelectFullPercentWithTitle
            name={"Property Type"} 
            placeholder={""} 
            type={"text"} 
            disabled={false} 
            setter={setPropertyType}
            elements={propType}
          />
          <div className="flex flex-row justify-between">
            <Select50PercentWithTitle 
              name={"Meter Type"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setMeterType}
              elements={metType}
            />
            <Input50PercentWithTitle 
              name={"Zone (if applicable)"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setZone}
            />
          </div>
          <div className="flex flex-row justify-between">
            <Input50PercentWithTitle 
              name={"Cost Per Unit"} 
              placeholder={""} 
              type={"number"} 
              disabled={false} 
              setter={setCostPerUnit}
            />
            <Input50PercentWithTitle 
              name={"Unit"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setCostUnit}
            />
          </div>
        </div>
        <div className="w-full md:ml-[0.5rem]">
          <SelectFullPercentWithTitle 
            name={"Room Details"} 
            placeholder={""} 
            type={"text"} 
            disabled={false} 
            setter={setRoomDetails}
            elements={roomDet}
          />
          <SelectFullPercentWithTitle 
            name={"Flow Details"} 
            placeholder={""} 
            type={"text"} 
            disabled={false} 
            setter={setFlow}
            elements={flowDetails}
          />
          <div className="flex flex-row justify-between">
            <Input50PercentWithTitle 
              name={"Floor"} 
              placeholder={""} 
              type={"number"} 
              disabled={false} 
              setter={setFloor}
            />
            <Input50PercentWithTitle 
              name={"Unit (if applicable)"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setUnit}
            />
          </div>
          <SelectFullPercentWithTitle 
            name={"Water Meter Brand"} 
            placeholder={""} 
            type={"text"} 
            disabled={false} 
            setter={setMeterBrand}
            elements={metBrand}
          />
          <InputFullPercentWithTitle 
            name={"Water Meter Model"} 
            placeholder={""} 
            type={"text"} 
            disabled={false} 
            setter={setMeterModel}
          />
          <div className="flex flex-row justify-between">
            <Select50PercentWithTitle 
              name={"Low Side Size"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setLowSideSize}
              elements={sideSizes}
            />
            <Select50PercentWithTitle 
              name={"High Side Size"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setHighSideSize}
              elements={sideSizes}
            />
          </div>
        </div>
      </div>
      <WarningSign head={"BEFORE INSTALLATION"} text={`Keep the provided magnet away from the Water Monkey until time of activation. Remember to take note and picture of your meter readings as accurately in time and value to the moment the Water Monkey was activated, you will be requested to enter them after the on-site installation. The accuracy of time and value of these readings are key to a successful calibration process.`} />
      <div className="w-full flex flex-col md:flex-row justify-between items-center mt-[1rem]">
        <div className="flex flex-row">
          <input 
            type="checkbox" 
            className="cursor-pointer"
            onClick={()=> setTerms(!terms)}
          />
          <p className="ml-[0.5rem] font-light text-[0.85rem] text-dark-grey">I have read and accept the <strong className="font-bold cursor-pointer underline hover:text-purple">Terms & Conditions</strong> and the <strong className="font-bold cursor-pointer underline hover:text-purple">Monitoring Agreement</strong></p>
        </div>
        <button 
            className="mt-[1rem] md:mt-0 w-full md:w-[45%] button-small text-[1rem] h-[2rem]"
            onClick={()=> onSubmit()}
        >
            Submit and move to Step 3
        </button>
      </div>
    </div>
  )
}

export default Step2