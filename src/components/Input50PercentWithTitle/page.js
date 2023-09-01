const Input50PercentWithTitle = ({name, setter, placeholder, type}) => {
  return (
    <div className="flex flex-col justify-start w-full md:w-[49%]">
        <p className="text-sm font-medium">{name}</p>
        <input 
          className={`w-full input-small ${(!(placeholder.startsWith("Add")) && !(placeholder.startsWith("Repeat")) && !(type === "password")) && "text-dark-grey font-semibold"}` }
          onChange={(e)=> setter(e.target.value !== undefined ? e.target.value : undefined)} 
          placeholder={placeholder} 
          type={type ? type : "text"}
          value={(!(placeholder.startsWith("Add")) && !(placeholder.startsWith("Repeat")) && !(type === "password")) ? placeholder : undefined}
        />
    </div>
  )
}

export default Input50PercentWithTitle