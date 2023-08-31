const DropDownMenuObjects = ({ elements, setter, name }) => {
  return (
    <div className="flex flex-col justify-center md:items-start md:hidden">
        <p className="font-semibold text-sm mb-2">{name}</p>
        <select 
          className="border-grey border-[0.5px] p-2 rounded w-full text-dark-grey"
          onChange={(e)=> setter(JSON.parse(e.target.value))}
        >
        <option>--</option>
        { elements &&
            elements.map(element => 
            <option
                value={JSON.stringify(element)}
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