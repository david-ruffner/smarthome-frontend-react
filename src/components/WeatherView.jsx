

function WeatherView({ isWeatherViewVisible, isDashboardVisible }) {

    return (
        <>
            <div id={'weather-container'} className={`frosted-glass ${isWeatherViewVisible && isDashboardVisible ? 'is-visible' : ''}`}>
                <div id={'weather-nav-container'}>

                </div>
            </div>
        </>
    )
}

export default WeatherView;