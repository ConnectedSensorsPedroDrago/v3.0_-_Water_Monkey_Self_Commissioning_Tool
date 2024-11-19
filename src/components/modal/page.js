import React from 'react'
import ButtonSmall from '../buttonSmall/page'

const Modal = ({message, action1, action2}) => {
  return (
    <div className='absolute flex flex-col items-center justify-around mb-20 w-screen h-screen bg-white bg-opacity-50 background-blur z-2000'>
        <div className='w-[95%] h-[15%] md:w-[35%] md:h-[15%] bg-white bg-opacity-100 rounded shadow-lg p-4 flex flex-col items-center justify-around border-dark-grey border-[0.05rem]'>
            <p className='text-modal'>{message}</p>
            <div className='flex flex-row items-center justify-around w-full'>
                <ButtonSmall 
                    text={"Accept"}
                    action={()=> action1()}
                    className='cursor-pointer' 
                />
                <ButtonSmall 
                    type={"purple"} 
                    text={"Cancel"}
                    action={()=> action2()}
                    className='cursor-pointer'
                />
            </div>
        </div>
    </div>
  )
}

export default Modal