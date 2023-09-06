//Type refers to the coloring of the button, can be "purple" for it to have purple background and white text and those inverted with purple border when hovered, or any other term for the inverse case

const ButtonSmall = ({text, type, action}) => {
  return (
    <button 
        className={type === "purple" ? `w-1/2 md:w-[140px] lg:w-[200px] button-small` : `w-1/2 md:w-[140px] lg:w-[200px] button-small-delete md:ml-0`}
        onClick={()=> action()}
    >
        {text}
    </button>
  )
}

export default ButtonSmall