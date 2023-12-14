import React from 'react'
import { useContext } from 'react'
import { wmDashbaordContext } from '@/src/context/wmDashboardContext'
import { toTimestamp } from '@/src/functions/toTimestamp'

const TimeRangeSelector = () => {

    const { setTimeRangeStart, setTimeRangeEnd, runReport, setRunReport, setQuickReport, setLoader } = useContext(wmDashbaordContext)
    let now = new Date()

  return (
    <div className='bg-green w-full flex flex-row justify-between items-center p-2 rounded'>
        <p className='text-white font-light'>Choose Timerange</p>
        <div className='flex flex-row'>
            <div className='flex flex-row items-center ml-2'>
                <div className='flex flex-row items-center'>
                    <p className='text-white font-light mr-[1rem]'>Quick Report:</p>
                    <button 
                        className='wm-button-quick-report'
                        onClick={()=> {
                            setTimeRangeStart(toTimestamp(now.getMonth()+1 + "/" + now.getDate() + "/" +  now.getFullYear() + " 00:00:00"))
                            setTimeRangeEnd(toTimestamp(now))
                            setQuickReport('day')
                            setLoader(true)
                            setRunReport(!runReport)
                        }}
                    >
                        Today
                    </button>
                    <button 
                        className='wm-button-quick-report'
                        onClick={()=> {
                            let startDay = new Date(toTimestamp(now) - (now.getDay()-1)*86400000)
                            setTimeRangeStart(toTimestamp(startDay.getMonth()+1 + "/" + startDay.getDate() + "/" + startDay.getFullYear() + " 00:00:00"))
                            setTimeRangeEnd(toTimestamp(now))
                            setQuickReport('week')
                            setLoader(true)
                            setRunReport(!runReport)
                        }}
                    >
                        This Week
                    </button>
                    <button 
                        className='wm-button-quick-report'
                        onClick={()=> {
                            setTimeRangeStart(toTimestamp(now.getMonth()+1 + "/1/" +  now.getFullYear() + " 00:00:00"))
                            setTimeRangeEnd(toTimestamp(now))
                            setQuickReport('month')
                            setLoader(true)
                            setRunReport(!runReport)
                        }}
                    >
                        This Month
                    </button>
                    <button 
                        className='wm-button-quick-report'
                        onClick={()=> {
                            setTimeRangeStart(toTimestamp("1/1/" +  now.getFullYear() + " 00:00:00"))
                            setTimeRangeEnd(toTimestamp(now))
                            setQuickReport('year')
                            setLoader(true)
                            setRunReport(!runReport)
                        }}
                    >
                        This Year
                    </button>
                </div>
                <p className='mr-1 text-white font-light'>Start:</p>
                <input 
                    type="datetime-local" 
                    className='rounded cursor-pointer font-light p-[0.1rem] text-dark-grey'
                    onChange={(e)=> setTimeRangeStart(toTimestamp(e.target.value))}
                />
            </div>
            <div className='flex flex-row items-center ml-2'>
                <p className='mr-1 text-white font-light'>End:</p>
                <input 
                    type="datetime-local" 
                    className='rounded cursor-pointer font-light p-[0.1rem] text-dark-grey'
                    onChange={(e)=> setTimeRangeEnd(toTimestamp(e.target.value))}
                />
            </div>
            <button 
                className='ml-2 rounded border-[0.05rem] border-grey bg-white p-[0.25rem] text-sm text-dark-grey hover:text-white hover:bg-blue-hard'
                onClick={()=> {
                    setLoader(true)
                    setRunReport(!runReport)
                    setQuickReport()
                }}
            >
                Run Report
            </button>
        </div>
    </div>
  )
}

export default TimeRangeSelector