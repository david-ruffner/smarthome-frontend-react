import "/src/css/Dashboard.css"
import WeatherView from "../components/weather/WeatherView.jsx";
import {useUI} from "../context/UIContext.jsx";
import {useEffect, useState} from "react";
import SwipeContainer from "../components/SwipeContainer.jsx";
import DashboardTrolley from "../components/DashboardTrolley.jsx";

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
                #dashboard-container {
                    width: 720px;
                    max-width: 720px;
                    overflow-x: hidden;
                    position: relative;
                    height: 100vh;
                
                    transition: opacity 500ms ease-in-out;
                    opacity: 0;
                    pointer-events: none;
                    visibility: hidden;
                }
            
                #dashboard-container.is-visible {
                    pointer-events: auto;
                    opacity: 1;
                    visibility: visible;
                }
                
                #navbar-container {
                    padding: 15px;
                    /*width: 100vw;*/
                }
                
                #navbar-container > h1 {
                    text-align: center;
                }
            
                .dashboard-viewport {
                    width: 720px;
                    max-width: 720px;
                    overflow-x: hidden;
                    position: relative;
                    touch-action: pan-y;
                    overscroll-behavior-x: none;
                }
            
                #dashboard-carousel {
                    width: 2250px;
                    display: grid;
                    grid-template-columns: repeat(3, auto);
                    position: relative;
                    will-change: transform;
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

                <DashboardTrolley />

                <SwipeContainer>
                    <div className={'dashboard-viewport'}>
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
                    </div>
                </SwipeContainer>
            </div>
        </>
    )
}

export default Dashboard;