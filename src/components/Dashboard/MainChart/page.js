import Image from "next/image"
import CompoundMeter from '@/public/Dashboard/WaterMonkey/CompoundMeter.svg'
import Chart from 'react-apexcharts'

const MainChart = ({ data }) => {

	var donutChartConfig = {
        series: [ 40, 60 ],
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
                    <p className="text-yellow font-bold text-[5rem] mb-[-1rem]">40%</p>
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
                <p className="text-dark-grey font-thin text-[2.5rem]">{data.water_consumption_sum_day.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2})} L</p>
            </div>
            <div>
                <p className="mb-[-0.5rem] text-dark-grey font-semibold">Consumed Water Cost</p>
                <p className="text-blue-hard font-bold text-[2.5rem]">{data.actual_consumption_sum_day.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2})} L</p>
            </div>
            <div>
                <p className="mb-[-0.5rem] text-dark-grey font-semibold">Leaked Water Cost</p>
                <p className="text-yellow font-bold text-[2.5rem]">262.90 L</p>
            </div>
        </div>

        <div className='flex flex-col w-[18rem] items-start justify-between'>
            <div className='mb-2'>
                <p className="text-[2.5rem] text-dark-grey font-medium">Consumption</p>
                <hr className='mt-[-0.5rem] w-[18rem]'/>
            </div>
            <div>
                <p className="mb-[-0.5rem] text-dark-grey font-semibold">Total Water Cost</p>
                <p className="text-dark-grey font-thin text-[2.5rem]">$ 1766.08</p>
            </div>
            <div>
                <p className="mb-[-0.5rem] text-dark-grey font-semibold">Consumed Water Cost</p>
                <p className="text-blue-hard font-bold text-[2.5rem]">$ 1516.69</p>
            </div>
            <div>
                <p className="mb-[-0.5rem] text-dark-grey font-semibold">Leaked Water Cost</p>
                <p className="text-yellow font-bold text-[2.5rem]">$ 262.90</p>
            </div>
        </div>

        <div className='flex flex-col w-[18rem] items-start justify-between'>
            <div className='mb-2'>
                <p className="text-[2.5rem] text-dark-grey font-medium">Insights</p>
                <hr className='mt-[-0.5rem] w-[18rem]'/>
            </div>
            <div>
                <p className="mb-[-0.5rem] text-dark-grey font-semibold">Total Water Cost</p>
                <p className="text-dark-grey font-thin text-[2.5rem]">$ 1766.08</p>
            </div>
            <div>
                <p className="mb-[-0.5rem] text-dark-grey font-semibold">Consumed Water Cost</p>
                <p className="text-blue-hard font-bold text-[2.5rem]">$ 1516.69</p>
            </div>
            <div>
                <p className="mb-[-0.5rem] text-dark-grey font-semibold">Leaked Water Cost</p>
                <p className="text-yellow font-bold text-[2.5rem]">$ 262.90</p>
            </div>
        </div>
        <div>
            <Image 
                src={CompoundMeter}
                alt="Compound Meter"
            />
        </div>
    </div>
  )
}

export default MainChart