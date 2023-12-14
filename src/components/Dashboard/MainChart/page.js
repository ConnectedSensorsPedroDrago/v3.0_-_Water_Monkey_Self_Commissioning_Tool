import Image from "next/image"
import CompoundMeter from '@/public/Dashboard/WaterMonkey/CompoundMeter.svg'
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MainChart = ({ mainChartValues, lastValues }) => {

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
    <div className='section-dashboard flex flex-row items-center justify-between'>
        <div className="flex items-center justify-center">
                <Chart type="donut" options={donutChartConfig} series={donutChartConfig.series} width={350} height={350}/>
            <div className="fixed top-2 left-2">
                <div className="z-10 absolute w-[355px] h-[350px] flex flex-col justify-center items-center">
                    <p className="text-yellow font-bold text-[5rem] mb-[-1rem]">{((mainChartValues.leak_volume_per_update / mainChartValues.water_consumption_per_update)*100).toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}%</p>
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
                <p className="text-dark-grey font-thin text-[2.25rem] tracking-wider">{mainChartValues.water_cost_per_update ? "$ " + mainChartValues.water_cost_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) : "Not Found"} </p>
            </div>
            <div>
                <p className="mb-[-0.5rem] text-dark-grey font-semibold">Consumed Water Cost</p>
                <p className="text-blue-hard font-bold text-[2.25rem] tracking-wider">{mainChartValues.actual_cost_per_update ? "$ " + mainChartValues.actual_cost_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) : "Not Found"}</p>
            </div>
            <div>
                <p className="mb-[-0.5rem] text-dark-grey font-semibold">Leaked Water Cost</p>
                <p className="text-yellow font-bold text-[2.25rem] tracking-wider">{mainChartValues.leak_cost_per_update ? "$ " + mainChartValues.leak_cost_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) : "Not Found"}</p>
            </div>
        </div>

        <div className='flex flex-col w-[18rem] items-start justify-between'>
            <div className='mb-2'>
                <p className="text-[2.5rem] text-dark-grey font-medium">Consumption</p>
                <hr className='mt-[-0.5rem] w-[18rem]'/>
            </div>
            <div>
                <p className="mb-[-0.5rem] text-dark-grey font-semibold">Total Water Consumption</p>
                <p className="text-dark-grey font-thin text-[2.25rem] tracking-wider">{mainChartValues.water_consumption_per_update ? mainChartValues.water_consumption_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "Not Found"}</p>
            </div>
            <div>
                <p className="mb-[-0.5rem] text-dark-grey font-semibold">Actual Water Consumed</p>
                <p className="text-blue-hard font-bold text-[2.25rem] tracking-wider">{mainChartValues.actual_consumption_per_update ? mainChartValues.actual_consumption_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "Not Found"}</p>
            </div>
            <div>
                <p className="mb-[-0.5rem] text-dark-grey font-semibold">Leaked Water</p>
                <p className="text-yellow font-bold text-[2.25rem] tracking-wider">{mainChartValues.leak_volume_per_update ? mainChartValues.leak_volume_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "Not Found"}</p>
            </div>
        </div>

        <div className='flex flex-col w-[18rem] items-start justify-between'>
            <div className='mb-2'>
                <p className="text-[2.5rem] text-dark-grey font-medium">Insights</p>
                <hr className='mt-[-0.5rem] w-[18rem]'/>
            </div>
            <div>
                <p className="mb-[-0.5rem] text-dark-grey font-semibold">Avg. Daily Consumption</p>
                <p className="text-dark-grey font-thin text-[2.25rem] tracking-wider">{lastValues ? lastValues.metric_weekly_average_volume.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "Not Found"}</p>
            </div>
            <div>
                <p className="mb-[-0.5rem] text-dark-grey font-semibold">Max. Recorded Daily Consumption</p>
                <p className="text-blue-hard font-bold text-[2.25rem] tracking-wider">{lastValues ? lastValues.metric_weekly_max_volume.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "Not Found"}</p>
            </div>
            <div>
                <p className="mb-[-0.5rem] text-dark-grey font-semibold">Min. Recorded Daily Consumption</p>
                <p className="text-yellow font-bold text-[2.25rem] tracking-wider">{lastValues ? lastValues.metric_weekly_min_volume.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "Not Found"}</p>
            </div>
        </div>
        <div>
            <Image 
                src={CompoundMeter}
                alt="Compound Meter"
                width={"432px"}
                height={"318px"}
            />
            <div className="fixed top-2 right-2">
                <div className="z-10  w-[200px] h-[142.5px] fixed flex flex-col justify-between right-[160px] top-[70px]">
                    <div className="flex flex-row w-[215px] items-center justify-between right-[60px]">
                        <p className="text-center w-[80px] font-semibold text-[2rem] text-red-shine">{lastValues.low_flow_percentage.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}%*</p>
                        <p className="text-center w-[80px] font-semibold text-[2rem] text-yellow">{lastValues.high_flow_percentage.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}%*</p>
                    </div>
                    <div className="fixed flex flex-row w-[218px] items-center justify-between right-[148px] top-[189px]">
                        <p className="text-center w-[80px] font-semibold text-white">{lastValues.low_flow_water_meter_reading.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}</p>
                        <p className="text-center w-[80px] font-semibold text-white">{lastValues.high_flow_water_meter_reading.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default MainChart