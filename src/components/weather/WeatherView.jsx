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
import WeatherTrends from "./WeatherTrends.jsx";
import WeatherTrendsSelector from "./WeatherTrendsSelector.jsx";
import WeatherTrendViewBtn from "./WeatherTrendViewBtn.jsx";


function WeatherView() {

    const {
        isWeatherViewVisible, isDashboardVisible,
        isCurrentWeatherVisible, setIsCurrentWeatherVisible
    } = useUI();

    // const [ isCurrentWeatherVisible, setIsCurrentWeatherVisible ] = useState(true); // TODO: Revert to false

    return (
        <>
            <style>{`
                #weather-container {
                    margin: 0 15px 0 15px;
                    height: 800px;
                    position: relative;
                }
            `}</style>

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

                <WeatherTrends

                />
            </div>

            <div id={'weather-selectors-outer'} className={'smooth-opacity'}>
                <WeatherViewSelector

                />

                <WeatherTrendsSelector

                />
            </div>
        </>
    )
}

export default WeatherView;