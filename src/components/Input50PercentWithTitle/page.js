"use client"

const Input50PercentWithTitle = ({name, setter, placeholder, type, disabled}) => {
  return (
    <div className="flex flex-col justify-start w-[49%]">
        <p className={`${disabled ? 'text-grey' : 'text-dark-grey'} text-sm font-medium`}>{name}</p>
        <input 
          className={`w-full input-date-reset input-small font-normal text-sm text-grey ${disabled === true && `disabled:text-grey disabled: disabled:bg-white font-semibold`}`}
          onChange={(e)=> setter((type === 'datetime-local' && e.target.value !== undefined) ? e.target.value.replace('T', ' ').replace('-' , '/') : e.target.value !== undefined ? e.target.value : undefined)} 
          placeholder={placeholder} 
          type={type ? type : "text"}
          value={((typeof(placeholder) === "string") && !(placeholder.startsWith("Add")) && !(placeholder.startsWith("Repeat")) && !(type === "password") && !(name !== "Name") && !(name !== "Surname"))  ? placeholder : undefined}
          disabled={disabled}
        />
    </div>
  )
}

export default Input50PercentWithTitle