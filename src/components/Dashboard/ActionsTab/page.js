import Image from "next/image"
import ActionsArrowClosed from '@/public/Dashboard/WaterMonkey/ActionsArrowClosed.svg'
import ActionsArrowOpened from '@/public/Dashboard/WaterMonkey/ActionsArrowOpened.svg'
import SwitchSingleText from "./SwitchSingleText/page"
import SwitchDoubleText from "./SwitchDoubleText/page"
import ExportDashboard from '@/public/Dashboard/WaterMonkey/ExportDashboard.svg'
import ExportCSV from '@/public/Dashboard/WaterMonkey/ExportCSV.svg'
import Recalibrate from '@/public/Dashboard/WaterMonkey/Recalibrate.svg'
import AskForHelp from '@/public/Dashboard/WaterMonkey/AskForHelp.svg'
import DeviceInformation from '@/public/Dashboard/WaterMonkey/DeviceInformation.svg'
import { useState } from "react"
import Link from "next/link"

const ActionsTab = ({ alerts, unit, unitOrCubic, device, consumption, days, metric, setCsvModal, setRecalibrateModal, exportDashbaord }) => {

    const [open, setOpen] = useState(false)
    const [units, setUnits] = useState()
    const [levelOfConsumption, setLevelOfConsumption] = useState()

  return (
    <div className='section-dashboard sticky top-[8.25rem] md:top-[6.25rem] z-20'>
        <div className=' w-full flex flex-row items-center justify-start'>
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
            <div className="flex flex-col md:flex-row items-start justify-around flex-wrap">
                <div className="md:h-[7rem] flex flex-col items-start justify-center pt-2 mt-[1rem] md:mt-0 w-full md:w-fit">
                    <p className="text-sm font-semibold text-blue-hard mb-4 w-full text-center md:text-start">Enable/Disable Error Alerts</p>
                    <div className="flex flex-row items-center justify-around md:justify-end md:h-[3rem] flex-wrap w-full md:w-fit">
                        {
                            alerts.map(alert => 
                                <SwitchSingleText key={alert.name} value={alert}/>
                            )
                        }
                    </div>
                </div>
                <div className="md:h-[7rem] flex flex-col flex-wrap items-start justify-center pt-2 mt-[1rem] md:mt-0 w-full md:w-fit">
                    <p className="text-sm font-semibold text-blue-hard mb-4 w-full text-center md:text-start">Choose Unit</p>
                    <div className="flex flex-row items-center justify-around md:justify-end md:h-[3rem] flex-wrap w-full md:w-fit">
                        <div className="flex flex-row items-center justify-end h-[3rem] md:mr-4">
                            <SwitchDoubleText value={unit} device={device}/>
                        </div>
                        <div className="flex flex-row items-center justify-end h-[3rem]">
                            <SwitchDoubleText value={unitOrCubic.liters} device={device}/>
                        </div>
                    </div>
                </div>
                <div className="md:h-[7rem] flex flex-col flex-wrap items-start justify-center pt-2 mt-[1rem] md:mt-0 w-full md:w-fit">
                    <p className="text-sm font-semibold text-blue-hard mb-4 w-full text-center md:text-start">Other Actions</p>
                    <div className="flex flex-row items-start md:items-center justify-around md:justify-end md:h-[3rem] flex-wrap w-full md:w-fit">
                        <div 
                            className='flex flex-row items-center mr-4 md:mr-4 h-[2rem] mt-2 mb-2 md:mt-0 md:mb-0'
                            onClick={()=> exportDashbaord()}
                        >
                            <Image 
                                src={ExportDashboard}
                                alt="Export Dashboard"
                                className='mr-[0.5rem]'
                            />
                            <p className='text-blue-hard font-light text-[0.75rem] hover:underline cursor-pointer'>Export Dashboard</p>
                        </div>
                        <div 
                            className='flex flex-row items-center mr-4 md:mr-4 h-[2rem] mt-2 mb-2 md:mt-0 md:mb-0'
                            onClick={()=> setCsvModal(true)}
                        >
                            <Image 
                                src={ExportCSV}
                                alt="Export CSV"
                                className='mr-[0.5rem]'
                            />
                            <p className='text-blue-hard font-light text-[0.75rem] hover:underline cursor-pointer'>Export CSV</p>
                        </div>
                        <div 
                            className='flex flex-row items-center mr-4 md:mr-4 h-[2rem] mt-2 mb-2 md:mt-0 md:mb-0'
                            onClick={()=> {
                                setRecalibrateModal(true)
                            }}
                        >
                            <Image 
                                src={Recalibrate}
                                alt="Export CSV"
                                className='mr-[0.5rem]'
                            />
                            <p className='text-blue-hard font-light text-[0.75rem] hover:underline cursor-pointer'>Recalculate</p>
                        </div>
                        <Link
                            href={`/device_details/${device}`}
                        >
                            <div className='flex flex-row items-center mr-4 md:mr-4 h-[2rem] mt-2 mb-2 md:mt-0 md:mb-0'>
                                <Image 
                                    src={DeviceInformation}
                                    alt="Device Information"
                                    className='mr-[0.5rem]'
                                />
                                <p className='text-blue-hard font-light text-[0.75rem] hover:underline cursor-pointer'>Device Info</p>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="h-[7rem] flex flex-col items-start justify-center pt-2 mt-[1rem] md:mt-0 w-full md:w-fit">
                    <p className="text-sm font-semibold text-blue-hard mb-4 w-full text-center md:text-start">Level of Consumption</p>
                    <div className="flex flex-row items-center justify-end h-[3rem] w-full md:w-fit">
                        <div className="flex flex-row items-center justify-center md:justify-start h-full w-full md:w-fit">
                            <p className="text-blue-hard font-light text-[0.75rem]">Number of units:</p>
                            <input 
                                type="number" 
                                className="rounded border-[0.05rem] border-grey ml-2 w-[5rem] mr-2 p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-grey font-light"
                                onChange={(e)=> {
                                    setUnits(e.target.value)
                                    setLevelOfConsumption(consumption && (metric === 'liters' ? (consumption.liters / days / e.target.value) : (consumption.gallons / days / e.target.value)))
                                }}
                            />
                            <div className="flex flex-row">
                                <div className="flex flex-col">
                                    <div className={`h-[1.3rem] w-[5rem] ${(units && levelOfConsumption && ((metric === 'liters' && (Number(levelOfConsumption) >= 800)) || (metric === 'gallons' && Number(levelOfConsumption) >= 211))) ? 'bg-red' : 'bg-[#A1A1A1]'} rounded flex justify-center items-center`}>
                                        <p className="w-full text-center text-white font-semibold text-[0.75rem]">{'>'} {metric === "liters" ? '800' : '211'}</p>
                                    </div>
                                    <div className={`h-[1.3rem] w-[5rem] ${(units && levelOfConsumption && (metric === 'liters' && (Number(levelOfConsumption) < 800 && Number(levelOfConsumption) > 500) || metric === 'gallons' && (Number(levelOfConsumption) < 211 && Number(levelOfConsumption) > 132))) ? 'bg-yellow' : 'bg-[#B8B8B8]'} rounded flex justify-center items-center`}>
                                        <p className="w-full text-center text-white font-semibold text-[0.75rem]"> {'>'}{metric === "liters" ? '500' : '132'}-{metric === "liters" ? '800' : '211'} {metric === "liters" ? 'L' : 'G'}</p>
                                    </div>
                                    <div className={`h-[1.3rem] w-[5rem] ${(units && levelOfConsumption && (metric === 'liters' && Number(levelOfConsumption) < 500 || metric === 'gallons' && Number(levelOfConsumption) < 132)) ? 'bg-green' : 'bg-[#D1D1D1]'} rounded flex justify-center items-center`}>
                                        <p className="w-full text-center text-white font-semibold text-[0.75rem]">{'<'} {metric === "liters" ? '500' : '132'} {metric === "liters" ? 'L' : 'G'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col ml-2">
                                    <p className="text-blue-hard text-[2rem] font-semibold leading-[2rem]">{(consumption && units && levelOfConsumption) ? levelOfConsumption.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0}) : '0'} {metric === "liters" ? 'L' : 'G'}</p>
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