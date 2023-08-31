import ButtonSmall from '../buttonSmall/page'

const DropDownMenuTextBig = ({ elements, setter, placeholder, buttonText, buttonAction }) => {
  return (
    <div className="flex flex-row mt-4">
        <select
            className="border-grey border-[0.5px] p-1 rounded w-full h-8 text-sm text-dark-grey mr-2"
            onChange={(e)=> setter(e.target.value)}
        >
        <option value="--">{placeholder}</option>
        {
            elements.map(element =>
                <option
                    value={element.name ? element.name : element.username ? element.username : undefined}
                    key={element.name ? element.name : element.username ? element.username : undefined}
                >
                    {element.name ? element.name : element.username ? element.username : "Undefined Name (do not choose)"}
                </option>
            )
        }
        </select>
        <ButtonSmall text={buttonText} type={"purple"} action={buttonAction}/>
    </div>
  )
}

export default DropDownMenuTextBig