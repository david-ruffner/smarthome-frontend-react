import {useUI} from "../../context/UIContext.jsx";
import {useCollapseTransition} from "../../utils/ui.jsx";
import WeatherViewBtn from "./WeatherViewBtn.jsx";
import WeatherTrendViewBtn from "./WeatherTrendViewBtn.jsx";


function WeatherTrendsSelector() {

    const {
        isWeatherTrendsSelectorVisible
    } = useUI();
    const isCollapsed = useCollapseTransition(isWeatherTrendsSelectorVisible, 500);

    const className = [
        'frosted-glass',
        'smooth-opacity',
        !isWeatherTrendsSelectorVisible ? 'is-hiding' : '',
        isCollapsed ? 'is-collapsed' : ''
    ].filter(Boolean).join(' ');

    return <>
        <style>{`
            #weather-trends-selector-outer {
                position: absolute;
                  inset: 0;               /* same footprint */
                  display: grid;
                  grid-template-columns: repeat(2, auto);
                  grid-row-gap: 50px;
                  justify-content: space-around;
                  padding: 25px 0;
                  z-index: 2;
            }
        `}</style>

        <div id={'weather-trends-selector-outer'} className={className}>
            <WeatherTrendViewBtn
                name={'Precipitation'}
                trendView={'trends-precipitation'}
                btnBackground={'var(--btn-green)'}
                btnForeground={'white'}
                imgName={'rainy_white'}
            />

            <WeatherTrendViewBtn
                name={'Temperature'}
                trendView={'trends-temperature'}
                btnBackground={'var(--btn-light-blue)'}
                btnForeground={'white'}
                imgName={'temp_white'}
                customImgStyle={{
                    width: '45px'
                }}
            />

            <WeatherTrendViewBtn
                name={'Humidity'}
                trendView={'trends-humidity'}
                btnBackground={'var(--btn-soft-cyan)'}
                btnForeground={'black'}
                btnActiveBackground={'white'}
                btnActiveForeground={'black'}
                imgName={'humidity_black'}
                customImgStyle={{
                    width: '45px'
                }}
            />

            <WeatherTrendViewBtn
                name={'Feels Like'}
                trendView={'trends-feels-like'}
                btnBackground={'var(--btn-blush-rose)'}
                btnForeground={'white'}
                imgName={'feels_like_temp_white'}
                customImgStyle={{
                    width: '45px'
                }}
            />
        </div>
    </>
}

export default WeatherTrendsSelector;