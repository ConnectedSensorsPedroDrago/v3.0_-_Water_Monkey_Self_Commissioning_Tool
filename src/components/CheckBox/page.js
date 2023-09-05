"use client"

import { useState } from "react"

const CheckBox = ({element, setter, set}) => {

    const [checked, setChecked] = useState(false)

    const handleChange = (e) => {
        if(!checked){
            setter([...set, e.target.value])
            setChecked(true)
        } else {
            let index = set.indexOf(e.target.value)
            set.splice(index, 1)
            setter(set)
            setChecked(false)
        }
    }

  return (
    <div className="flex flex-row items-center justify-start font-light hover:font-semibold hover:text-blue-hard text-sm lg:text-base" >
        <input className="cursor-pointer" type="checkbox" id={element.label} value={element.label} name={element.label} onChange={(e)=> handleChange(e)} />
        <label className="ml-4">{element.name}</label>
    </div>
  )
}

export default CheckBox