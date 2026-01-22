import '/src/css/components/WeatherView.css'
import {logErr} from "../../utils/Utils.js";
import CurrentWeather from "./CurrentWeather.jsx";
import {useState} from "react";
import {useUI} from "../../context/UIContext.jsx";
import WeatherViewSelector from "./WeatherViewSelector.jsx";
import TodayWeather from "./TodayWeather.jsx";
import '/src/css/weather.css';
import TomorrowWeather from "./TomorrowWeather.jsx";
import ThreeDayWeather from "./ThreeDayWeather.jsx";
import SevenDayWeather from "./SevenDayWeather.jsx";


function WeatherView() {

    const {
        isWeatherViewVisible, isDashboardVisible,
        isCurrentWeatherVisible, setIsCurrentWeatherVisible
    } = useUI();

    // const [ isCurrentWeatherVisible, setIsCurrentWeatherVisible ] = useState(true); // TODO: Revert to false

    return (
        <>
            <div id={'weather-container'} className={`frosted-glass ${isWeatherViewVisible ? '' : 'ui-disabled'}`}>
                <CurrentWeather
                    isCurrentWeatherVisible={isCurrentWeatherVisible}
                />

                <TodayWeather

                />

                <TomorrowWeather

                />

                <ThreeDayWeather

                />

                <SevenDayWeather

                />
            </div>

            <WeatherViewSelector

            />
        </>
    )
}

export default WeatherView;