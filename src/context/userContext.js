"use client"

import { createContext, useState } from "react";

export const userContext = createContext()

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState({})
    const [loader, setLoader] = useState(true)
    const [portfolio, setPortfolio] = useState([])

    return(
        <userContext.Provider
            value={{
                user,
                setUser,
                loader,
                setLoader,
                portfolio,
                setPortfolio
            }}
        >
            { children }
        </userContext.Provider>
    )
}