import React from 'react'

const AddressHeader = ({ address }) => {
  return (
    <div className='section-dashboard z-0'>
        <p className='text-blue-hard font-bold text-[1.5rem] text-center md:text-start'>{address}</p>
    </div>
  )
}

export default AddressHeader