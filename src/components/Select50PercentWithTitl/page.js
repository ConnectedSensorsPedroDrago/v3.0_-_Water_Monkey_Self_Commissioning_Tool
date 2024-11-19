const Select50PercentWithTitle = ({name, setter, placeholder, type, disabled, elements}) => {
  return (
    <div className="flex flex-col justify-start w-[49%]">
        <p className={`${disabled === true && 'text-grey'} text-dark-grey text-sm font-medium`}>{name}</p>
        <select 
          className={`${disabled === false && "cursor-pointer"} w-full bg-white input-small font-normal text-sm text-dark-grey ${disabled === true && `text-grey bg-white font-semibold`}`}
          onChange={(e)=> {
            if(type === 'file'){
              setter(e.target.files[0])
            }else{
              setter(e.target.value !== undefined ? e.target.value : undefined)
            }
          }} 
          placeholder={placeholder} 
          type={type ? type : "text"}
          value={((typeof(placeholder) === "string") && !(placeholder.startsWith("Add")) && !(placeholder.startsWith("Repeat")) && !(type === "password") && !(name !== "Name") && !(name !== "Surname"))  ? placeholder : undefined}
          disabled={disabled}
        >
          <option value={placeholder && placeholder}>{placeholder && placeholder}</option>
          {
            elements && elements.map(
              element =>
                <option key={element.value} value={element.value}>
                  {element.displayValue}
                </option>
            )
          }
        </select>
    </div>
  )
}

export default Select50PercentWithTitle