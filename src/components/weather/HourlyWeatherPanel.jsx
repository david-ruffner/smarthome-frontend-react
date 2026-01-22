import {get24HrFromSimpleTimeStr} from "../../utils/Utils.js";
import WeatherIconWidget from "./WeatherIconWidget.jsx";
import WindWidget from "./WindWidget.jsx";


function HourlyWeatherPanel({timeStr, forecast, windStr,
                            tempStr, humidityStr, feelsLikeStr}) {

    const BACK_PATH = '/src/assets/images/weather-icons/';

    let militaryTime = get24HrFromSimpleTimeStr(timeStr);
    let backgroundSrc = '';
    let textColor = '';
    let windSpeed = windStr.split('@')[1].trim();
    let windDirection = windStr.split('@')[0].trim();

    if (militaryTime >= 21 || militaryTime < 6) {
        // 12 AM - 5 AM
        backgroundSrc = `${BACK_PATH}nighttime_background.png`;
        textColor = 'white';
    } else if (militaryTime >= 6 && militaryTime < 9) {
        // 6 AM - 8 AM
        backgroundSrc = `${BACK_PATH}sunrise_background.png`;
        textColor = 'white';
    } else if (militaryTime >= 9 && militaryTime < 18) {
        // 9 AM - 5 PM
        backgroundSrc = `${BACK_PATH}daytime_background.png`;
        textColor = 'white';
    } else if (militaryTime >= 18 && militaryTime < 21) {
        // 6 PM - 8 PM
        backgroundSrc = `${BACK_PATH}sunset_background.png`;
        textColor = 'black';
    }

    const containerStyle = {
        '--hourly-bg': `url("${backgroundSrc}")`,
        '--hourly-text': textColor
    };

    return <>
        <style>{`
            .hourly-weather-outer-container {
                width: 90%;
                // height: 350px;
                justify-self: center;
                margin: 25px 0 0 0;
                
                background:
                    linear-gradient(
                        rgba(0, 0, 0, 0.35),
                        rgba(0, 0, 0, 0.35)
                    ),
                    var(--hourly-bg)
                        center / cover
                        no-repeat;
                        
                display: grid;
                grid-template-columns: 25% 1% 59% 15%;
                grid-template-rows: repeat(3, 1fr);
            }
            
            .hourly-weather-time {
                font-weight: 400;
                font-size: 28pt;
                grid-column: 1;
                grid-row: 1;
                margin: 25px 0 0 0;
                padding: 0;
            }
            
            .hourly-weather-outer-container > .vertical-divider {
                background-color: rgba(255, 255, 255, 0.5);
                width: 2px;
                grid-column: 2;
                grid-row: 1 / span 3;
                height: 85%;
                align-self: center;
            }
            
            .hourly-weather-forecast {
                font-weight: 400;
                font-size: 28pt;
                grid-column: 3;
                grid-row: 1;
                margin: 25px 0 0 0;
                padding: 0;
            }
            
            .hourly-weather-forecast-icon {
                grid-column: 4;
                grid-row: 1;
                margin: 15px 15px 0 0;
            }
            
            .hourly-weather-wind-widget {
                grid-column: 1;
                grid-row: 2;
                margin: 0 0 0 20px;
            }
            
            .hourly-weather-temperature {
                font-size: 28pt;
                font-weight: 500;
                grid-column: 3;
                grid-row: 2;
                justify-self: center;
                align-self: center;
                text-align: center;
            }
            
            .hourly-weather-humidity {
                font-size: 28pt;
                font-weight: 500;
                grid-column: 4;
                grid-row: 2;
                justify-self: center;
                align-self: center;
                text-align: center;
                margin: 0 10px 0 0;
            }
            
            .hourly-weather-wind-str {
                font-size: 22pt;
                font-weight: 400;
                padding: 0 10px 0 10px;
                grid-column: 1;
                grid-row: 3;
                justify-self: center;
                align-self: center;
            }
            
            .hourly-weather-feels-like {
                font-size: 28pt;
                font-weight: 500;
                justify-self: center;
                align-self: center;
            }
            
            .hourly-weather-wind-speed {
                font-weight: 600;
                font-size: 24pt;
            }
        `}</style>

        <div className={'frosted-glass hourly-weather-outer-container'}
            style={containerStyle}>
            <h1 className={'hourly-weather-time'}>{timeStr}</h1>
            <div className={'vertical-divider'}></div>
            <h1 className={'hourly-weather-forecast'}>{forecast}</h1>
            <WeatherIconWidget
                customClass={'hourly-weather-forecast-icon'}
                shortForecast={forecast}
                mapType={textColor}
            />

            <WindWidget
                windDirection={windDirection}
                customClass={'hourly-weather-wind-widget'}
            />
            <h1 className={'hourly-weather-temperature'}>{tempStr}</h1>
            <h1 className={'hourly-weather-humidity'}>{humidityStr}</h1>

            <h1 className={'hourly-weather-wind-str'}>{windDirection} @ <span className={'hourly-weather-wind-speed'}>{windSpeed}</span></h1>
            <h1 className={'hourly-weather-feels-like'}>Feels Like: {feelsLikeStr}</h1>
        </div>
    </>
}

export default HourlyWeatherPanel;