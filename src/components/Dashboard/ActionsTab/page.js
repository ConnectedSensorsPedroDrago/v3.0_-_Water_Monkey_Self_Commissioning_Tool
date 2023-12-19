import Image from "next/image"
import ActionsArrowClosed from '@/public/Dashboard/WaterMonkey/ActionsArrowClosed.svg'
import ActionsArrowOpened from '@/public/Dashboard/WaterMonkey/ActionsArrowOpened.svg'
import SwitchSingleText from "./SwitchSingleText/page"
import SwitchDoubleText from "./SwitchDoubleText/page"
import ExportDashboard from '@/public/Dashboard/WaterMonkey/ExportDashboard.svg'
import ExportCSV from '@/public/Dashboard/WaterMonkey/ExportCSV.svg'
import AskForHelp from '@/public/Dashboard/WaterMonkey/AskForHelp.svg'
import { useState } from "react"

const ActionsTab = ({ alerts, unit }) => {

    const [open, setOpen] = useState(false)

  return (
    <div className='section-dashboard z-0'>
        <div className='w-full flex flex-row items-center justify-start'>
            <p className='text-blue-hard font-light text-[0.85rem]'>Actions</p>
            {
                !open ?
                <Image 
                    src={ActionsArrowClosed}
                    alt="Actions Arrow"
                    className="ml-2 cursor-pointer"
                    onClick={()=> setOpen(!open)}
                />
                :
                <Image 
                    src={ActionsArrowOpened}
                    alt="Actions Arrow"
                    className="ml-2 cursor-pointer"
                    onClick={()=> setOpen(!open)}
                />
            }
        </div>
        {
            open &&
            <div className="flex flex-col md:flex-row items-start md:items-center justify-around flex-wrap">
                <div className="md:h-[7rem] flex flex-col items-start justify-center pt-2 mt-[1rem] md:mt-0">
                    <p className="text-sm font-semibold text-blue-hard mb-4">Enable/Disable Error Alerts</p>
                    <div className="flex flex-col md:flex-row items-center justify-end md:h-[3rem]">
                        {
                            alerts.map(alert => 
                                <SwitchSingleText key={alert.name} value={alert}/>
                            )
                        }
                    </div>
                </div>
                <div className="md:h-[7rem] flex flex-col items-start justify-center pt-2 mt-[1rem] md:mt-0">
                    <p className="text-sm font-semibold text-blue-hard mb-4">Choose Unit</p>
                    <div className="flex flex-row items-center justify-end h-[3rem]">
                        <SwitchDoubleText value={unit}/>
                    </div>
                </div>
                <div className="md:h-[7rem] flex flex-col items-start justify-center pt-2 mt-[1rem] md:mt-0">
                    <p className="text-sm font-semibold text-blue-hard mb-4">Other Actions</p>
                    <div className="flex flex-col md:flex-row items-center justify-end md:h-[3rem] flex-wrap">
                        <div className='flex flex-row items-center md:mr-4 h-[2rem]'>
                            <Image 
                                src={ExportDashboard}
                                alt="Export Dashboard"
                                className='mr-[0.5rem]'
                            />
                            <p className='text-blue-hard font-light text-[0.75rem] hover:underline cursor-pointer'>Export Dashboard</p>
                        </div>
                        <div className='flex flex-row items-center md:mr-4 h-[2rem]'>
                            <Image 
                                src={ExportCSV}
                                alt="Export CSV"
                                className='mr-[0.5rem]'
                            />
                            <p className='text-blue-hard font-light text-[0.75rem] hover:underline cursor-pointer'>Export CSV Data</p>
                        </div>
                        <div className='flex flex-row items-center md:mr-4 h-[2rem]'>
                            <Image 
                                src={AskForHelp}
                                alt="Ask For Help"
                                className='mr-[0.5rem]'
                            />
                            <p className='text-blue-hard font-light text-[0.75rem] hover:underline cursor-pointer'>Ask For Help</p>
                        </div>
                    </div>
                </div>
                <div className="h-[7rem] flex flex-col items-start justify-center pt-2 mt-[1rem] md:mt-0">
                    <p className="text-sm font-semibold text-blue-hard mb-4">Level of Consumption</p>
                    <div className="flex flex-row items-center justify-end h-[3rem]">
                        <div className="flex flex-row items-center h-full">
                            <p className="text-blue-hard font-light text-[0.75rem]">Number of units:</p>
                            <input 
                                type="number" 
                                className="rounded border-[0.05rem] border-grey ml-2 w-[5rem] mr-2"
                            />
                            <div className="flex flex-row">
                                <div className="flex flex-col">
                                    <div className="h-[1.3rem] w-[5rem] bg-[#A1A1A1] rounded flex justify-center items-center">
                                        <p className="w-full text-center text-white font-semibold text-[0.75rem]">{'>'} 800 L</p>
                                    </div>
                                    <div className="h-[1.3rem] w-[5rem] bg-[#B8B8B8] rounded flex justify-center items-center">
                                        <p className="w-full text-center text-white font-semibold text-[0.75rem]">500-800 L</p>
                                    </div>
                                    <div className="h-[1.3rem] w-[5rem] bg-[#D1D1D1] rounded flex justify-center items-center">
                                        <p className="w-full text-center text-white font-semibold text-[0.75rem]">{'<'} 500 L</p>
                                    </div>
                                </div>
                                <div className="flex flex-col ml-2">
                                    <p className="text-blue-hard text-[2rem] font-semibold leading-[2rem]">0 L</p>
                                    <p className="text-blue-hard text-sm font-semibold leading-[1rem]">/ Unit</p>
                                    <p className="text-blue-hard text-sm font-semibold leading-[1rem]">/ Day</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    </div>
  )
}

export default ActionsTab