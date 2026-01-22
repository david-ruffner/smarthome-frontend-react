import {useUI} from "../../context/UIContext.jsx";
import {useCollapseTransition} from "../../utils/ui.jsx";


function SevenDayWeather() {

    const {
        is7DayWeatherVisible
    } = useUI();
    const isCollapsed = useCollapseTransition(is7DayWeatherVisible, 500);

    const className = [
        'weather-panel',
        !is7DayWeatherVisible ? 'is-hiding' : '',
        isCollapsed ? 'is-collapsed' : ''
    ].filter(Boolean).join(' ');

    return <>
        <div id={'7-day-weather-container'} className={className}>
            <h1>7 Day</h1>
        </div>
    </>
}

export default SevenDayWeather;