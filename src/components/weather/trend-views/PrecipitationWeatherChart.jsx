import {useMemo} from "react";
import Chart from 'react-apexcharts';


function PrecipitationWeatherChart({ precipValues, timeValues, lineColor }) {

    const series = useMemo(() => ([
        {
            name: "Precipitation",
            data: precipValues
        }
    ]), [precipValues]);

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

export default PrecipitationWeatherChart;