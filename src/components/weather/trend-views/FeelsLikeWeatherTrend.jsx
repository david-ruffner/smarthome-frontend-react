import {useUI} from "../../../context/UIContext.jsx";
import {useCollapseTransition} from "../../../utils/ui.jsx";
import PrecipitationWeatherChart from "./PrecipitationWeatherChart.jsx";
import {useEffect, useState} from "react";
import {BACKEND_HOST} from "../../Constants.jsx";
import {fetchToken} from "../../../utils/Utils.js";
import {notify} from "../../../services/NotificationService.jsx";
import FeelsLikeWeatherChart from "./FeelsLikeWeatherChart.jsx";
import {TrendColor} from "../../../utils/TrendColor.js";


function FeelsLikeWeatherTrend({ setActiveTrendBtnColor, trendType,
                               setTrendType, setTrendTitle, trendColor }) {

    const {
        isWeatherTrendFeelsLikeVisible
    } = useUI();
    const isCollapsed = useCollapseTransition(isWeatherTrendFeelsLikeVisible, 500);
    const [ feelsLikeValues, setFeelsLikeValues ] = useState([]);
    const [ timeValues, setTimeValues ] = useState([]);
    const trendColorObj = new TrendColor(trendColor);

    const className = [
        'weather-trend-panel',
        !isWeatherTrendFeelsLikeVisible ? 'is-hiding' : '',
        isCollapsed ? 'is-collapsed' : ''
    ].filter(Boolean).join(' ');

    async function fetchFeelsLikeTrends() {
        const res = await fetch(
            `${BACKEND_HOST}/weatherTrends/getFeelsLike?trendType=${trendType}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${fetchToken()}`
            }
        });

        if (!res.ok) {
            notify("There was a problem fetching feels like data. Please see the console.");
            const err = await res.json();
            console.log(`Error while fetching feels like data: ${JSON.stringify(err)}`);
        }

        const data = await res.json();
        console.log(data);
        const feelsLikePeriods = data.feelsLikePeriods;
        const feelsLikeValues = feelsLikePeriods.map(p => p.feelsLikeValue);
        const timeValues = feelsLikePeriods.map(p => p.twelveHourStartTime);

        setFeelsLikeValues(feelsLikeValues);
        setTimeValues(timeValues);
    }

    useEffect(() => {
        if (isWeatherTrendFeelsLikeVisible) {
            setTrendTitle("Feels Like Trends")
            fetchFeelsLikeTrends();
            setActiveTrendBtnColor(trendColorObj.frostedGlassColor);
        }
    }, [trendType, isWeatherTrendFeelsLikeVisible]);

    return <>
        <style>{`
            #feels-like-trend-outer {
                margin: 25px 0 0 0;
            }
            
            .active-trend-btn {
                background: var(--active-trend-btn-color);
            }
        `}</style>

        <div id={'feels-like-trend-outer'} className={className}>
            <FeelsLikeWeatherChart
                feelsLikeValues={feelsLikeValues}
                timeValues={timeValues}
                lineColor={trendColorObj.fullColor}
            />
        </div>
    </>
}

export default FeelsLikeWeatherTrend;