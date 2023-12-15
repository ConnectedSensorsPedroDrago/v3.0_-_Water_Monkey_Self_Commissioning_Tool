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
					width: 250
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
    <div className='section-dashboard flex flex-col'>
        <div className="flex flex-row items-center justify-between">
            <div className="flex items-center justify-center">
                    <Chart type="donut" options={donutChartConfig} series={donutChartConfig.series} width={350} height={350}/>
                <div className="fixed top-1 left-2">
                    <div className="z-10 absolute w-[355px] h-[350px] flex flex-col justify-center items-center">
                        <p className="text-yellow font-bold text-[5rem] mb-[-1rem]">{mainChartValues.leak_volume_per_update && mainChartValues.water_consumption_per_update ? ((mainChartValues.leak_volume_per_update / mainChartValues.water_consumption_per_update)*100).toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0}) : "0"}%</p>
                        <p className="text-yellow font-bold text-[1.5rem]">LEAK</p>
                    </div>
                </div>
            </div>

            <div className='flex flex-col w-[18rem] items-start justify-between'>
                <div className='mb-2'>
                    <p className="text-[2.5rem] text-dark-grey font-medium">Water Cost</p>
                    <hr className='mt-[-0.5rem] w-[18rem]'/>
                </div>
                <div>
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold">Total Water Cost</p>
                    <p className="text-dark-grey font-thin text-[2.25rem] tracking-wider">{mainChartValues.water_cost_per_update ? "$ " + mainChartValues.water_cost_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) : "0 L"} </p>
                </div>
                <div>
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold">Consumed Water Cost</p>
                    <p className="text-blue-hard font-bold text-[2.25rem] tracking-wider">{mainChartValues.actual_cost_per_update ? "$ " + mainChartValues.actual_cost_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) : "0 L"}</p>
                </div>
                <div>
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold">Leaked Water Cost</p>
                    <p className="text-yellow font-bold text-[2.25rem] tracking-wider">{mainChartValues.leak_cost_per_update ? "$ " + mainChartValues.leak_cost_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) : "0 L"}</p>
                </div>
            </div>

            <div className='flex flex-col w-[18rem] items-start justify-between'>
                <div className='mb-2'>
                    <p className="text-[2.5rem] text-dark-grey font-medium">Consumption</p>
                    <hr className='mt-[-0.5rem] w-[18rem]'/>
                </div>
                <div>
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold">Total Water Consumption</p>
                    <p className="text-dark-grey font-thin text-[2.25rem] tracking-wider">{mainChartValues.water_consumption_per_update ? mainChartValues.water_consumption_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L"}</p>
                </div>
                <div>
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold">Actual Water Consumed</p>
                    <p className="text-blue-hard font-bold text-[2.25rem] tracking-wider">{mainChartValues.actual_consumption_per_update ? mainChartValues.actual_consumption_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L"}</p>
                </div>
                <div>
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold">Leaked Water</p>
                    <p className="text-yellow font-bold text-[2.25rem] tracking-wider">{mainChartValues.leak_volume_per_update ? mainChartValues.leak_volume_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L"}</p>
                </div>
            </div>

            <div className='flex flex-col w-[18rem] items-start justify-between'>
                <div className='mb-2'>
                    <p className="text-[2.5rem] text-dark-grey font-medium">Insights</p>
                    <hr className='mt-[-0.5rem] w-[18rem]'/>
                </div>
                <div>
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold">Avg. Daily Consumption</p>
                    <p className="text-dark-grey font-thin text-[2.25rem] tracking-wider">{lastValues && lastValues.metric_weekly_average_volume.value ? lastValues.metric_weekly_average_volume.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L"}</p>
                </div>
                <div>
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold">Max. Recorded Daily Consumption</p>
                    <p className="text-blue-hard font-bold text-[2.25rem] tracking-wider">{lastValues && lastValues.metric_weekly_max_volume.value ? lastValues.metric_weekly_max_volume.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L"}</p>
                </div>
                <div>
                    <p className="mb-[-0.5rem] text-dark-grey font-semibold">Min. Recorded Daily Consumption</p>
                    <p className="text-yellow font-bold text-[2.25rem] tracking-wider">{lastValues && lastValues.metric_weekly_min_volume.value ? lastValues.metric_weekly_min_volume.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L"}</p>
                </div>
            </div>
            {
                meterType === 0 ?
                <div>
                    <Image 
                        src={CompoundMeter}
                        alt="Compound Meter"
                        width={"432px"}
                        height={"318px"}
                    />
                    <div className="fixed top-2 right-2">
                        <div className="z-10  w-[200px] h-[142.5px] fixed flex flex-col justify-between right-[160px] top-[68px]">
                            <div className="flex flex-row w-[215px] items-center justify-between right-[60px]">
                                <p className="text-center w-[80px] font-semibold text-[2rem] text-red-shine">{lastValues.low_flow_percentage.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}%*</p>
                                <p className="text-center w-[80px] font-semibold text-[2rem] text-yellow">{lastValues.high_flow_percentage.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}%*</p>
                            </div>
                            <div className="fixed flex flex-row w-[218px] items-center justify-between right-[148px] top-[190px]">
                                <p className="text-center w-[80px] font-semibold text-white">{lastValues.low_flow_water_meter_reading.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}</p>
                                <p className="text-center w-[80px] font-semibold text-white">{lastValues.high_flow_water_meter_reading.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}</p>
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
            <p className="mr-[1rem]">From: <i className="font-thin">{new Date(reportStart.timestamp).toLocaleDateString('en-US')} {new Date(reportStart.timestamp).toLocaleTimeString('en-US')} ({reportStart.timezone.replaceAll('_', ' ')})</i></p>
            <p>To: <i className="font-thin">{new Date(reportEnd.timestamp).toLocaleDateString('en-US')} {new Date(reportEnd.timestamp).toLocaleTimeString('en-US')} ({reportStart.timezone.replaceAll('_', ' ')})</i></p>

        </div>
    </div>
  )
}

export default MainChart