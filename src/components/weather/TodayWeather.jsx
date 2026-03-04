import {useUI} from "../../context/UIContext.jsx";
import {useCollapseTransition} from "../../utils/ui.jsx";
import HourlyWeatherPanel from "./HourlyWeatherPanel.jsx";
import {useEffect, useState} from "react";
import {BACKEND_HOST} from "../Constants.jsx";
import {fetchToken, getTimeFor24Hr, logErr} from "../../utils/Utils.js";
import {notify} from "../../services/NotificationService.jsx";


function TodayWeather() {

    const {
        isTodayWeatherVisible
    } = useUI();
    const isCollapsed = useCollapseTransition(isTodayWeatherVisible, 500);
    const [ hourlyForecast, setHourlyForecast ] = useState([]);
    const [ errMsg, setErrMsg ] = useState('');

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
            logErr({
                errMsg: `Error Fetching Today's Forecast: ${err}`,
                fileName: 'TodayWeather.jsx',
                lineNumber: '37'
            })

            return;
        }

        let data = await resp.json();

        if (data.errCode) {
            switch (data.errCode) {
                case 'FORECAST_EXHAUSTED':
                    setErrMsg('There are no more daytime forecasts for today');
                    break;
            }

            return;
        }

        setHourlyForecast(data.daytimePeriods);
    }

    useEffect(() => {
        // Fetch today's weather forecast
        if (isTodayWeatherVisible) {
            processTodaysForecast();
        }
    }, [isTodayWeatherVisible]);

    return <>
        <style>{`
            #today-weather-container > h1.frosted-glass {
                width: 85%;
                justify-self: center;
                margin-top: 25px;
                padding: 15px;
            }
            
            .panel-err-msg {
                margin: 50px 35px 0 35px;
                padding: 15px;
                font-size: 28pt;
                color: rgba(255, 0, 0, 0.6);
                font-weight: 500;
                will-change: opacity;
                transition: opacity 500ms ease-in-out;
            }
        `}</style>

        <div id={'today-weather-container'} className={className}>
            <h1 className={'frosted-glass'}>Today's Forecast</h1>

            <h2 className={`frosted-glass panel-err-msg ${errMsg 
            && errMsg !== '' ? '' : 'ui-disabled'}`}>{errMsg}</h2>

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