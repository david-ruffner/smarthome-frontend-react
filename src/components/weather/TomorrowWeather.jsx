import {useUI} from "../../context/UIContext.jsx";
import {useCollapseTransition} from "../../utils/ui.jsx";


function TomorrowWeather() {

    const {
        isTomorrowWeatherVisible
    } = useUI();
    const isCollapsed = useCollapseTransition(isTomorrowWeatherVisible, 500);

    const className = [
        'weather-panel',
        !isTomorrowWeatherVisible ? 'is-hiding' : '',
        isCollapsed ? 'is-collapsed' : ''
    ].filter(Boolean).join(' ');

    return <>
        <div id={'tomorrow-weather-container'} className={className}>
            <h1>Tomorrow</h1>
        </div>
    </>
}

export default TomorrowWeather;