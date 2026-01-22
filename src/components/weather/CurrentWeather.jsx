import '/src/css/components/CurrentWeather.css'
import {useUI} from "../../context/UIContext.jsx";
import {fetchToken} from "../../utils/Utils.js";
import {BACKEND_HOST} from "../Constants.jsx";
import {notify} from "../../services/NotificationService.jsx";
import {useEffect, useState} from "react";
import WindWidget from "./WindWidget.jsx";
import WeatherIconWidget from "./WeatherIconWidget.jsx";
import CurrentWeatherBodyValue from "./CurrentWeatherBodyValue.jsx";
import {useCollapseTransition} from "../../utils/ui.jsx";

async function fetchCurrentWeather(isCurrentWeatherVisible, uiActions) {
    if (!isCurrentWeatherVisible) {
        return;
    }

    let token = fetchToken();
    if (!token) {
        uiActions.hideAll();
        uiActions.showUserSelect();

        return;
    }

    const res = await fetch(`${BACKEND_HOST}/dashboard/getCurrentConditions`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!res.ok) {
        notify("There was a problem getting weather data. Please log in again.");
        const err = await res.body;
        console.log(`Error while fetching current weather data: ${err}`);

        uiActions.hideAll();
        uiActions.showUserSelect();
    }

    return await res.json();
}

function CurrentWeather() {

    const {
        isCurrentWeatherVisible, uiActions
    } = useUI();
    const isCollapsed = useCollapseTransition(isCurrentWeatherVisible, 500);

    const className = [
        'weather-panel',
        !isCurrentWeatherVisible ? 'is-hiding' : '',
        isCollapsed ? 'is-collapsed' : ''
    ].filter(Boolean).join(' ');

    const [ cityStr, setCityStr ] = useState('');
    const [ windDirection, setWindDirection ] = useState('');
    const [ shortForecast, setShortForecast ] = useState('');
    const [ windStr, setWindStr ] = useState(''); // Full Wind String, e.g. 'NNW @ 10mph'
    const [ temperatureStr, setTemperatureStr ] = useState('');
    const [ feelsLikeTemperature, setFeelsLikeTemperature ] = useState('');
    const [ humidity, setHumidity ] = useState(0);
    const [ probOfPrecip, setProbOfPrecip ] = useState(0);

    useEffect(() => {
        fetchCurrentWeather(isCurrentWeatherVisible, uiActions)
            .then(resp => {
                console.log(resp);
                setCityStr(resp.locationStr);
                setWindDirection(resp.nwsHourlyPeriod.windDirection);
                setShortForecast(resp.nwsHourlyPeriod.shortForecast);
                setWindStr(resp.nwsHourlyPeriod.windStr);
                setTemperatureStr(resp.nwsHourlyPeriod.temperatureStr);
                setFeelsLikeTemperature(resp.nwsHourlyPeriod.feelsLikeTempStr);
                setHumidity(resp.nwsHourlyPeriod.humidityStr);
                setProbOfPrecip(resp.nwsHourlyPeriod.probOfPrecipStr);
            })
    }, [isCurrentWeatherVisible]);

    return <>
        <div id={'current-weather-container'} className={className}>
            <div id={'current-weather-nav-container'}>

                <WindWidget
                    windDirection={windDirection}
                />

                <h1>{cityStr}</h1>

                <WeatherIconWidget
                    shortForecast={shortForecast}
                    mapType={'blue'}
                />

                <h2>{windStr}</h2>

                <div className={'divider'}></div>
            </div>

            <div id={'current-weather-body-container'}>
                <CurrentWeatherBodyValue
                    header={'Conditions'}
                    value={shortForecast}
                />
                <CurrentWeatherBodyValue
                    header={'Temperature'}
                    value={temperatureStr}
                />
                <CurrentWeatherBodyValue
                    header={'Feels Like'}
                    value={feelsLikeTemperature}
                />
                <CurrentWeatherBodyValue
                    header={'Humidity'}
                    value={humidity}
                />
                <CurrentWeatherBodyValue
                    header={'Precipitation'}
                    value={probOfPrecip}
                />
            </div>
        </div>
    </>
}

export default CurrentWeather;