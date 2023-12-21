"use client"

import { useState } from "react";
import  { Chart, Line } from "react-chartjs-2"
import 'chartjs-adapter-date-fns';
import zoomPlugin, { resetZoom } from 'chartjs-plugin-zoom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    TimeScale,
    Legend,
    Filler,
    Tooltip,
    defaults
} from 'chart.js'

const LowerChartConsumption = ({ chartWeekendsStart, chartWeekendsEnd, chartDateNightStart, chartDateNightEnd, chartData, meterType }) => {

    const [showLowerChart, setShowLowerChart] = useState(false)

    //Define font of charts
    defaults.font.family = "Fira Sans"
    defaults.font.size = 9
    defaults.font.weight = 200

    //Weekend Highlighter
    const weekend_highlighter = {
        id: 'weekend_highlighter',
        beforeDatasetsDraw(chart, args, pluginOptions){
            const { ctx, chartArea: {top, bottom, left, right, width, height}, scales: {x, y} } = chart;
            if(pluginOptions.startDate != undefined){
                for(let i = 0; i < pluginOptions.startDate.length; i++){
                    const startDate = new Date(pluginOptions.startDate[i]).setHours(0, 0, 0, 0);
                    const endDate = new Date(pluginOptions.endDate[i]).setHours(23, 59, 59, 999);
                    ctx.fillStyle = 'rgba(255, 133, 0, 0.1)'
                    ctx.fillRect(x.getPixelForValue(startDate), top, x.getPixelForValue(endDate) - x.getPixelForValue(startDate), height)
                }
            }
        }
    }

    // Day/Night Highligther
    const day_night_highlighter = {
        id: 'day_night_highlighter',
        beforeDatasetsDraw(chart, args, pluginOptions){
            const { ctx, chartArea: {top, bottom, left, right, width, height}, scales: {x, y} } = chart;
            if(pluginOptions.startDate != undefined){
                for(let i = 0; i < pluginOptions.startDate.length; i++){
                    const startDate = new Date(pluginOptions.startDate[i]).setHours(23, 59, 59, 999);
                    const endDate = new Date(pluginOptions.endDate[i]).setHours(6, 0, 0, 0);
                    ctx.fillStyle = 'rgba(0, 43, 255, 0.1)'
                    ctx.fillRect(x.getPixelForValue(startDate), top, x.getPixelForValue(endDate) - x.getPixelForValue(startDate), height)
                }
            }
        }
    }

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        weekend_highlighter,
        day_night_highlighter,
        Tooltip,
        TimeScale,
        Legend,
        Filler,
        zoomPlugin
    )

    let metric = 'liters'

    // Weekend Highligther

    let data = {
        datasets: [
            {
                label: 'Previous Period Consumption',
                data: chartData.waterConsumptionShadow,
                tension: 0.2,
                backgroundColor: '#00935B',
                type: "line",
                borderWidth: 0.8,
                borderColor: '#00935B',
                xAxisID: "xAxes2"
            },
            {
                label: 'Grey Zone',
                data: chartData.greyAreaLpm,
                tension: 0.2,
                backgroundColor: '#838689',
                type: "line",
                fill: true,
            },
            {
                label: 'Leaked Water',
                data: chartData.leakedWaterLpm,
                tension: 0.2,
                backgroundColor: '#E8D12A',
                type: "line",
                fill: true,
            },
            {
                label: 'Consumed Water',
                data: chartData.waterConsumedLpm,
                tension: 0.2,
                backgroundColor: '#292561',
                type: "line",
                fill: true,
            },
        ]
    }

    let options = {
        commonUpdate: true,
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            point:{
                radius: 0.8
            }
        },
        scales: {
            x: {
                min: chartData.dateRange.start,
                max: chartData.dateRange.end,
                offset: true,
                type: 'time',
                time: {
                    displayFormat: 'MM-dd hh:mm'
                },
                ticks: {
                    major: {
                        enabled: true
                    },
                    font: (context) => {
                        const boldedTicks = context.tick && context.tick.major ? 'bold' : '';
                        return { weight: boldedTicks, color: "#000000" }
                    }
                },
                title: {
                    display: true,
                    text: 'Orange: Weekend days | Blue: Period of average minimum flow measured',
                    color: '#333333',
                    font:{
                        weight: "bold",
                    }
                },
                grid: {
                    display: false,
                }
            },
            xAxes2: {
                min: chartData.dateRangePrevious.start,
                max: chartData.dateRangePrevious.end,
                offset: true,
                position: 'top',
                type: 'time',
                time: {
                    displayFormat: 'MM-dd hh:mm',
                },
                ticks: {
                    major: {
                        enabled: true
                    },
                    font: (context) => {
                        const boldedTicks = context.tick && context.tick.major ? 'bold' : '';
                        return { weight: boldedTicks, color: "#000000" }
                    }
                },
                title: {
                    display: true,
                    text: 'Previous Period',
                    color: '#333333',
                    font:{
                        weight: "bold",
                    }
                },
                grid: {
                    display: false,
                }
            },
            y: {
                min: 0,
                title: {
                    display: true,
                    text: metric === 'liters' ? 'Flow Rate (LPM)' : 'Flow Rate (GPM)',
                    color: '#333333',
                    font:{
                        weight: "bold",
                    }
                },
                time:{
                    displayFormats: {
                        day: 'MM-dd hh:mm'
                    },
                    tooltipFormat: 'MM-dd hh:mm'
                }
            }
        },
        plugins: {
            weekend_highlighter: {
                startDate: chartWeekendsStart,
                endDate: chartWeekendsEnd 
            },
            day_night_highlighter: {
                startDate: chartDateNightStart,
                endDate: chartDateNightEnd 
            },
            legend: {
                position: "bottom",
                labels: {
                    boxWidth: 12,
                    pointStyle: "circle",
                    useBorderRadius: true,
                    borderRadius: 4.5,
                },
            },
            zoom: {
                zoom: {
                    drag: {
                        enabled: true
                    },
                    pan: {
                        enabled: true,
                        mode: 'x',
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'x',
                    onZoomComplete({chart}) {
                        if (!chart.options.commonUpdate) {
                            return;
                        }
                        for (const k of Object.keys(ChartJS.instances)) {
                            const c = ChartJS.instances[k];
                            if (c.id !== chart.id && c.options.plugins.zoom.pan && c.options.commonUpdate) {
                                c.options.scales.x.min = Math.trunc(chart.scales.x.min);
                                c.options.scales.x.max = Math.trunc(chart.scales.x.max);
                                c.update();
                            }
                        }
                    }
                },
                pan: {
                    enabled: true,
                    mode: 'x',
                },
            },
            tooltip: {
                enabled: true,
                intersect: false,
                mode: 'nearest',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                bodyColor: '#333333',
                titleColor: '#333333',
            },
    }
    }

    let data2 = {
        datasets: [
            {
                label: 'High Flow Rate',
                data: chartData.highFlowSideRate,
                tension: 0.2,
                backgroundColor: '#91298C',
                type: "line",
                fill: true,
            },
            {
                label: 'Low Flow Rate',
                data: chartData.lowFlowSideRate,
                tension: 0.2,
                backgroundColor: '#00935B',
                type: "line",
                fill: true,
            },
        ]
    }

    const resetZoom = () => {
        for (const k of Object.keys(ChartJS.instances)) {
            const c = ChartJS.instances[k];
            c.resetZoom()
        }
    }

  return (
    <div className='w-full flex flex-col justify-start items-end p-[1rem]'>
        <div className="w-full flex flex-row justify-between items-center">
            <div className="flex flex-col items-start justify-between">
                <p className="text-blue-hard font-semibold text-[1.5rem] text-start">Water Consumption Benchmarking</p>
                <div className="flex flex-row items-center justify-between">
                    <p className="text-blue-hard font-light text-[0.75rem]">Last night average:</p>
                    <p className="text-blue-hard font-semibold text-[0.85rem] ml-[0.5rem]">{chartData.lastNightAvgLPM} LPM</p>
                </div>
            </div>
            <div className="flex flex-col items-end justify-between">
                {   
                    meterType === 0 &&
                    <div className="flex flex-row items-center justify-end">
                        <input 
                            type="checkbox"
                            onClick={()=> setShowLowerChart(!showLowerChart)}

                        />
                        <p className="text-blue-hard font-semibold text-[0.75rem] text-start ml-[0.5rem]">View High vs. Low Flow chart</p>
                    </div>
                }
                <button 
                    className='wm-button-quick-report mt-[1rem] mr-0'
                    onClick={()=> {
                        resetZoom()
                    }}
                >
                    Reset Zoom
                </button>
            </div>
        </div>
        <div className='w-full flex flex-col justify-start items-end'>
            
        </div>
        <div className="h-[20rem] w-full">
            <Line 
                data={data} 
                options={options}
                plugins={{weekend_highlighter, day_night_highlighter}}
                default={{fonts: { labels: 'Fira Sans'}}}
            />
        </div>
        {
            showLowerChart && meterType === 0 &&
            <div className="h-[20rem] w-full mt-[1rem]">
                <p className="text-blue-hard font-semibold">High vs. Low Flow</p>
                <Line 
                    data={data2} 
                    options={options}
                    plugins={{weekend_highlighter, day_night_highlighter}}
                    default={{fonts: { labels: 'Fira Sans'}}}
                />
            </div>
        }
        
    </div>
  )
}

export default LowerChartConsumption