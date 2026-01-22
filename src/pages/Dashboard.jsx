import "/src/css/Dashboard.css"
import WeatherView from "../components/weather/WeatherView.jsx";
import {useUI} from "../context/UIContext.jsx";
import {useEffect, useState} from "react";
import SwipeContainer from "../components/SwipeContainer.jsx";

function Dashboard() {

    const {
        isDashboardVisible, setIsDashboardVisible,
        friendlyName, isWeatherViewVisible,
        setIsWeatherViewVisible, currentDashboardIndex,
        dashboardOffset, slideDashboardCarousel
    } = useUI();

    // TODO: Remove
    // useEffect(() => {
    //     setTimeout(() => {
    //         slideDashboardCarousel(1);
    //     }, 3000)
    // }, []);



    return (
        <>
            <style>{`
                #dashboard-carousel {
                    width: 2250px;
                    display: grid;
                    grid-template-columns: repeat(3, auto);
                    position: absolute;
                    transition: transform 400ms ease;
                }
                
                .parent-card {
                    width: 720px;
                }
            `}</style>

            <div id={'dashboard-container'} className={isDashboardVisible ? 'is-visible' : ''}>
                <div id={'navbar-container'} className={`frosted-glass`}>
                    <h1>Hi, {friendlyName}!</h1>
                </div>

                <SwipeContainer>
                    <div id={'dashboard-carousel'} style={{
                        transform: `translateX(${dashboardOffset}px)`
                    }}>
                        <div data-index={-1} id={'todoist-parent'} className={'parent-card'}>
                            <h1>Todoist</h1>
                        </div>
                        <div data-index={0} id={'weather-parent'} className={'parent-card'}>
                            <WeatherView
                                isWeatherViewVisible={isWeatherViewVisible}
                            />
                        </div>
                        <div data-index={1} id={'lights-parent'} className={'parent-card'}>
                            <h1>Lights</h1>
                        </div>
                    </div>
                </SwipeContainer>
            </div>
        </>
    )
}

export default Dashboard;