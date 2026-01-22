import {useUI} from "../../context/UIContext.jsx";
import {useCollapseTransition} from "../../utils/ui.jsx";


function TodayWeather() {

    const {
        isTodayWeatherVisible
    } = useUI();
    const isCollapsed = useCollapseTransition(isTodayWeatherVisible, 500);

    const className = [
        'weather-panel',
        !isTodayWeatherVisible ? 'is-hiding' : '',
        isCollapsed ? 'is-collapsed' : ''
    ].filter(Boolean).join(' ');

    return <>
        <div id={'today-weather-container'} className={className}>
            <h1>Today</h1>
        </div>
    </>
}

export default TodayWeather;