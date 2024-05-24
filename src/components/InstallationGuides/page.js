import YouTubeVideo from '@/src/components/YouTubeVideo/page'
import Link from 'next/link'
import DownloadPDF from "@/public/downloadPDF.svg"
import Image from 'next/image'


const InstallationGuides = ({commStage}) => {
  return (
    <div className={`flex flex-col w-full items-center justify-around mb-[2rem] ${commStage.first.date_time ? 'order-2' : 'order-1'}`}>
        <h1 className="text-[1.5rem] lg:text-[3.25rem] font-bold text-center text-purple">{commStage && commStage.first.date_time ? 'Review the Water Monkey Installation Guides' : 'First, install your Water Monkey following the Installation Guides'}</h1>
        <div className='flex flex-col md:flex-row justify-center items-center w-full mt-[1.5rem] md:mt-[1.5rem]'>
            <div className='flex flex-col items-center w-full justify-center'>
                <h1 className="text-[1rem] lg:text-[1rem] font-bold text-center text-dark-grey mb-[0.5rem]">Watch the YouTube Installation Guide</h1>
                <YouTubeVideo 
                    videoId="aHAi1LEUCRc" 
                />                   
            </div>
            <div className='flex flex-col items-center w-full justify-center mt-[1rem] md:mt-[-3rem]'>
                <h1 className="text-[1rem] lg:text-[1rem] mb-[0.5rem] font-bold text-start md:text-center text-dark-grey">Download the On-site Installation Guide</h1>
                <Link 
                    className='flex flex-col items-center cursor-pointer hover:scale-110 duration-500'
                    href={'https://firebasestorage.googleapis.com/v0/b/wm-readings-storage.appspot.com/o/Installation%20Guide_Water%20Monkey.pdf?alt=media&token=cb7d9760-0a69-4a62-b875-0d129d332faf'}
                    download={'https://firebasestorage.googleapis.com/v0/b/wm-readings-storage.appspot.com/o/Installation%20Guide_Water%20Monkey.pdf?alt=media&token=cb7d9760-0a69-4a62-b875-0d129d332faf'}
                    target="_blank"
                    rel="noreferrer"
                >  
                    <Image
                        alt={"Download PDF"}
                        src={DownloadPDF}
                        className='md:mr-[-1.5rem] md:scale-[100%]'
                    />
                </Link>
            </div>
        </div>
    </div>
  )
}

export default InstallationGuides