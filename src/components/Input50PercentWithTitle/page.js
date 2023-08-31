const Input50PercentWithTitle = ({name, setter, placeholder}) => {
  return (
    <>
        <p className="text-sm font-medium">{name}</p>
        <input className="w-full md:w-1/2 input-small" onChange={(e)=> setter(e.target.value !== undefined ? e.target.value : undefined)} placeholder={placeholder} type="text" />
    </>
  )
}

export default Input50PercentWithTitle