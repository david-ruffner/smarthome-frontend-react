import {useUI} from "../../../context/UIContext.jsx";
import {useCollapseTransition} from "../../../utils/ui.jsx";
import {useEffect, useState} from "react";
import {BACKEND_HOST} from "../../Constants.jsx";
import {fetchToken} from "../../../utils/Utils.js";
import {notify} from "../../../services/NotificationService.jsx";
import TemperatureWeatherChart from "./TemperatureWeatherChart.jsx";
import {TrendColor} from "../../../utils/TrendColor.js";


function TemperatureWeatherTrend({ setActiveTrendBtnColor, trendType,
                                 setTrendType, setTrendTitle, trendColor }) {

    const {
        isWeatherTrendTempVisible
    } = useUI();
    const isCollapsed = useCollapseTransition(isWeatherTrendTempVisible, 500);
    const [ tempValues, setTempValues ] = useState([]);
    const [ timeValues, setTimeValues ] = useState([]);
    const trendColorObj = new TrendColor(trendColor);

    const className = [
        'weather-trend-panel',
        !isWeatherTrendTempVisible ? 'is-hiding' : '',
        isCollapsed ? 'is-collapsed' : ''
    ].filter(Boolean).join(' ');

    async function fetchTemperatureTrends() {
        const res = await fetch(
            `${BACKEND_HOST}/weatherTrends/getTemperature?trendType=${trendType}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${fetchToken()}`
                }
            }
        )

        if (!res.ok) {
            notify("There was a problem fetching temperature data. Please see the console.");
            const err = await res.json();
            console.log(`Error while fetching temperature data: ${JSON.stringify(err)}`);
        }

        const data = await res.json();
        const tempPeriods = data.temperaturePeriods;
        const tempValues = tempPeriods.map(p => p.temperatureValue);
        const timeValues = tempPeriods.map(p => p.twelveHourStartTime);

        setTempValues(tempValues);
        setTimeValues(timeValues);
    }

    useEffect(() => {
        if (isWeatherTrendTempVisible) {
            setTrendTitle("Temperature Trends");
            fetchTemperatureTrends();
            setActiveTrendBtnColor(trendColorObj.frostedGlassColor);
        }
    }, [trendType, isWeatherTrendTempVisible])

    return <>
        <style>{`
            #precipitation-trend-outer {
                margin: 25px 0 0 0;
            }
            
            .active-trend-btn {
                background: var(--active-trend-btn-color);
            }
        `}</style>

        <div id={'temperature-trend-outer'} className={className}>
            <TemperatureWeatherChart
                tempValues={tempValues}
                timeValues={timeValues}
                lineColor={trendColorObj.fullColor}
            />
        </div>
    </>
}

export default TemperatureWeatherTrend;