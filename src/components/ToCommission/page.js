const ToCommission = ({device}) => {
  return (
    <div key={device.id} onClick={()=> router.push(`/comm-tool/step-3/${device.label}`)} className="ml-[0.5rem] hover:scale-125 duration-500 w-[12rem] h-[12rem] rounded-md bg-blue border-grey border-[0.05rem] p-[0.75rem] flex flex-col justify-between items-center cursor-pointer">
        <p className="w-full text-center text-white font-semibold text-[0.8rem]">Pending finish setting up</p>
        <p className="w-full text-center text-yellow font-semibold text-[1rem]">{device.properties.address}</p>
        <div>
        <p className="w-full text-center text-white font-semibold text-[0.8rem]">Status</p>
        <p className="w-full text-center text-white font-thin text-[1rem]">{device.properties.commission_stage.stage === "none" ? "Pending first meter reading" : device.properties.commission_stage.stage === "first reading" ? "Pending second meter reading" : device.properties.commission_stage.stage === "second reading" && "Pending final confirmation"}</p>
        </div>
    </div>
  )
}

export default ToCommission