import {useUI} from "../../context/UIContext.jsx";
import {useCollapseTransition} from "../../utils/ui.jsx";
import CurrentWeatherBodyValue from "./CurrentWeatherBodyValue.jsx";
import {useEffect, useState} from "react";
import {BACKEND_HOST} from "../Constants.jsx";
import {fetchToken} from "../../utils/Utils.js";
import {notify} from "../../services/NotificationService.jsx";


function ThreeDayWeather() {

    const {
        is3DayWeatherVisible
    } = useUI();
    const isCollapsed = useCollapseTransition(is3DayWeatherVisible, 500);
    const [ dailyForecast, setDailyForecast ] = useState({});
    const [ activeBodyByDay, setActiveBodyByDay ] = useState({});

    const className = [
        'weather-panel',
        !is3DayWeatherVisible ? 'is-hiding' : '',
        isCollapsed ? 'is-collapsed' : ''
    ].filter(Boolean).join(' ');

    async function renderForecastData() {
        const resp = await fetch(`${BACKEND_HOST}/dashboard/getThreeDayForecast`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${fetchToken()}`
            }
        })

        if (!resp.ok) {
            notify("There was a problem fetching the 3-Day forecast. Please see the console.");
            let err = await resp.body;
            console.log(`Error Fetching The 3-Day Forecast: ${err}`);

            return;
        }

        let data = await resp.json();
        setDailyForecast(data.singleDayPeriodMap);
    }

    useEffect(() => {
        // Fetch 3-Day Weather Forecast
        renderForecastData();
    }, []);

    function setActiveBody(dayKey, period) {
        setActiveBodyByDay(prev => ({
            ...prev,
            [dayKey]: period
        }));
    }

    return <>
        <style>{`
            #three-day-weather-container {
                width: 90%;
                justify-self: center;
                margin: 25px 0 0 0;
            }
        `}</style>

        <div id={'three-day-weather-container'} className={className}>
            {Object.keys(dailyForecast).map((dayKey) => {
                const activePeriod = activeBodyByDay[dayKey] ?? 'day';

                return (
                    <div key={dayKey} className={'day-weather-outer-container'}>
                        <div className={'day-weather-nav-container'}>
                            <h1>{dayKey}</h1>

                            <h2 className={`day-weather-nav-day-btn frosted-glass 
                            ${activePeriod === 'day' ? 'day-weather-active-btn' : ''}`}
                            onClick={() => setActiveBody(dayKey, 'day')}>Day</h2>

                            <h2 className={`day-weather-nav-night-btn frosted-glass
                            ${activePeriod === 'night' ? 'day-weather-active-btn' : ''}`}
                            onClick={() => setActiveBody(dayKey, 'night')}>Night</h2>
                        </div>

                        <div className={`day-weather-body-container body-daytime ${activePeriod === 'day' ? 'body-active' : ''} frosted-glass`}>
                            <CurrentWeatherBodyValue
                                header={'Temperature'}
                                value={dailyForecast[dayKey].daytimePeriod.temperatureStr}
                            />
                            <CurrentWeatherBodyValue
                                header={'Feels Like'}
                                value={dailyForecast[dayKey].daytimePeriod.feelsLikeTempStr}
                            />
                            <CurrentWeatherBodyValue
                                header={'Forecast'}
                                value={dailyForecast[dayKey].daytimePeriod.detailedForecast}
                            />
                            <CurrentWeatherBodyValue
                                header={'Winds'}
                                value={dailyForecast[dayKey].daytimePeriod.windStr}
                            />
                            <CurrentWeatherBodyValue
                                header={'Humidity'}
                                value={`${dailyForecast[dayKey].daytimePeriod.relativeHumidity}%`}
                            />
                        </div>

                        <div className={`day-weather-body-container body-nighttime ${activePeriod === 'night' ? 'body-active' : ''} frosted-glass`}>
                            <CurrentWeatherBodyValue
                                header={'Temperature'}
                                value={dailyForecast[dayKey].nighttimePeriod.temperatureStr}
                            />
                            <CurrentWeatherBodyValue
                                header={'Feels Like'}
                                value={dailyForecast[dayKey].nighttimePeriod.feelsLikeTempStr}
                            />
                            <CurrentWeatherBodyValue
                                header={'Forecast'}
                                value={dailyForecast[dayKey].nighttimePeriod.detailedForecast}
                            />
                            <CurrentWeatherBodyValue
                                header={'Winds'}
                                value={dailyForecast[dayKey].nighttimePeriod.windStr}
                            />
                            <CurrentWeatherBodyValue
                                header={'Humidity'}
                                value={`${dailyForecast[dayKey].nighttimePeriod.relativeHumidity}%`}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    </>
}

export default ThreeDayWeather;