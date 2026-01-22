import WeatherViewBtn from "./WeatherViewBtn.jsx";
import {useUI} from "../../context/UIContext.jsx";
import {useCollapseTransition} from "../../utils/ui.jsx";
// import {CustomStyle} from "../../utils/CustomStyle.js";


function WeatherViewSelector() {

    const {
        isWeatherViewSelectorVisible
    } = useUI();
    const isCollapsed = useCollapseTransition(isWeatherViewSelectorVisible, 500);

    const className = [
        'frosted-glass',
        !isWeatherViewSelectorVisible ? 'is-hiding' : '',
        isCollapsed ? 'is-collapsed' : ''
    ].filter(Boolean).join(' ');

    return <>
        <style>{`
            #weather-view-outer-container {
                position: absolute;
                  inset: 0;               /* fill the overlay wrapper */
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  grid-template-rows: repeat(2, auto);
                  z-index: 1;
            }
            
            .weather-view-btn {
                padding: 15px;
                margin: 25px;
                font-size: 12px;
                background: rgba(255, 255, 255, 0.05); /* translucent white */
                backdrop-filter: blur(10px);          /* creates the frosted look */
                -webkit-backdrop-filter: blur(10px);  /* for Safari support */
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                height: fit-content;
            }
            
            .weather-view-btn:nth-of-type(4) {
                grid-row: 2;
                grid-column: 1;
            }
            
            .weather-view-btn:nth-of-type(5) {
                grid-row: 2;
                grid-column: 3;
            }
            
            .active-weather-view-btn {
                background: rgba(0, 0, 255, 0.15); /* translucent white */
                backdrop-filter: blur(10px);          /* creates the frosted look */
                -webkit-backdrop-filter: blur(10px);  /* for Safari support */
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                height: fit-content;
            }
            
            .weather-view-btn > h1 {
                font-weight: 400;
            }
            
            .active-weather-view-btn > h1 {
                font-weight: 500;
            }
        `}</style>

        <div className={className} id={'weather-view-outer-container'}>
            <WeatherViewBtn
                name={'Current'}
                weatherView={'current'}
            />
            <WeatherViewBtn
                name={'Today'}
                weatherView={'today'}
            />
            <WeatherViewBtn
                name={'Tomorrow'}
                weatherView={'tomorrow'}
            />
            <WeatherViewBtn
                name={'3 Day'}
                weatherView={'3-day'}
            />
            <WeatherViewBtn
                name={'Trends'}
                weatherView={'trends'}
                customStyles={{
                    background: 'rgba(109, 176, 255, 0.65)',
                    gridRow: 2,
                    gridColumn: 2
                }}
            />
            <WeatherViewBtn
                name={'7 Day'}
                weatherView={'7-day'}
            />
        </div>
    </>
}

export default WeatherViewSelector;