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
    // ToolTip,
    TimeScale,
    Legend,
    Filler
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    // ToolTip,
    TimeScale,
    Legend,
    Filler,
    zoomPlugin
)

const LowerChartConsumption = ({ chartWeekendsStart, chartWeekendsEnd, chartDateNightStart, chartDateNightEnd, chartData }) => {

    console.log(chartWeekendsStart)
    console.log(chartWeekendsEnd)
    console.log(chartDateNightStart)
    console.log(chartDateNightEnd)
    console.log(chartData)


    let metric = 'liters'

    // Weekend Highligther
    const weekendHighlighter = {
        id: 'weekendHighlighter',
        beforeDatasetsDraw(chart, args, pluginOptions){
            const { ctx, chartArea: {top, bottom, left, right, width, height}, scales: {x, y} } = chart;
            for(let i = 0; i < pluginOptions.startDate.length; i++){
                const startDate = new Date(pluginOptions.startDate[i]).setHours(0, 0, 0, 0);
                const endDate = new Date(pluginOptions.endDate[i]).setHours(23, 59, 59, 999);
                ctx.fillStyle = 'rgba(255, 133, 0, 0.1)'
                ctx.fillRect(x.getPixelForValue(startDate), top, x.getPixelForValue(endDate) - x.getPixelForValue(startDate), height)
            }
        }
    }

    // Day/Night Highligther
    const dayNightHighlighter = {
        id: 'dayNightHighlighter',
        beforeDatasetsDraw(chart, args, pluginOptions){
            const { ctx, chartArea: {top, bottom, left, right, width, height}, scales: {x, y} } = chart;
            for(let i = 0; i < pluginOptions.startDate.length; i++){
                const startDate = new Date(pluginOptions.startDate[i]).setHours(23, 59, 59, 999);
                const endDate = new Date(pluginOptions.endDate[i]).setHours(6, 0, 0, 0);
                ctx.fillStyle = 'rgba(0, 43, 255, 0.1)'
                ctx.fillRect(x.getPixelForValue(startDate), top, x.getPixelForValue(endDate) - x.getPixelForValue(startDate), height)
            }
        }
    }

    let data = {
        // default:{
        //     fonts: {
        //         labels: 'Fira Sans'
        //     }
        // },
        // data: {
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
        // },
        // plugins: [weekendHighlighter, dayNightHighlighter]
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
            weekendHighlighter: {
                startDate: chartWeekendsStart,
                endDate: chartWeekendsEnd 
            },
            dayNightHighlighter: {
                startDate: chartDateNightStart,
                endDate: chartDateNightEnd 
            },
            legend: {
                position: "bottom",
                labels: {
                    boxWidth: 12,
                    pointStyle: "circle",
                    useBorderRadius: true,
                    borderRadius: 6,
                },
            },
            zoom: {
                zoom: {
                    drag: {
                        enabled: true
                    },
                    mode: 'x',
                    onZoomComplete({chart}) {
                        if (!chart.options.commonUpdate) {
                            return;
                        }
                        for (const k of Object.keys(Chart.instances)) {
                            const c = Chart.instances[k];
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
                
            }
        }
    }

  return (
    <div className='w-full h-[30rem] flex flex-col justify-start items-end'>
        <div className='w-full flex flex-col justify-start items-end'>
            <button 
                className='wm-button-quick-report mb-[0.5rem]'
                onClick={()=> {
                    console.log('resetZoom()')
                }}
            >
                Reset Zoom
            </button>
        </div>
        <Line 
            data={data} 
            options={options}
            plugins={{weekendHighlighter, dayNightHighlighter}}
        />
    </div>
  )
}

export default LowerChartConsumption