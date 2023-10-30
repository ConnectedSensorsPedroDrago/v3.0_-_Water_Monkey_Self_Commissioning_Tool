"use client"

import CommToolTop from "@/src/components/CommToolTop/page"
import InputFullPercentWithTitle from "@/src/components/InputFullPercentWithTitle/page"
import WarningSign from "@/src/components/WarningSign/page"
import Input50PercentWithTitle from "@/src/components/Input50PercentWithTitle/page"
import Select50PercentWithTitle from "@/src/components/Select50PercentWithTitl/page"
import SelectFullPercentWithTitle from "@/src/components/SelectFullPercentWithTitl/page"
import { useState, useEffect } from "react"
import { State, City } from "country-state-city"
import { countries, propType, metType, metBrand, sideSizes, flowDetails, roomDet, unitOfCost } from "@/src/dbs/formOptions"
import { useRouter } from "next/navigation"
import assignPropertiesToNewWM from "@/src/functions/assignPropertiesToNewWM"
import Loader from "@/src/components/loader/page"
import step2RequestWM from "@/src/functions/step2RequestWM"

const Step2 = ({ params }) => {

  const [error, setError] = useState(false)
  const [loader, setLoader] = useState(true)
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
  
  useEffect(()=> {
    step2RequestWM(params.id)
      .then(data => {
        console.log(data)
        if(data.status === "error"){
          setError(data.message)
        }else if(data.status === "ok"){
          let properties = data.device.properties
          console.log(properties)
          properties.country && setCountry(properties.country)
          properties.state && setState(properties.state)
          properties.city && setCity(properties.city)
          properties.zip_code && setZipCode(properties.zip_code)
          properties.address && setAddress(properties.address)
          properties.building_name && setBuildingName(properties.building_name)
          properties.property_type && setPropertyType(properties.property_type)
          properties.meter_type && setMeterType(properties.meter_type)
          properties.zone && setZone(properties.zone)
          properties.cost_per_unit && setCostPerUnit(properties.cost_per_unit)
          properties.cost_unit && setCostUnit(properties.cost_unit)
          properties.meter_brand && setMeterBrand(properties.meter_brand)
          properties.meter_model && setMeterModel(properties.meter_model)
          properties.low_side && setLowSideSize(properties.low_side_size)
          properties.high_side && setHighSideSize(properties.high_side_size)
          properties.flow && setFlow(properties.flow)
          properties.floor && setFloor(properties.floor)
          properties.unit && setUnit(properties.unit)
          properties.room_details && setRoomDetails(properties.room_details)
          // properties.terms && setTerms(properties.terms)
        }
      })
      .then(()=> setLoader(false))
  }, [])

  const onSubmit = async() => {
    let data = {
        "country": {
          "key": "country",
          "text": "Country",
          "type": "text",
          "value": country,
          "description": "Country"
        },
        "state": {
          "key": "state",
          "text": "State",
          "type": "text",
          "value": state,
          "description": "State"
        },
        "city": {
          "key": "city",
          "text": "City",
          "type": "text",
          "value": city,
          "description": "City"
        },
        "zip_code": {
          "key": "zip_code",
          "text": "Zip Code",
          "type": "text",
          "value": zipCode,
          "description": "Zip Code"
        },
        "address": {
          "key": "address",
          "text": "Address",
          "type": "text",
          "value": address,
          "description": "Address"
        },
        "building_name": {
          "key": "building_name",
          "text": "Building Name",
          "type": "text",
          "value": buildingName,
          "description": "Building Name"
        },
        "property_type": {
          "key": "property_type",
          "text": "Property Type",
          "type": "text",
          "value": propertyType,
          "description": "Property Type"
        },
        "meter_type": {
          "key": "meter_type",
          "text": "Meter Type",
          "type": "text",
          "value": meterType,
          "description": "Meter Type"
        },
        "zone": {
          "key": "zone",
          "text": "Zone",
          "type": "number",
          "value": zone,
          "description": "Zone"
        },
        "cost_per_unit": {
          "key": "cost_per_unit",
          "text": "Cost Per Unit",
          "type": "number",
          "value": costPerUnit,
          "description": "Cost Per Unit"
        },
        "cost_unit": {
          "key": "cost_unit",
          "text": "Unit Cost",
          "type": "text",
          "value": costUnit,
          "description": "Unit Cost"
        },
        "room_details": {
          "key": "room_details",
          "text": "Room Details",
          "type": "text",
          "value": roomDetails,
          "description": "Room Details"
        },
        "flow_details": {
          "key": "flow_details",
          "text": "Flow",
          "type": "text",
          "value": flow,
          "description": "Flow"
        },
        "floor": {
          "key": "floor",
          "text": "Floor",
          "type": "number",
          "value": floor,
          "description": "Floor"
        },
        "unit": {
          "key": "unit",
          "text": "Unit",
          "type": "number",
          "value": unit,
          "description": "Unit"
        },
        "meter_brand": {
          "key": "meter_brand",
          "text": "Meter Brand",
          "type": "text",
          "value": meterBrand,
          "description": "Meter Brand"
        },
        "meter_model": {
          "key": "meter_model",
          "text": "Meter Model",
          "type": "text",
          "value": meterModel,
          "description": "Meter Model"
        },
        "low_side": {
          "key": "low_side",
          "text": "Low Side Size",
          "type": "text",
          "value": lowSideSize,
          "description": "Low Side Size"
        },
        "high_side": {
          "key": "high_side",
          "text": "High Side Size",
          "type": "text",
          "value": highSideSize,
          "description": "High Side Size"
        },
        "terms": {
          "key": "terms",
          "text": "Terms and Conditions and Monitoring Agreement accepted",
          "type": "text",
          "value": terms.toString(),
          "description": "Terms and Conditions and Monitoring Agreement accepted"
        }
    }
    if(!country || !state || !city || !zipCode || !address || !buildingName || !propertyType || !meterType || !costPerUnit || !costUnit || !meterBrand || !meterModel || !lowSideSize || !highSideSize || !flow || !floor || !roomDetails){
      setError("Please complete all the required fields")
    }else{
      if(terms){
        setLoader(true)
        assignPropertiesToNewWM(data, params.id)
          .then(data => {
            console.log(data)
            if(data.status === "ok"){
              router.push(`/comm-tool/step-3/${params.id}`)
            }else if(data.status === "error"){
              setLoader(false)
              setError(data.message)
            }
          })
        setLoader(false)
      }else{
        setError("Please read and accept the Terms and Conditions and the Monitoring Agreement")
      }
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
      {
        loader &&
        <Loader />
      }
      <CommToolTop title={"Step 2"} back={"/comm-tool"} />
      <h1 className="text-[1.5rem] lg:text-[3.25rem] font-bold text-center text-blue-hard">Enter <strong className="text-purple">Property</strong> and <strong className="text-purple">Meter</strong> Details</h1>
      {error &&
        <p className="error-message mb-[1.5rem]">{error}</p>
      }
      <div className="w-full flex flex-col md:flex-row mb-[1rem]">
        <div className="w-full mr-[0.5rem]">
          <div className="flex flex-row justify-between">
            <Select50PercentWithTitle 
              name={"Country"} 
              placeholder={country !== undefined ? country : ""} 
              type={"text"} 
              disabled={false} 
              setter={setCountry}
              elements={countries}
            />
            <Select50PercentWithTitle 
              name={"State"} 
              placeholder={state !== undefined ? state : ""} 
              type={"text"} 
              disabled={false} 
              setter={setState}
              elements={country && statesData(country)}
            />
          </div>
          <div className="flex flex-row justify-between">
            <Select50PercentWithTitle 
              name={"City"} 
              placeholder={city !== undefined ? city : ""} 
              type={"text"} 
              disabled={false} 
              setter={setCity}
              elements={state && citiesData(state, country)}
            />
            <Input50PercentWithTitle 
              name={"Zip Code"}
              placeholder={zipCode !== undefined ? zipCode : ""} 
              type={"text"} 
              disabled={false} 
              setter={setZipCode}
            />
          </div>
          <div className="flex flex-row justify-between">
            <Input50PercentWithTitle 
              name={"Address"} 
              placeholder={address !== undefined ? address : ""} 
              type={"text"} 
              disabled={false} 
              setter={setAddress}
            />
            <Input50PercentWithTitle 
              name={"Building Name"}
              placeholder={buildingName !== undefined ? buildingName : ""} 
              type={"text"} 
              disabled={false} 
              setter={setBuildingName}
            />
          </div>
          <SelectFullPercentWithTitle
            name={"Property Type"} 
            placeholder={propertyType !== undefined ? propertyType : ""} 
            type={"text"} 
            disabled={false} 
            setter={setPropertyType}
            elements={propType}
          />
          <div className="flex flex-row justify-between">
            <Select50PercentWithTitle 
              name={"Meter Type"} 
              placeholder={meterType !== undefined ? meterType : ""} 
              type={"text"} 
              disabled={false} 
              setter={setMeterType}
              elements={metType}
            />
            <Input50PercentWithTitle 
              name={"Zone (if applicable)"} 
              placeholder={zone !== undefined ? zone : ""} 
              type={"text"} 
              disabled={false} 
              setter={setZone}
            />
          </div>
          <div className="flex flex-row justify-between">
            <Input50PercentWithTitle 
              name={"Cost Per Unit"} 
              placeholder={costPerUnit !== undefined ? costPerUnit : ""} 
              type={"number"} 
              disabled={false} 
              setter={setCostPerUnit}
            />
            <Select50PercentWithTitle 
              name={"Unit"} 
              placeholder={unit !== undefined ? unit : ""} 
              type={"text"} 
              disabled={false} 
              setter={setCostUnit}
              elements={unitOfCost}
            />
          </div>
        </div>
        <div className="w-full md:ml-[0.5rem]">
          <SelectFullPercentWithTitle 
            name={"Room Details"} 
            placeholder={roomDetails !== undefined ? roomDetails : ""} 
            type={"text"} 
            disabled={false} 
            setter={setRoomDetails}
            elements={roomDet}
          />
          <SelectFullPercentWithTitle 
            name={"Flow Details"} 
            placeholder={flow !== undefined ? flow : ""} 
            type={"text"} 
            disabled={false} 
            setter={setFlow}
            elements={flowDetails}
          />
          <div className="flex flex-row justify-between">
            <Input50PercentWithTitle 
              name={"Floor"} 
              placeholder={floor !== undefined ? floor : ""} 
              type={"number"} 
              disabled={false} 
              setter={setFloor}
            />
            <Input50PercentWithTitle 
              name={"Unit (if applicable)"} 
              placeholder={unit !== undefined ? unit : ""} 
              type={"text"} 
              disabled={false} 
              setter={setUnit}
            />
          </div>
          <SelectFullPercentWithTitle 
            name={"Water Meter Brand"} 
            placeholder={meterBrand !== undefined ? meterBrand : ""} 
            type={"text"} 
            disabled={false} 
            setter={setMeterBrand}
            elements={metBrand}
          />
          <InputFullPercentWithTitle 
            name={"Water Meter Model"} 
            placeholder={meterModel !== undefined ? meterModel : ""} 
            type={"text"} 
            disabled={false} 
            setter={setMeterModel}
          />
          <div className="flex flex-row justify-between">
            <Select50PercentWithTitle 
              name={"Low Side Size"} 
              placeholder={lowSideSize !== undefined ? lowSideSize : ""} 
              type={"text"} 
              disabled={false} 
              setter={setLowSideSize}
              elements={sideSizes}
            />
            <Select50PercentWithTitle 
              name={"High Side Size"} 
              placeholder={highSideSize !== undefined ? highSideSize : ""} 
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