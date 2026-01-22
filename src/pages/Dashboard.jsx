import "/src/css/Dashboard.css"
import WeatherView from "../components/weather/WeatherView.jsx";
import {useUI} from "../context/UIContext.jsx";

function Dashboard() {

    const {
        isDashboardVisible, setIsDashboardVisible,
        friendlyName, isWeatherViewVisible,
        setIsWeatherViewVisible
    } = useUI();

    // const [isWeatherViewVisible, setIsWeatherViewVisible] = useState(true) // TODO: Revert to false

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