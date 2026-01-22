import "/src/css/Dashboard.css"
import {useState} from "react";
import WeatherView from "../components/WeatherView.jsx";

function Dashboard({ isDashboardVisible, setIsDashboardVisible, friendlyName }) {

    const [isWeatherViewVisible, setIsWeatherViewVisible] = useState(true) // TODO: Revert to false

    return (
        <>
            <div id={'dashboard-container'} className={isDashboardVisible ? 'is-visible' : ''}>
                <div id={'navbar-container'} className={`frosted-glass`}>
                    <h1>Hi, {friendlyName}!</h1>
                </div>
                <WeatherView
                    isWeatherViewVisible={isWeatherViewVisible}
                    />
            </div>
        </>
    )
}

export default Dashboard;