import {useUI} from "../../context/UIContext.jsx";
import {useCollapseTransition} from "../../utils/ui.jsx";


function ThreeDayWeather() {

    const {
        is3DayWeatherVisible
    } = useUI();
    const isCollapsed = useCollapseTransition(is3DayWeatherVisible, 500);

    const className = [
        'weather-panel',
        !is3DayWeatherVisible ? 'is-hiding' : '',
        isCollapsed ? 'is-collapsed' : ''
    ].filter(Boolean).join(' ');

    return <>
        <div id={'3-day-weather-container'} className={className}>
            <h1>3 Day</h1>
        </div>
    </>
}

export default ThreeDayWeather;