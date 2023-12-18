import Image from "next/image"
import CompoundMeter from '@/public/Dashboard/WaterMonkey/CompoundMeter.svg'
import SingleMeter from '@/public/Dashboard/WaterMonkey/SingleMeter.svg'
import NoMeter from '@/public/Dashboard/WaterMonkey/NoMeter.svg'
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MainChart = ({ mainChartValues, lastValues, reportStart, reportEnd, meterType }) => {

    var donutChartConfig = {
        series: [ (mainChartValues.leak_volume_per_update / mainChartValues.water_consumption_per_update)*100, 100 -((mainChartValues.leak_volume_per_update / mainChartValues.water_consumption_per_update)*100) ],
        labels: ['Leaked Water', 'Consumed Water'],
        chart: {
            type: 'donut',
		},
		responsive: [{
			breakpoint: 580,
			options: {
				chart: {
					width: 220
				},
			}
		}],
		legend: {
			show: false,
		},
		dataLabels: {
			enabled: false
		},
		colors: ['#E8D12A', '#292561']
	};

  return (
    <div className='section-dashboard flex flex-col pr-[0.5rem]'>
        <div className="flex flex-row items-center justify-between">
            <div className="flex items-center justify-center">
                    <Chart type="donut" options={donutChartConfig} series={donutChartConfig.series} width={320} height={320}/>
                <div className="fixed top-1 left-2">
                    <div className="z-10 absolute w-[340px] h-[320px] flex flex-col justify-center items-center">
                        <p className="text-yellow font-bold text-[5rem] mb-[-1.5rem]">{mainChartValues.leak_volume_per_update && mainChartValues.water_consumption_per_update ? ((mainChartValues.leak_volume_per_update / mainChartValues.water_consumption_per_update)*100).toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0}) : "0"}%</p>
                        <p className="text-yellow font-bold text-[1.5rem]">LEAK</p>
                    </div>
                </div>
            </div>

            <div className='flex flex-col w-[19rem] items-start justify-between ml-[3rem]'>
                <div className='mb-2'>
                    <p className="text-[2rem] text-dark-grey font-medium">Water Cost</p>
                    <hr className='mt-[-0.25rem] w-[16rem] bg-gradient-to-r from-dark-grey h-[0.07rem] border-none'/>
                </div>
                <div className="mb-[0.5rem]">
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold text-[0.75rem]">Total Water Cost</p>
                    <p className="text-dark-grey font-thin text-[2rem] tracking-wider">{mainChartValues.water_cost_per_update ? "$ " + mainChartValues.water_cost_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) : "0 L"} </p>
                </div>
                <div className="mb-[0.5rem]">
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold text-[0.75rem]">Consumed Water Cost</p>
                    <p className="text-blue-hard font-bold text-[2rem] tracking-wider">{mainChartValues.actual_cost_per_update ? "$ " + mainChartValues.actual_cost_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) : "0 L"}</p>
                </div>
                <div>
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold text-[0.75rem]">Leaked Water Cost</p>
                    <p className="text-yellow font-bold text-[2rem] tracking-wider">{mainChartValues.leak_cost_per_update ? "$ " + mainChartValues.leak_cost_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) : "0 L"}</p>
                </div>
            </div>

            <div className='flex flex-col w-[19rem] items-start justify-between'>
                <div className='mb-2'>
                    <p className="text-[2rem] text-dark-grey font-medium">Consumption</p>
                    <hr className='mt-[-0.25rem] w-[16rem] bg-gradient-to-r from-dark-grey h-[0.07rem] border-none'/>
                </div>
                <div className="mb-[0.5rem]">
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold text-[0.75rem]">Total Water Consumption</p>
                    <p className="text-dark-grey font-thin text-[2rem] tracking-wider">{mainChartValues.water_consumption_per_update ? mainChartValues.water_consumption_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L"}</p>
                </div>
                <div className="mb-[0.5rem]">
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold text-[0.75rem]">Actual Water Consumed</p>
                    <p className="text-blue-hard font-bold text-[2rem] tracking-wider">{mainChartValues.actual_consumption_per_update ? mainChartValues.actual_consumption_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L"}</p>
                </div>
                <div>
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold text-[0.75rem]">Leaked Water</p>
                    <p className="text-yellow font-bold text-[2rem] tracking-wider">{mainChartValues.leak_volume_per_update ? mainChartValues.leak_volume_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L"}</p>
                </div>
            </div>

            <div className='flex flex-col w-[19rem] items-start justify-between'>
                <div className='mb-2'>
                    <p className="text-[2rem] text-dark-grey font-medium">Insights</p>
                    <hr className='mt-[-0.25rem] w-[16rem] bg-gradient-to-r from-dark-grey h-[0.07rem] border-none'/>
                </div>
                <div className="mb-[0.5rem]">
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold text-[0.75rem]">Avg. Daily Consumption</p>
                    <p className="text-dark-grey font-thin text-[2rem] tracking-wider">{lastValues && lastValues.metric_weekly_average_volume.value ? lastValues.metric_weekly_average_volume.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L"}</p>
                </div>
                <div className="mb-[0.5rem]">
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold text-[0.75rem]">Max. Recorded Daily Consumption</p>
                    <p className="text-blue-hard font-bold text-[2rem] tracking-wider">{lastValues && lastValues.metric_weekly_max_volume.value ? lastValues.metric_weekly_max_volume.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L"}</p>
                </div>
                <div>
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold text-[0.75rem]">Min. Recorded Daily Consumption</p>
                    <p className="text-yellow font-bold text-[2rem] tracking-wider">{lastValues && lastValues.metric_weekly_min_volume.value ? lastValues.metric_weekly_min_volume.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L"}</p>
                </div>
            </div>
            {
                meterType === 0 ?
                <div className="w-[432px] h-[318px] scale-[85%]">
                    <Image 
                        src={CompoundMeter}
                        alt="Compound Meter"
                        width={"432px"}
                        height={"318px"}
                        // className="scale-[85%]"
                    />
                    <div className="fixed top-2 right-2">
                        <div className="z-10  w-[205px] h-[142.5px] fixed flex flex-col justify-between right-[125px] top-[50px]">
                            <div className="flex flex-row w-[215px] items-center justify-between right-[60px]">
                                <p className="text-center w-[80px] font-semibold text-[2rem] text-red-shine">{lastValues.low_flow_percentage.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}%*</p>
                                <p className="text-center w-[80px] font-semibold text-[2rem] text-yellow">{lastValues.high_flow_percentage.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}%*</p>
                            </div>
                            <div className="fixed flex flex-row w-[219.5px] items-center justify-between right-[123px] top-[160px] ">
                                <p className="text-center w-[85px] font-semibold text-white">{lastValues.low_flow_water_meter_reading.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}</p>
                                <p className="text-center w-[85px] font-semibold text-white">{lastValues.high_flow_water_meter_reading.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}</p>
                            </div>
                        </div>

                    </div>
                </div>
                :
                meterType === 1 ?
                <div>
                    <Image 
                        src={SingleMeter}
                        alt="Compound Meter"
                        width={"432px"}
                        height={"318px"}
                        // className="scale-[85%]"
                    />
                    <div className="fixed top-2 right-2">
                        <div className="z-10  w-[200px] h-[142.5px] fixed flex flex-col justify-between right-[160px] top-[68px]">
                            <div className="fixed flex flex-row w-[218px] items-center justify-between right-[70px] top-[186px]">
                                <p className="text-center w-[80px] font-semibold text-white">{lastValues.low_flow_water_meter_reading.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}</p>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <Image 
                    src={NoMeter}
                    alt="Compound Meter"
                    width={"432px"}
                    height={"318px"}
                />
            }
        </div>
        <div className="w-full flex flex-row items-center justify-center">
            <p className="mr-[1rem] text-[0.75rem]">From: <i className="font-thin">{new Date(reportStart.timestamp).toLocaleDateString('en-US')} {new Date(reportStart.timestamp).toLocaleTimeString('en-US')} ({reportStart.timezone.replaceAll('_', ' ')})</i></p>
            <p className=" text-[0.75rem]">To: <i className="font-thin">{new Date(reportEnd.timestamp).toLocaleDateString('en-US')} {new Date(reportEnd.timestamp).toLocaleTimeString('en-US')} ({reportStart.timezone.replaceAll('_', ' ')})</i></p>

        </div>
    </div>
  )
}

export default MainChart