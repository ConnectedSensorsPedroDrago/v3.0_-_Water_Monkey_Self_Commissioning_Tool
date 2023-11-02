"use client"

import { createContext, useState } from "react";

export const userContext = createContext()

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState({})
    const [loader, setLoader] = useState(true)
    const [portfolio, setPortfolio] = useState([])
    const [reloadUser, setReloadUser] = useState(true)
    const [userSession, setUserSession] = useState()

    return(
        <userContext.Provider
            value={{
                user,
                setUser,
                loader,
                setLoader,
                portfolio,
                setPortfolio,
                reloadUser,
                setReloadUser,
                userSession,
                setUserSession
            }}
        >
            { children }
        </userContext.Provider>
    )
}