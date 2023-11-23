import React from 'react'
import { useContext } from 'react'
import { wmDashbaordContext } from '@/src/context/wmDashboardContext'
import { toTimestamp } from '@/src/functions/toTimestamp'

const TimeRangeSelector = () => {

    const { setTimeRangeStart, setTimeRangeEnd, runReport, setRunReport } = useContext(wmDashbaordContext)

  return (
    <div className='bg-green w-full flex flex-row justify-between items-center p-2 rounded'>
        <p className='text-white font-light'>Choose Timerange</p>
        <div className='flex flex-row'>
            <div className='flex flex-row items-center ml-2'>
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
                onClick={()=> setRunReport(!runReport)}
            >
                Run Report
            </button>
        </div>
    </div>
  )
}

export default TimeRangeSelector