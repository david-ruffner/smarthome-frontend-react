import {useMemo} from "react";
import Chart from 'react-apexcharts';


function HumidityWeatherChart({ humidityValues, timeValues, lineColor }) {

    const series = useMemo(() => ([
        {
            name: "Humidity",
            data: humidityValues
        }
    ]), [humidityValues]);

    const options = useMemo(() => ({
        chart: {
            type: 'line',
            toolbar: { show: false }
        },
        colors: [lineColor],
        stroke: {
            curve: 'smooth',
            width: 3
        },
        xaxis: {
            categories: timeValues
        },
        yaxis: {
            labels: {
                formatter: val => `${val}°`
            }
        },
        theme: {
            mode: "dark" // "light" also works
        }
    }), [timeValues]);

    return (
        <Chart
            options={options}
            series={series}
            type={"line"}
            height={300}
        />
    );
}

export default HumidityWeatherChart;