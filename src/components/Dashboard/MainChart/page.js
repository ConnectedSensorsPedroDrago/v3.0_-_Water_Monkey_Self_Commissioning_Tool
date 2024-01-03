import Image from "next/image"
import CompoundMeter from '@/public/Dashboard/WaterMonkey/CompoundMeter.svg'
import SingleMeter from '@/public/Dashboard/WaterMonkey/SingleMeter.svg'
import NoMeter from '@/public/Dashboard/WaterMonkey/NoMeter.svg'
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MainChart = ({ mainChartValues, lastValues, reportStart, reportEnd, meterType, metric, cubic }) => {

    var donutChartConfig = {
        series: [ (mainChartValues.leak_cost_per_update / mainChartValues.water_cost_per_update)*100, 100 -((mainChartValues.leak_cost_per_update / mainChartValues.water_cost_per_update)*100) ],
        labels: ['Leaked Water', 'Consumed Water'],
        chart: {
            type: 'donut',
		},
		responsive: [{
			breakpoint: 380,
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
    <div className='print section-dashboard flex flex-col pr-[0.5rem]'>
        <div className="flex flex-row items-center justify-around lg:justify-around flex-wrap">
            <div className="flex items-center justify-center">
                <Chart type="donut" options={donutChartConfig} series={donutChartConfig.series} width={300} height={300}/>
                <div className="absolute z-10 w-[320px] h-[320px] flex flex-col justify-center items-center">
                    <p className="text-yellow font-bold text-[4rem] mb-[-1.5rem] font-outline">{mainChartValues.leak_cost_per_update && mainChartValues.water_cost_per_update ? ((mainChartValues.leak_cost_per_update / mainChartValues.water_cost_per_update)*100).toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0}) : "0"}%</p>
                    <p className="text-yellow font-bold text-[1.5rem] font-outline">LEAK</p>
                </div>
            </div>  
            <div className='flex flex-col w-[17rem] items-center lg:items-start justify-between ml-[1rem] mt-[1rem] md:mt-0'>
                <div className='mb-2'>
                    <p className="text-[2rem] text-dark-grey font-medium w-full text-center lg:text-start">Water Cost</p>
                    <hr className='mt-[-0.25rem] w-[16rem] bg-gradient-to-r from-dark-grey h-[0.05rem] border-none'/>
                </div>
                <div className="mb-[0.75rem] flex flex-col items-center lg:items-start">
                    <p className="mb-[-0.3rem] text-dark-grey font-semibold text-[0.75rem]">Total Water Cost</p>
                    <p className="text-dark-grey font-thin text-[1.75rem] tracking-wider">
                        {/* {mainChartValues.water_cost_per_update ? "$ " + mainChartValues.water_cost_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) : "$ 0"}  */}
                        {mainChartValues.water_cost_per_update ? "$ " + (mainChartValues.actual_cost_per_update + mainChartValues.leak_cost_per_update).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) : "$ 0"} 
                    </p>
                </div>
                <div className="mb-[0.75rem] flex flex-col items-center lg:items-start">
                    <p className="mb-[-0.3rem] text-dark-grey font-semibold text-[0.75rem]">Consumed Water Cost</p>
                    <p className="text-blue-hard font-bold text-[1.75rem] tracking-wider">{mainChartValues.actual_cost_per_update ? "$ " + mainChartValues.actual_cost_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) : "$ 0"}</p>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                    <p className="mb-[-0.3rem] text-dark-grey font-semibold text-[0.75rem]">Leaked Water Cost</p>
                    <p className="text-yellow font-bold text-[1.75rem] tracking-wider font-outline">{mainChartValues.leak_cost_per_update ? "$ " + mainChartValues.leak_cost_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) : "$ 0"}</p>
                </div>
            </div>

            <div className='flex flex-col w-[17rem] items-center lg:items-start justify-between ml-[1rem] mt-[1rem] md:mt-0'>
                <div className='mb-2'>
                    <p className="text-[2rem] text-dark-grey font-medium w-full text-center lg:text-start">Consumption</p>
                    <hr className='mt-[-0.25rem] w-[16rem] bg-gradient-to-r from-dark-grey h-[0.05rem] border-none'/>
                </div>
                <div className="mb-[0.75rem] flex flex-col items-center lg:items-start">
                    <p className="mb-[-0.3rem] text-dark-grey font-semibold text-[0.75rem]">Total Water Consumption</p>
                    <p className="text-dark-grey font-thin text-[1.75rem] tracking-wider">
                        {/* {metric === "liters" ? 
                            (cubic ?
                                (mainChartValues.water_consumption_per_update ? (mainChartValues.water_consumption_per_update/1000).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " m3": "0 m3") 
                                :
                                (mainChartValues.water_consumption_per_update ? mainChartValues.water_consumption_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L") 
                            )
                            : 
                            (cubic ?
                                mainChartValues.water_consumption_per_update_g ? (mainChartValues.water_consumption_per_update_g*0.133681).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " f3": "0 f3" 
                                :
                                mainChartValues.water_consumption_per_update_g ? mainChartValues.water_consumption_per_update_g.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " G": "0 G" 
                        )} */}
                        {metric === "liters" ? 
                            (cubic ?
                                (mainChartValues.water_consumption_per_update ? ((mainChartValues.actual_consumption_per_update + mainChartValues.leak_volume_per_update)/1000).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " m3": "0 m3") 
                                :
                                (mainChartValues.water_consumption_per_update ? (mainChartValues.actual_consumption_per_update + mainChartValues.leak_volume_per_update).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L") 
                            )
                            : 
                            (cubic ?
                                mainChartValues.water_consumption_per_update_g ? (m(mainChartValues.actual_consumption_per_update_g + mainChartValues.leak_volume_per_update_g)*0.133681).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " f3": "0 f3" 
                                :
                                mainChartValues.water_consumption_per_update_g ? (mainChartValues.actual_consumption_per_update_g + mainChartValues.leak_volume_per_update_g).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " G": "0 G" 
                        )}
                    </p>
                </div>
                <div className="mb-[0.75rem] flex flex-col items-center lg:items-start">
                    <p className="mb-[-0.3rem] text-dark-grey font-semibold text-[0.75rem]">Actual Water Consumed</p>
                    <p className="text-blue-hard font-bold text-[1.75rem] tracking-wider">
                        {metric === "liters" ? 
                            (cubic ?
                                (mainChartValues.actual_consumption_per_update ? (mainChartValues.actual_consumption_per_update/1000).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " m3": "0 m3") 
                                :
                                (mainChartValues.actual_consumption_per_update ? mainChartValues.actual_consumption_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L") 
                            )
                            : 
                            (cubic ?
                                mainChartValues.actual_consumption_per_update_g ? (mainChartValues.actual_consumption_per_update_g*0.133681).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " f3": "0 f3" 
                                :
                                mainChartValues.actual_consumption_per_update_g ? mainChartValues.actual_consumption_per_update_g.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " G": "0 G" 
                        )}
                    </p>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                    <p className="mb-[-0.3rem] text-dark-grey font-semibold text-[0.75rem]">Leaked Water</p>
                    <p className="text-yellow font-bold text-[1.75rem] tracking-wider font-outline">
                        {metric === "liters" ? 
                            (cubic ?
                                (mainChartValues.leak_volume_per_update ? (mainChartValues.leak_volume_per_update/1000).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " m3": "0 m3") 
                                :
                                (mainChartValues.leak_volume_per_update ? mainChartValues.leak_volume_per_update.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L") 
                            )
                            : 
                            (cubic ?
                                mainChartValues.leak_volume_per_update_g ? (mainChartValues.leak_volume_per_update_g*0.133681).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " f3": "0 f3" 
                                :
                                mainChartValues.leak_volume_per_update_g ? mainChartValues.leak_volume_per_update_g.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " G": "0 G" 
                        )}
                    </p>
                </div>
            </div>

            <div className='flex flex-col w-[17rem] items-center lg:items-start justify-between ml-[1rem] mt-[1rem] md:mt-0'>
                <div className='mb-2'>
                    <p className="text-[2rem] text-dark-grey font-medium w-full text-center lg:text-start">Insights</p>
                    <hr className='mt-[-0.25rem] w-[16rem] bg-gradient-to-r from-dark-grey h-[0.05rem] border-none'/>
                </div>
                <div className="mb-[0.75rem] flex flex-col items-center lg:items-start">
                    <p className="mb-[-0.3rem] text-dark-grey font-semibold text-[0.75rem]">Avg. Daily Consumption</p>
                    <p className="text-dark-grey font-thin text-[1.75rem] tracking-wider">
                        {/* {metric === "liters" ? (lastValues && lastValues.metric_average_daily_l.value ? lastValues.metric_average_daily_l.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L") : lastValues && lastValues.metric_average_daily_gal.value ? lastValues.metric_average_daily_gal.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " G": "0 G"} */}
                        {metric === "liters" ? 
                            (cubic ?
                                (lastValues.metric_average_daily_l ? (lastValues.metric_average_daily_l.value/1000).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " m3": "0 m3") 
                                :
                                (lastValues.metric_average_daily_l ? lastValues.metric_average_daily_l.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L") 
                            )
                            : 
                            (cubic ?
                                lastValues.metric_average_daily_gal ? (lastValues.metric_average_daily_gal.value*0.133681).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " f3": "0 f3" 
                                :
                                lastValues.metric_average_daily_gal ? lastValues.metric_average_daily_gal.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " G": "0 G" 
                        )}
                    </p>
                </div>
                <div className="mb-[0.75rem] flex flex-col items-center lg:items-start">
                    <p className="mb-[-0.3rem] text-dark-grey font-semibold text-[0.75rem]">Max. Recorded Daily Consumption</p>
                    <p className="text-blue-hard font-bold text-[1.75rem] tracking-wider">
                        {/* {metric === "liters" ? (lastValues && lastValues.metric_max_daily_l.value ? lastValues.metric_max_daily_l.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L") : lastValues && lastValues.metric_max_daily_gal.value ? lastValues.metric_max_daily_gal.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " G": "0 G"} */}
                        {metric === "liters" ? 
                            (cubic ?
                                (lastValues.metric_max_daily_l ? (lastValues.metric_max_daily_l.value/1000).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " m3": "0 m3") 
                                :
                                (lastValues.metric_max_daily_l ? lastValues.metric_max_daily_l.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L") 
                            )
                            : 
                            (cubic ?
                                lastValues.metric_max_daily_gal ? (lastValues.metric_max_daily_gal.value*0.133681).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " f3": "0 f3" 
                                :
                                lastValues.metric_max_daily_gal ? lastValues.metric_max_daily_gal.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " G": "0 G" 
                        )}
                    </p>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                    <p className="mb-[-0.3rem] text-dark-grey font-semibold text-[0.75rem]">Min. Recorded Daily Consumption</p>
                    <p className="text-yellow font-bold text-[1.75rem] tracking-wider font-outline">
                        {/* {metric === "liters" ? (lastValues && lastValues.metric_min_daily_l.value ? lastValues.metric_min_daily_l.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L") : lastValues && lastValues.metric_min_daily_gal.value ? lastValues.metric_min_daily_gal.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " G": "0 G"} */}
                        {metric === "liters" ? 
                            (cubic ?
                                (lastValues.metric_min_daily_l ? (lastValues.metric_min_daily_l.value/1000).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " m3": "0 m3") 
                                :
                                (lastValues.metric_min_daily_l ? lastValues.metric_min_daily_l.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " L": "0 L") 
                            )
                            : 
                            (cubic ?
                                lastValues.metric_min_daily_gal ? (lastValues.metric_min_daily_gal.value*0.133681).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " f3": "0 f3" 
                                :
                                lastValues.metric_min_daily_gal ? lastValues.metric_min_daily_gal.value.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + " G": "0 G" 
                        )}
                    </p>
                </div>
            </div>
            {
                meterType === 0 ?
                <div className="w-[432px] h-[318px] scale-[85%] flex flex-col justify-center items-center">
                    <Image 
                        src={CompoundMeter}
                        alt="Compound Meter"
                        width={"432px"}
                        height={"318px"}
                        className="w-[432px] h-[318px]"
                    />
                    <div className="absolute self-center z-10 w-[432px] h-[318px] flex flex-col justify-around items-center pr-[11%] md:pr-[10%]">
                        <div className="fixed flex flex-row w-[52%] items-center justify-between top-[20%] md:top-[15%]">
                            <p className={`text-center w-[80px] font-semibold text-[2rem] 
                                ${
                                    lastValues.low_flow_percentage && lastValues.low_flow_percentage.value ? 
                                        (lastValues.low_flow_percentage.value >= 50 && lastValues.low_flow_percentage.value < 75) ? 
                                            'text-[#F38007]' 
                                            : 
                                            (lastValues.low_flow_percentage.value >= 75) ? 
                                                'text-red-shine' 
                                                : 
                                                'text-yellow'
                                    :
                                    'text-yellow'
                                }`}
                            >{lastValues.low_flow_percentage.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}%*</p>
                            <p className={`text-center w-[80px] font-semibold text-[2rem] 
                                ${
                                    lastValues.high_flow_percentage && lastValues.high_flow_percentage.value ? 
                                        (lastValues.high_flow_percentage.value >= 50 && lastValues.high_flow_percentage.value < 75) ? 
                                            'text-[#F38007]' 
                                            : 
                                            (lastValues.high_flow_percentage.value >= 75) ? 
                                                'text-red-shine' 
                                                : 
                                                'text-yellow'
                                    :
                                    'text-yellow'
                                }`}>{lastValues.high_flow_percentage.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}%*</p>
                        </div>
                        <div className="fixed flex flex-row w-[56%] md:w-[51.5%] items-center justify-between top-[52%]">
                            <p className="text-center w-[85px] font-semibold text-white">{lastValues.low_flow_water_meter_reading.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}</p>
                            <p className="text-center w-[85px] font-semibold text-white">{lastValues.high_flow_water_meter_reading.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}</p>
                        </div>
                    </div>
                </div>
                :
                meterType === 1 ?
                <div className="w-[432px] h-[318px] scale-[85%] flex flex-col justify-center items-center">
                    <Image 
                        src={SingleMeter}
                        alt="Compound Meter"
                        width={"432px"}
                        height={"318px"}
                        className="w-[432px] h-[318px]"
                    />
                    <div className="absolute self-center z-10 w-[432px] h-[318px] flex flex-col justify-around items-center">
                            <div className="fixed flex flex-row items-center justify-center w-full top-[50%] md:top-[52.55%]">
                                <p className="text-center w-[80px] font-semibold text-white mr-[11%]">{lastValues.low_flow_water_meter_reading.value.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0})}</p>
                            </div>
                    </div>
                </div>
                :
                <Image 
                    src={NoMeter}
                    alt="Compound Meter"
                    width={"432px"}
                    height={"318px"}
                    className="w-[432px] h-[318px]"
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