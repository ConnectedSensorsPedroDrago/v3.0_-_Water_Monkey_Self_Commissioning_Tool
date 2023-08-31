const TextArea50PercentWithTitle = ({name, setter, placeholder}) => {
  return (
    <>
        <p className="text-sm font-medium">{name}</p>
        <textarea className="w-full md:w-1/2 input-small resize-none h-20" onChange={(e)=> setter(e.target.value !== undefined ? e.target.value : undefined)} placeholder={placeholder} type="text" />
    </>
  )
}

export default TextArea50PercentWithTitle