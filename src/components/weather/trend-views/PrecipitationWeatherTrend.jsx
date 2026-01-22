import {useUI} from "../../../context/UIContext.jsx";
import {useCollapseTransition} from "../../../utils/ui.jsx";
import PrecipitationWeatherChart from "./PrecipitationWeatherChart.jsx";
import {useEffect, useState} from "react";
import {BACKEND_HOST} from "../../Constants.jsx";
import {fetchToken} from "../../../utils/Utils.js";
import {notify} from "../../../services/NotificationService.jsx";
import {TrendColor} from "../../../utils/TrendColor.js";


function PrecipitationWeatherTrend({ setActiveTrendBtnColor, trendType,
                                   setTrendType, setTrendTitle, trendColor }) {

    const {
        isWeatherTrendPrecipitationVisible
    } = useUI();
    const isCollapsed = useCollapseTransition(isWeatherTrendPrecipitationVisible, 500);
    const [ precipValues, setPrecipValues ] = useState([]);
    const [ timeValues, setTimeValues ] = useState([]);
    const trendColorObj = new TrendColor(trendColor);

    const className = [
        'weather-trend-panel',
        !isWeatherTrendPrecipitationVisible ? 'is-hiding' : '',
        isCollapsed ? 'is-collapsed' : ''
    ].filter(Boolean).join(' ');

    async function fetchPrecipitationTrends() {
        const res = await fetch(
            `${BACKEND_HOST}/weatherTrends/getPrecipitation?trendType=${trendType}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${fetchToken()}`
            }
        });

        if (!res.ok) {
            notify("There was a problem fetching precipitation data. Please see the console.");
            const err = await res.json();
            console.log(`Error while fetching precipitation data: ${JSON.stringify(err)}`);
        }

        const data = await res.json();
        const precipPeriods = data.precipitationPeriods;
        const precipValues = precipPeriods.map(p => p.precipitationValue);
        const timeValues = precipPeriods.map(p => p.twelveHourStartTime);

        setPrecipValues(precipValues);
        setTimeValues(timeValues);
    }

    useEffect(() => {
        if (isWeatherTrendPrecipitationVisible) {
            setTrendTitle("Precipitation Trends")
            fetchPrecipitationTrends();
            setActiveTrendBtnColor(trendColorObj.frostedGlassColor)
        }
    }, [trendType, isWeatherTrendPrecipitationVisible]);

    return <>
        <style>{`
            #temperature-trend-outer {
                margin: 25px 0 0 0;
            }
            
            .active-trend-btn {
                background: var(--active-trend-btn-color);
            }
        `}</style>

        <div id={'temperature-trend-outer'} className={className}>
            <PrecipitationWeatherChart
                precipValues={precipValues}
                timeValues={timeValues}
                lineColor={trendColorObj.fullColor}
            />
        </div>
    </>
}

export default PrecipitationWeatherTrend;