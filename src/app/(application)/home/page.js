"use client"

import { userContext } from "@/src/context/userContext"
import { useContext } from "react"
import Loader from "@/src/components/loader/page"
import Portfolio from "./home"

const Home = () => {

  const { loader } = useContext(userContext)

  return (
    <div className="w-full h-fit">
        { loader ? 
            <Loader />
            :
            <Portfolio />
        }

    </div>
  )
}

export default Home