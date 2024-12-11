"use client"

import { createContext, useState } from "react";
import domtoimage from 'dom-to-image';

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
        domtoimage.toJpeg(document.querySelector('.dashboard_to_print'), { quality: 0.95 })
        .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = 'my-image-name.jpeg';
            link.href = dataUrl;
            link.click();
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
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