import {useUI} from "../../context/UIContext.jsx";
import {useCollapseTransition} from "../../utils/ui.jsx";
import {useEffect, useState} from "react";
import {BACKEND_HOST} from "../Constants.jsx";
import {fetchToken, getTimeFor24Hr} from "../../utils/Utils.js";
import {notify} from "../../services/NotificationService.jsx";
import HourlyWeatherPanel from "./HourlyWeatherPanel.jsx";


function TomorrowWeather() {

    const {
        isTomorrowWeatherVisible
    } = useUI();
    const isCollapsed = useCollapseTransition(isTomorrowWeatherVisible, 500);
    const [ hourlyForecast, setHourlyForecast ] = useState([]);

    const className = [
        'weather-panel',
        !isTomorrowWeatherVisible ? 'is-hiding' : '',
        isCollapsed ? 'is-collapsed' : ''
    ].filter(Boolean).join(' ');

    async function fetchForecastData() {
        const resp = await fetch(`${BACKEND_HOST}/dashboard/getTomorrowForecast`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${fetchToken()}`
            }
        })

        if (!resp.ok) {
            notify("There was a problem fetching today's forecast. Please see the console.");
            let err = await resp.body;
            console.log(`Error Fetching Today's Forecast: ${err}`);

            return;
        }

        let data = await resp.json();
        setHourlyForecast(data.allPeriods);
        console.log(data); // TODO: Remove
    }

    useEffect(() => {
        // Fetch tomorrow's weather forecast
        fetchForecastData();
    }, []);

    return <>
        <style>{`
            #tomorrow-weather-container > h1 {
                padding: 15px;
                margin: 25px;
            }
        `}</style>

        <div id={'tomorrow-weather-container'} className={className}>
            <h1 className={'frosted-glass'}>Tomorrow's Forecast</h1>

            {hourlyForecast.map((period, index) => (
                <HourlyWeatherPanel
                    key={index}
                    timeStr={getTimeFor24Hr({time: period.zonedStartTime})}
                    forecast={period.shortForecast}
                    windStr={period.windStr}
                    tempStr={period.temperatureStr}
                    humidityStr={period.humidityStr}
                    feelsLikeStr={period.feelsLikeTempStr}
                />
            ))}
        </div>
    </>
}

export default TomorrowWeather;