"use client"

import CommToolTop from '@/src/components/CommToolTop/page'
import Image from 'next/image'
import DownloadPDF from "@/public/downloadPDF.svg"
import InputFullPercentWithTitle from '@/src/components/InputFullPercentWithTitle/page'
import Link from 'next/link'
// import InstallationGuide from '@/public/pdf/Installation_Guide_Water_Monkey.pdf'

const Step3 = () => {

  return (
    <div className='container-pages h-fit'>
        <CommToolTop 
            title={"Step 3"}
            back={'/comm-tool/step-2'}
        />
        <div>
            <div className='flex flex-row items-center mb-[2rem]'>
                <Link 
                    className='flex flex-col items-center cursor-pointer hover:scale-105 duration-500'
                    href={'@/public/pdf/Installation_Guide_Water_Monkey.pdf'}
                    download="Water Monkey Installation Guide.pdf"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Image
                        alt={"Download PDF"}
                        src={DownloadPDF}
                        className='mr-[1rem] scale-75 md:scale-100'
                    />
                    <p className='underline hover:font-bold text-[0.8rem] text-dark-grey'>Download</p>
                </Link>
                <h1 className="text-[1.5rem] lg:text-[3.25rem] font-bold text-center text-blue-hard">Download the On-site Installation Guide</h1>
            </div>
        </div>
        <h1 className="text-[1.5rem] lg:text-[3.25rem] font-bold text-center text-blue-hard mb-[1.5rem] md:mb-[3rem]">After successful install...</h1>
        <div className='w-full md:w-[90%] flex md:flex-row flex-col items-start justify-center'>
            <div className='w-full flex flex-col'>
                <p className='text-dark-grey font-bold text-[1.2rem] md:text-[1.5rem] mb-[1rem]'>Enter initial meter readings</p>
                <InputFullPercentWithTitle 
                    name={"Date and Time"}
                    type={"datetime-local"}
                    placeholder={""}
                    setter={""}
                />
                <InputFullPercentWithTitle 
                    name={"Low Side Meter Reading"}
                    type={"datetime"}
                    placeholder={""}
                    setter={""}
                />
                <InputFullPercentWithTitle 
                    name={"High Side Meter Reading"}
                    type={"datetime"}
                    placeholder={""}
                    setter={""}
                />
                <InputFullPercentWithTitle 
                    name={"Submit Meter Photo"}
                    type={"file"}
                    placeholder={""}
                    setter={""}
                />
                <button 
                    className="mt-[1rem] md:mt-0 w-full button-small text-[1rem] h-[2.5rem]"
                    onClick={()=> onSubmit()}
                >
                    Submit
                </button>
            </div>
            <div className='w-full flex flex-col md:ml-[1rem] md:mt-0 mt-[2rem]'>
                <p className='text-dark-grey font-bold text-[1.2rem] md:text-[1.5rem] mb-[1rem]'>Enter final meter readings</p>
                <InputFullPercentWithTitle 
                    name={"Date and Time"}
                    type={"datetime-local"}
                    placeholder={""}
                    setter={""}
                    disabled={true}
                />
                <InputFullPercentWithTitle 
                    name={"Low Side Meter Reading"}
                    type={"datetime"}
                    placeholder={""}
                    setter={""}
                    disabled={true}
                />
                <InputFullPercentWithTitle 
                    name={"High Side Meter Reading"}
                    type={"datetime"}
                    placeholder={""}
                    setter={""}
                    disabled={true}
                />
                <InputFullPercentWithTitle 
                    name={"Submit Meter Photo"}
                    type={"file"}
                    placeholder={""}
                    setter={""}
                    disabled={true}
                />
                <button 
                    className="hidden mt-[1rem] md:mt-0 w-full button-small text-[1rem] h-[2.5rem]"
                    onClick={()=> onSubmit()}
                >
                    Submit
                </button>
            </div>
        </div>
    </div>
  )
}

export default Step3