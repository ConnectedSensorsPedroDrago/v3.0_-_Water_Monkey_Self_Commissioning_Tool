"use client"

import { userContext } from "@/src/context/userContext"
import { useContext } from "react"
import Loader from "@/src/components/loader/page"
import Portfolio from "./home"
import TermsAndConidtions from "@/src/components/TermsAndConditions/TermsAndConidtions"

const Home = () => {

  const { loader, user } = useContext(userContext)

  return (
    <div className="w-full h-fit">
        { loader ? 
            <Loader />
            :
              user.terms && user.terms === "not accepted" ?
              <TermsAndConidtions />
              :
              <Portfolio />
        }

    </div>
  )
}

export default Home