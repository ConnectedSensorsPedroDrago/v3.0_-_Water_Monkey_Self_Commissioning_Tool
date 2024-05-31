import Input50PercentWithTitle from '@/src/components/Input50PercentWithTitle/page'
import Select50PercentWithTitle from '@/src/components/Select50PercentWithTitl/page'
import InputFullPercentWithTitle from '@/src/components/InputFullPercentWithTitle/page'
import ButtonSmall from '@/src/components/buttonSmall/page'
import EditButton from '@/public/editButton.svg'
import { unitOfCost } from '@/src/dbs/formOptions'
import successTick from '@/public/successTick.svg'
import Image from 'next/image'

const ReadingsInputs = ({commStage, setCommStage, setDateFirst, setLowSideFirst, setLowSideFirstUnit, setHighSideFirst, setHighSideFirstUnit, setPicFirst, onSubmitFirst, dateFirst, setDateSecond, setLowSideSecond, setLowSideSecondUnit, setHighSideSecond, setPicSecond, onSubmitSecond, meterType, resetReadings, setHighSideSecondUnit, dateSecond}) => {
  
    console.log(dateSecond)
  
    return (
    <div className={`flex flex-col w-full items-center justify-around mb-[4rem] ${commStage.first.date_time ? 'order-1' : 'order-2'}`}>
        <h1 className="text-[1.5rem] lg:text-[3.25rem] font-bold text-center text-purple mb-[1.5rem] md:mb-[1.5rem]">{commStage && commStage.first.date_time ? 'With your Water Monkey already installed, now its time to take the readings' : 'After successful install...'}</h1>
        {
            commStage && commStage.stage === 'failed' &&
            <div className=' mb-[2rem] w-full flex items-center justify-center'>
                <ButtonSmall
                    text={"Reset readings"}
                    type={"purple"}
                    action={()=> resetReadings()}
                />
            </div>
        }
        <div className='w-full md:w-[90%] flex md:flex-row flex-col items-start justify-center'>
            <div className='w-full flex flex-col'>
                <div className='flex flex-row items-start justify-between w-full'>
                    <p className={`${(commStage && (commStage.first.date_time !== undefined)) ? `text-grey` : `text-dark-grey`} font-bold text-[1.2rem] md:text-[1.5rem] mb-[1rem]`}>Enter initial meter readings</p>
                    {
                        commStage && commStage.stage === "first reading" &&
                        <Image
                            src={EditButton}
                            alt="Edit readings"
                            className='fill-blue-hard scale-[80%] cursor-pointer'
                            onClick={()=> setCommStage({"stage": "none", "first": {}, "second": {}})}
                        />
                    }
                </div>
                {   commStage && !commStage.first.date_time ?
                    <>
                        <InputFullPercentWithTitle 
                            name={"Date and Time"}
                            type={"datetime-local"}
                            placeholder={(commStage && commStage.first.date_time) ? commStage.first.date_time : ""}
                            setter={setDateFirst}
                            disabled={commStage && commStage.first.date_time ? true : false}
                        />
                        <div className='flex flex-row justify-between items-center'>
                            <Input50PercentWithTitle 
                                name={meterType === "Single" ? "Meter Reading" : "Low Side Meter Reading"}
                                type={"number"}
                                placeholder={commStage && commStage.first.low ? commStage.first.low : ""}
                                setter={setLowSideFirst}
                                disabled={commStage && commStage.first.date_time ? true : false}
                            />
                            <Select50PercentWithTitle 
                                name={"Reading Unit"}
                                type={"number"}
                                elements={unitOfCost}
                                placeholder={commStage && commStage.first.low_unit ? commStage.first.low_unit : ""}
                                setter={setLowSideFirstUnit}
                                disabled={commStage && commStage.first.date_time ? true : false}
                            />
                        </div>
                        {
                            meterType === "Compound" &&
                            <div className='flex flex-row justify-between items-center'>
                                <Input50PercentWithTitle 
                                    name={"High Side Meter Reading"}
                                    type={"number"}
                                    placeholder={commStage && commStage.first.high ? commStage.first.high : ""}
                                    setter={setHighSideFirst}
                                    disabled={commStage && commStage.first.date_time ? true : false}
                                />
                                <Select50PercentWithTitle 
                                    name={"Reading Unit"}
                                    type={"select"}
                                    elements={unitOfCost}
                                    placeholder={commStage && commStage.first.high_unit ? commStage.first.high_unit : ""}
                                    setter={setHighSideFirstUnit}
                                    disabled={commStage && commStage.first.date_time ? true : false}
                                />
                            </div>
                        }
                        <InputFullPercentWithTitle 
                            name={"Submit Meter Photo"}
                            type={"file"}
                            placeholder={"Select File"}
                            setter={setPicFirst}
                            disabled={commStage && commStage.first.date_time ? true : false}
                        />
                    
                        <button 
                            className=" md:mt-0 w-full button-small text-[1rem] h-[2.5rem]"
                            onClick={()=> onSubmitFirst()}
                        >
                            Submit
                        </button>
                    </>
                    :
                    <div className='w-full border-grey border-[0.05rem] bg-light-yellow rounded p-3 min-h-[12.35rem]'>
                        <div className='w-full flex items-center justify-start'>
                            <Image 
                                src={successTick}
                                alt="Success Tick"
                                className='scale-[75%]'
                            />
                            <div className='w-full flex flex-col md:flex-row justify-start items-center'>
                                <p className='ml-[0.5rem] font-semibold text-[1rem] text-dark-grey'>Readings successfully submitted at:</p>
                                <p className='w-fullxs ml-[0.5rem] font-normal text-[1rem] text-start text-dark-grey'>{dateFirst && new Date(dateFirst.utc_time).toLocaleString('en-US', {timeZone: dateFirst.timezone}) + ` (${dateFirst.timezone.replaceAll('_', ' ')} time)`}</p>
                            </div>
                        </div>
                        <div className='w-full flex flex-col justify-between mt-[1rem] mb-[0.5rem]'>
                            <p className='w-fullxs ml-[1.5rem] font-normal text-[0.9rem] text-dark-grey'><b>Low Side Meter Reading:</b> {commStage && commStage.first.date_time && Number(commStage.first.low).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} {commStage && commStage.first.date_time && commStage.first.low_unit}</p>
                        </div>
                        {
                            commStage && commStage.first.high &&
                            <div className='w-full flex flex-col justify-between mb-[0.5rem]'>
                                <p className='w-fullxs ml-[1.5rem] font-normal text-[0.9rem] text-dark-grey'><b>High Side Meter Reading:</b> {commStage && commStage.first.date_time && Number(commStage.first.high).toLocaleString('en-US',  {minimumFractionDigits: 2, maximumFractionDigits: 2})} {commStage && commStage.first.date_time && commStage.first.high_unit}</p>
                            </div>
                        }
                            <div className='w-full flex flex-col justify-between'>
                                <p className='w-fullxs ml-[1.5rem] font-normal text-[0.9rem] text-dark-grey'><b>Picture:</b> <a target="_blank" href={commStage && commStage.first.date_time && commStage.first.pic}>Click here</a></p>
                            </div>
                        <p className='text-dark-grey font-light text-[1rem] mt-[1rem]'>Please remember to take your second readings as close to 6 hour gaps after these first readings and after having used at least 10m3 (or it's equivalent) of water.</p>
                    </div>
                }
            </div>
            <div className='w-full flex flex-col md:ml-[1rem] md:mt-0 mt-[2rem]'>
                <div className='flex flex-row items-start justify-between w-full'>
                    <p className={`${commStage && !commStage.second.date_time && commStage.first.date_time ? `text-dark-grey` : `text-grey`} font-bold text-[1.2rem] md:text-[1.5rem] mb-[1rem]`}>Enter final meter readings</p>
                    {
                        commStage && commStage.stage === "second reading" &&
                        <Image
                            src={EditButton}
                            alt="Edit readings"
                            className='fill-blue-hard scale-[80%] cursor-pointer hover:fill-grey'
                            onClick={()=> setCommStage({"stage": "first reading", "first": commStage.first, "second": {}})}
                        />
                    }
                </div>
                {   commStage && !commStage.second.date_time ?
                    <>
                        <InputFullPercentWithTitle 
                            name={"Date and Time"}
                            type={"datetime-local"}
                            placeholder={commStage && commStage.second.date_time ? commStage.second.date_time : ""}
                            setter={setDateSecond}
                            disabled={commStage && !commStage.second.date_time && commStage.first.date_time ? false : true}
                        />
                        <div className='flex flex-row justify-between items-center'>
                            <Input50PercentWithTitle 
                                name={meterType === "Single" ? "Meter Reading" : "Low Side Meter Reading"}
                                type={"number"}
                                placeholder={commStage && commStage.second.low ? commStage.second.low : ""}
                                setter={setLowSideSecond}
                                disabled={commStage && !commStage.second.date_time && commStage.first.date_time ? false : true}
                            />
                            <Select50PercentWithTitle 
                                    name={"Reading Unit"}
                                    type={"select"}
                                    elements={unitOfCost}
                                    placeholder={commStage && commStage.second.low_unit ? commStage.second.low_unit : ""}
                                    setter={setLowSideSecondUnit}
                                    disabled={commStage && !commStage.second.date_time && commStage.first.date_time ? false : true}
                            />
                        </div>
                        {
                            meterType === "Compound" &&
                            <div className='flex flex-row justify-between items-center'>
                                <Input50PercentWithTitle 
                                    name={"High Side Meter Reading"}
                                    type={"number"}
                                    placeholder={commStage && commStage.second.high ? commStage.second.high : ""}
                                    setter={setHighSideSecond}
                                    disabled={commStage && !commStage.second.date_time && commStage.first.date_time ? false : true}
                                />
                                <Select50PercentWithTitle 
                                    name={"Reading Unit"}
                                    type={"select"}
                                    elements={unitOfCost}
                                    placeholder={commStage && commStage.second.high_unit ? commStage.second.high_unit : ""}
                                    setter={setHighSideSecondUnit}
                                    disabled={commStage && !commStage.second.date_time && commStage.first.date_time ? false : true}
                                />
                            </div>
                        }
                        <InputFullPercentWithTitle 
                            name={"Submit Meter Photo"}
                            type={"file"}
                            placeholder={"Select File"}
                            setter={setPicSecond}
                            disabled={commStage && !commStage.second.date_time && commStage.first.date_time ? false : true}
                        />
                        {
                            commStage && !commStage.second.date_time && commStage.first.date_time &&
                            <button 
                                className="md:mt-0 w-full button-small text-[1rem] h-[2.5rem]"
                                onClick={()=> onSubmitSecond()}
                            >
                                Submit
                            </button>
                        }
                    </>
                    :
                    commStage && commStage.second.date_time &&
                    <div className='w-full border-grey border-[0.05rem] bg-light-yellow rounded p-3 min-h-[12.35rem]'>
                        <div className='w-full flex items-center justify-start'>
                            <Image 
                                src={successTick}
                                alt="Success Tick"
                                className='scale-[75%]'
                            />
                            <div className='w-full flex flex-col md:flex-row justify-start items-center'>
                                <p className='ml-[0.5rem] font-semibold text-[1rem] text-dark-grey'>Readings successfully submitted at:</p>
                                <p className='w-fullxs ml-[0.5rem] font-normal text-[1rem] text-start text-dark-grey'>{dateSecond && new Date(dateSecond.utc_time).toLocaleString('en-US', {timeZone: dateSecond.timezone}) + ` (${dateSecond.timezone.replaceAll('_', ' ')} time)`}</p>
                            </div>
                        </div>
                        <div className='w-full flex flex-col justify-between ml-[0rem] mt-[1rem]'>
                            <p className='w-fullxs ml-[1.5rem] font-normal text-[0.9rem] text-dark-grey mb-[0.5rem]'><b>Low Side Meter Reading:</b> {commStage && commStage.second.date_time && Number(commStage.second.low).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} {commStage && commStage.second.date_time && commStage.second.low_unit}</p>
                        </div>
                        {
                            commStage && commStage.second.high &&
                            <div className='w-full flex flex-col justify-between ml-[0rem]'>
                                <p className='w-fullxs ml-[1.5rem] font-normal text-[0.9rem] text-dark-grey mb-[0.5rem]'><b>High Side Meter Reading:</b> {commStage && commStage.second.date_time && Number(commStage.second.high).toLocaleString('en-US',  {minimumFractionDigits: 2, maximumFractionDigits: 2})} {commStage && commStage.second.date_time && commStage.second.high_unit}</p>
                            </div>
                        }
                            <div className='w-full flex flex-col justify-between ml-[0rem]'>
                                <p className='w-fullxs ml-[1.5rem] font-normal text-[0.9rem] text-dark-grey'><b>Picture:</b> <a target="_blank" href={commStage && commStage.second.date_time && commStage.second.pic}>Click here</a></p>
                            </div>
                        <p className='text-dark-grey font-light text-[1rem] mt-[1rem]'>Your readings are complete! You will be contacted by one of our representatives once the calibration process is finished.</p>
                    </div>
                }
            </div>
        </div>
    </div>
  )
}

export default ReadingsInputs