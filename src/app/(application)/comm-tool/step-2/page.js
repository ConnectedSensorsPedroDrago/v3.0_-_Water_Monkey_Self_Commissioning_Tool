"use client"

import CommToolTop from "@/src/components/CommToolTop/page"
import InputFullPercentWithTitle from "@/src/components/InputFullPercentWithTitle/page"
import WarningSign from "@/src/components/WarningSign/page"
import Input50PercentWithTitle from "@/src/components/Input50PercentWithTitle/page"
import { useState } from "react"

const Step2 = () => {

  const [address, setAddress] = useState()
  const [buildingName, setBuildingName] = useState()

  return (
    <div className='container-pages h-fit'>
      <CommToolTop title={"Step 2"} back={"/comm-tool"} />
      <h1 className="text-[1.5rem] lg:text-[3.25rem] font-bold text-center text-blue-hard">Enter <strong className="text-purple">Property</strong> and <strong className="text-purple">Meter</strong> Details</h1>
      <div className="w-full flex flex-col md:flex-row mb-[1rem]">
        <div className="w-full mr-[0.5rem]">
          <InputFullPercentWithTitle 
            name={"Property Address"} 
            placeholder={""} 
            type={"text"} 
            disabled={false} 
            setter={setAddress}
          />
          <div className="flex flex-row justify-between">
            <Input50PercentWithTitle 
              name={"Area"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setBuildingName}
            />
            <Input50PercentWithTitle 
              name={"Country"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setBuildingName}
            />
          </div>
          <InputFullPercentWithTitle 
            name={"Building Name (if applicable)"} 
            placeholder={""} 
            type={"text"} 
            disabled={false} 
            setter={setAddress}
          />
          <InputFullPercentWithTitle 
            name={"Property Type"} 
            placeholder={""} 
            type={"text"} 
            disabled={false} 
            setter={setBuildingName}
          />
          <div className="flex flex-row justify-between">
            <Input50PercentWithTitle 
              name={"Meter Type"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setBuildingName}
            />
            <Input50PercentWithTitle 
              name={"Zone (if applicable)"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setBuildingName}
            />
          </div>
          <div className="flex flex-row justify-between">
            <Input50PercentWithTitle 
              name={"Cost Per Unit"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setBuildingName}
            />
            <Input50PercentWithTitle 
              name={"Unit"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setBuildingName}
            />
          </div>
        </div>
        <div className="w-full ml-[0.5rem]">
          <InputFullPercentWithTitle 
            name={"Room Details"} 
            placeholder={""} 
            type={"text"} 
            disabled={false} 
            setter={setAddress}
          />
          <InputFullPercentWithTitle 
            name={"Flow Details"} 
            placeholder={""} 
            type={"text"} 
            disabled={false} 
            setter={setBuildingName}
          />
          <div className="flex flex-row justify-between">
            <Input50PercentWithTitle 
              name={"Floor"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setBuildingName}
            />
            <Input50PercentWithTitle 
              name={"Unit (if applicable)"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setBuildingName}
            />
          </div>
          <InputFullPercentWithTitle 
            name={"Water Meter Brand"} 
            placeholder={""} 
            type={"text"} 
            disabled={false} 
            setter={setAddress}
          />
          <InputFullPercentWithTitle 
            name={"Water Meter Model"} 
            placeholder={""} 
            type={"text"} 
            disabled={false} 
            setter={setBuildingName}
          />
          <div className="flex flex-row justify-between">
            <Input50PercentWithTitle 
              name={"Low Side Size"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setBuildingName}
            />
            <Input50PercentWithTitle 
              name={"High Side Size"} 
              placeholder={""} 
              type={"text"} 
              disabled={false} 
              setter={setBuildingName}
            />
          </div>
        </div>
      </div>
      <WarningSign head={"BEFORE INSTALLATION"} text={`Keep the provided magnet away from the Water Monkey until time of activation. Remember to take note and picture of your meter readings as accurately in time and value to the moment the Water Monkey was activated, you will be requested to enter them after the on-site installation. The accuracy of time and value of these readings are key to a successful calibration process.`} />
      <div className="w-full flex flex-col md:flex-row justify-between items-center mt-[1rem]">
        <div className="flex flex-row">
          <input type="checkbox" className="cursor-pointer"/>
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