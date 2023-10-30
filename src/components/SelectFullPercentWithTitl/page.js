const SelectFullPercentWithTitle = ({name, setter, placeholder, type, disabled, elements}) => {
  return (
    <div className="flex flex-col justify-start w-full">
        <p className="text-sm font-medium">{name}</p>
        <select 
          className={`cursor-pointer w-full input-small ${disabled === true && `disabled:text-dark-grey disabled: disabled:bg-white font-semibold`}`}
          onChange={(e)=> setter(e.target.value !== undefined ? e.target.value : undefined)} 
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

export default SelectFullPercentWithTitle