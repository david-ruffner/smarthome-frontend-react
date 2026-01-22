import {useUI} from "../../context/UIContext.jsx";

function WeatherViewBtn({ name, weatherView, customStyles }) {

    const {
        toggleWeatherView, currentWeatherView
    } = useUI();

    function onClick() {
        toggleWeatherView(weatherView);
    }

    function isActive() {
        return currentWeatherView === weatherView;
    }

    return <>
        <button onClick={onClick} className={`weather-view-btn ${isActive() ? 'active-weather-view-btn' : ''}`}
                data-weather-view={weatherView} style={customStyles}>
            <h1>{name}</h1>
        </button>
    </>
}

export default WeatherViewBtn;