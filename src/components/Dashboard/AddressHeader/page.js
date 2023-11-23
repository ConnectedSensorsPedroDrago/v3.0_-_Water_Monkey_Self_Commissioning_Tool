import React from 'react'

const AddressHeader = ({ address }) => {
  return (
    <div className='section-dashboard'>
        <p className='text-blue-hard font-bold text-[2rem]'>{address}</p>
    </div>
  )
}

export default AddressHeader