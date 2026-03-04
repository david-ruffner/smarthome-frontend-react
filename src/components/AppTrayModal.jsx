import {useUI} from "../context/UIContext.jsx";
import AppTrayIcon from "./AppTrayIcon.jsx";


function AppTrayModal() {

    const {
        isAppTrayOpen, setIsAppTrayOpen,
        setLockDashboard,
        setIsWeatherViewVisible, setIsTodoistViewVisible,
        setIsLightsViewVisible, setIsCalendarViewVisible
    } = useUI();

    if (isAppTrayOpen) {
        setLockDashboard(true);
    }

    function onAppTrayCloseClick() {
        setIsAppTrayOpen(false);
        setLockDashboard(false);
    }

    return <>
        <style>
            {`
                .modal-bg {
                    top: 0;
                }
                
                #app-tray {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    display: grid;
                    z-index: 300;
                    grid-template-columns: repeat(3, 1fr);
                    grid-column-gap: 25px;
                }
                
                #app-tray-close {
                    justify-self: right;
                    width: 50px;
                    margin: 25px 25px 0 0;
                    grid-column: 1 / span 3;
                }
            `}
        </style>

        <div className={`modal-bg ${isAppTrayOpen ? 'is-visible' : ''}`}></div>

        <div id={'app-tray'} className={`${isAppTrayOpen ? 'is-visible' : 'is-hidden'}`}>
            <img id={'app-tray-close'} onClick={onAppTrayCloseClick}
                 src="/src/assets/images/common/close-icon-white.png" alt=""/>

            <AppTrayIcon
                imgSrc={'/src/assets/images/weather-icons/weather_icon_cloudy_white.png'}
                name={'Weather'}
                visibilitySetter={setIsWeatherViewVisible}
            />

            <AppTrayIcon
                imgSrc={'/src/assets/images/appTray/todo-app-tray-icon-white.png'}
                name={'Todoist'}
                visibilitySetter={setIsTodoistViewVisible}
            />

            <AppTrayIcon
                imgSrc={'/src/assets/images/appTray/lights-app-tray-icon-white.png'}
                name={'Lights'}
                visibilitySetter={setIsLightsViewVisible}
            />

            <AppTrayIcon
                imgSrc={'/src/assets/images/appTray/calendar-app-tray-icon-white.png'}
                name={'Calendar'}
                visibilitySetter={setIsCalendarViewVisible}
            />

            <AppTrayIcon
                imgSrc={'/src/assets/images/appTray/vehicles-app-tray-icon-white.png'}
                name={'Vehicles'}
            />

            <AppTrayIcon
                imgSrc={'/src/assets/images/appTray/inventory-app-tray-icon-white.png'}
                name={'Inventory'}
            />
        </div>
    </>
}

export default AppTrayModal;