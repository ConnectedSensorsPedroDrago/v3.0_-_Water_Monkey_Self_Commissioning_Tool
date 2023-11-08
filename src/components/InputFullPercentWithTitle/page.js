const InputFullPercentWithTitle = ({name, setter, placeholder, type, disabled}) => {
  return (
    <div className="flex flex-col justify-start w-full">
        <p className={`${disabled ? 'text-grey' : 'text-dark-grey'} text-sm font-medium`}>{name}</p>
        <input 
          className={`w-full input-small ${type === ("file" || "datetime-local") ? `disabled:text-grey` : disabled === true && `disabled:text-grey disabled: disabled:bg-white font-semibold`}`}
          onChange={(e)=> setter(e.target.value !== undefined ? e.target.value : undefined)} 
          placeholder={placeholder} 
          type={type ? type : "text"}
          value={((typeof(placeholder) === 'string') && !(placeholder.startsWith("Add")) && !(placeholder.startsWith("Repeat")) && !(type === "password") && !(name !== "Name") && !(name !== "Surname"))  ? placeholder : undefined}
          disabled={disabled}
        />
    </div>
  )
}

export default InputFullPercentWithTitle