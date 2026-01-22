import {useUI} from "../../../context/UIContext.jsx";
import {useCollapseTransition} from "../../../utils/ui.jsx";
import {useEffect, useState} from "react";
import {BACKEND_HOST} from "../../Constants.jsx";
import {fetchToken} from "../../../utils/Utils.js";
import {notify} from "../../../services/NotificationService.jsx";
import HumidityWeatherChart from "./HumidityWeatherChart.jsx";
import {TrendColor} from "../../../utils/TrendColor.js";


function HumidityWeatherTrend({ setActiveTrendBtnColor, trendType,
                               setTrendType, setTrendTitle, trendColor }) {

    const {
        isWeatherTrendHumidityVisible
    } = useUI();
    const isCollapsed = useCollapseTransition(isWeatherTrendHumidityVisible, 500);
    const [ humidityValues, setHumidityValues ] = useState([]);
    const [ timeValues, setTimeValues ] = useState([]);
    const trendColorObj = new TrendColor(trendColor);

    const className = [
        'weather-trend-panel',
        !isWeatherTrendHumidityVisible ? 'is-hiding' : '',
        isCollapsed ? 'is-collapsed' : ''
    ].filter(Boolean).join(' ');

    async function fetchHumidityTrends() {
        const res = await fetch(
            `${BACKEND_HOST}/weatherTrends/getHumidity?trendType=${trendType}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${fetchToken()}`
            }
        });

        if (!res.ok) {
            notify("There was a problem fetching humidity data. Please see the console.");
            const err = await res.json();
            console.log(`Error while fetching humidity data: ${JSON.stringify(err)}`);
        }

        const data = await res.json();
        const humidityPeriods = data.humidityPeriods;
        const humidityValues = humidityPeriods.map(p => p.humidityValue);
        const timeValues = humidityPeriods.map(p => p.twelveHourStartTime);

        setHumidityValues(humidityValues);
        setTimeValues(timeValues);
    }

    useEffect(() => {
        if (isWeatherTrendHumidityVisible) {
            setTrendTitle("Humidity Trends")
            fetchHumidityTrends();
            setActiveTrendBtnColor(trendColorObj.frostedGlassColor);
        }
    }, [trendType, isWeatherTrendHumidityVisible]);

    return <>
        <style>{`
            #humidity-trend-outer {
                margin: 25px 0 0 0;
            }
            
            .active-trend-btn {
                background: var(--active-trend-btn-color);
            }
        `}</style>

        <div id={'humidity-trend-outer'} className={className}>
            <HumidityWeatherChart
                humidityValues={humidityValues}
                timeValues={timeValues}
                lineColor={trendColorObj.fullColor}
            />
        </div>
    </>
}

export default HumidityWeatherTrend;