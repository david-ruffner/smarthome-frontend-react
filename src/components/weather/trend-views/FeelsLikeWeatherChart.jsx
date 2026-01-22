import {useMemo} from "react";
import Chart from 'react-apexcharts';


function FeelsLikeWeatherChart({ feelsLikeValues, timeValues, lineColor }) {

    console.log("Feels Like Values");
    console.log(feelsLikeValues);

    const series = useMemo(() => ([
        {
            name: "Feels Like",
            data: feelsLikeValues
        }
    ]), [feelsLikeValues]);

    const options = useMemo(() => ({
        chart: {
            type: 'line',
            toolbar: { show: false }
        },
        colors: [ lineColor ],
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

export default FeelsLikeWeatherChart;