"use client"

import { createContext, useState } from "react";

export const wmDashbaordContext = createContext()

export const WMDashboardContextProvider = ({ children }) => {
    
    const [timeRangeStart, setTimeRangeStart] = useState()
    const [timeRangeEnd, setTimeRangeEnd] = useState()
    const [runReport, setRunReport] = useState(true)
    const [quickReport, setQuickReport] = useState()
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState()
    const [metric, setMetric] = useState()
    const [reloadChart, setReloadChart] = useState(true)

    return(
        <wmDashbaordContext.Provider
            value={{
                timeRangeStart, 
                setTimeRangeStart,
                timeRangeEnd,
                setTimeRangeEnd,
                runReport,
                setRunReport,
                quickReport,
                setQuickReport,
                loader,
                setLoader,
                error,
                setError,
                metric,
                setMetric,
                reloadChart,
                setReloadChart
            }}
        >
            { children }
        </wmDashbaordContext.Provider>
    )
}