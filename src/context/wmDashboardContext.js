"use client"

import { createContext, useState } from "react";
import html2canvas from "html2canvas";

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

    const exportDashbaord = () => {
      let dashboard = document.querySelector('.print-dashboard')
      console.log(dashboard)
      const options = {
        ignoreElements: element => {
            const elementClass = element.className
            if(elementClass === "print"){
                return true;
            }
            return false;
        }
      }
      html2canvas(dashboard, options)
          .then(canvas => {
              console.log(canvas)
              let link = document.createElement('a');
              link.download = `Water Monkey Report - Connected Sensors`
              link.href = canvas.toDataURL()
              link.click();
      });
    }

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
                setReloadChart,
                exportDashbaord
            }}
        >
            { children }
        </wmDashbaordContext.Provider>
    )
}