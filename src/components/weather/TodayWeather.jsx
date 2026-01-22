import {useUI} from "../../context/UIContext.jsx";
import {useCollapseTransition} from "../../utils/ui.jsx";
import HourlyWeatherPanel from "./HourlyWeatherPanel.jsx";
import {useEffect, useState} from "react";
import {BACKEND_HOST} from "../Constants.jsx";
import {fetchToken, getTimeFor24Hr} from "../../utils/Utils.js";
import {notify} from "../../services/NotificationService.jsx";


function TodayWeather() {

    const {
        isTodayWeatherVisible
    } = useUI();
    const isCollapsed = useCollapseTransition(isTodayWeatherVisible, 500);
    const [ hourlyForecast, setHourlyForecast ] = useState([]);

    const className = [
        'weather-panel',
        !isTodayWeatherVisible ? 'is-hiding' : '',
        isCollapsed ? 'is-collapsed' : ''
    ].filter(Boolean).join(' ');

    async function processTodaysForecast() {
        const resp = await fetch(`${BACKEND_HOST}/dashboard/getDaytimeForecast`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${fetchToken()}`
            }
        });

        if (!resp.ok) {
            notify("There was a problem fetching today's forecast. Please see the console.");
            let err = await resp.body;
            console.log(`Error Fetching Today's Forecast: ${err}`);

            return;
        }

        let data = await resp.json();
        setHourlyForecast(data.daytimePeriods);
        console.log(data); // TODO: Remove
    }

    useEffect(() => {
        // Fetch today's weather forecast
        processTodaysForecast();
    }, []);

    return <>
        <style>{`
            #today-weather-container > h1.frosted-glass {
                width: 85%;
                justify-self: center;
                margin-top: 25px;
                padding: 15px;
            }
        `}</style>

        <div id={'today-weather-container'} className={className}>
            <h1 className={'frosted-glass'}>Today's Forecast</h1>

            {Array.isArray(hourlyForecast) &&
                hourlyForecast.map((period, index) => (
                <HourlyWeatherPanel
                    key={index}
                    timeStr={getTimeFor24Hr({time: period.zonedStartTime})}
                    forecast={period.shortForecast}
                    windStr={period.windStr}
                    tempStr={period.temperatureStr}
                    humidityStr={period.humidityStr}
                    feelsLikeStr={period.feelsLikeTempStr}
                />
            ))};
        </div>
    </>
}

export default TodayWeather;