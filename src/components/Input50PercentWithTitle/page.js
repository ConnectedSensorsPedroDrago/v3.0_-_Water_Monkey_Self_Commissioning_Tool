const Input50PercentWithTitle = ({name, setter, placeholder, type, disabled}) => {
  console.log(placeholder)
  return (
    <div className="flex flex-col justify-start w-full md:w-[49%]">
        <p className="text-sm font-medium">{name}</p>
        <input 
          className={`w-full input-small ${disabled === true && `disabled:text-dark-grey disabled: disabled:bg-white font-semibold`}`}
          onChange={(e)=> setter(e.target.value !== undefined ? e.target.value : undefined)} 
          placeholder={placeholder} 
          type={type ? type : "text"}
          value={((typeof(placeholder) === "string") && !(placeholder.startsWith("Add")) && !(placeholder.startsWith("Repeat")) && !(type === "password") && !(name !== "Name") && !(name !== "Surname"))  ? placeholder : undefined}
          disabled={disabled}
        />
    </div>
  )
}

export default Input50PercentWithTitle