import Image from 'next/image'
import AddButton from '@/public/addDevice.svg'

const AddNewSmall = ({ name, action }) => {
  return (
    <div 
      className="absolute bottom-4 flex flex-row justify-center items-center hover:scale-105 duration-500 cursor-pointer bg-white"
      onClick={()=>action()}
    >
        <Image
            src={AddButton}
            alt="Add Button"
            className="scale-50"
        />
        <p className="font-semibold text-sm -ml-3">Add new {name}</p>
    </div>
  )
}

export default AddNewSmall