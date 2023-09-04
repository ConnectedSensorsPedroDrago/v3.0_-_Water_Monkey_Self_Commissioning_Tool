const DropDownMenuObjects = ({ elements, setter, action, name }) => {
  return (
    <div className="flex flex-col justify-center md:items-start md:hidden mb-8">
        <p className="font-semibold text-sm mb-2">{name}</p>
        <select 
          className="border-grey border-[0.5px] p-2 rounded w-full text-dark-grey"
          onChange={(e)=> action(e.target.value)}
        >
        <option></option>
        { elements &&
            elements.map(element => 
            <option
                value={element.id}
                key={element.id}
            >
                {element.name ? element.name : element.username ? element.username : "Undefined"}
            </option>
            )
        }
        </select>
    </div>
  )
}

export default DropDownMenuObjects