import "/src/css/Dashboard.css"
import WeatherView from "../components/weather/WeatherView.jsx";
import {useUI} from "../context/UIContext.jsx";
import {useEffect, useState} from "react";
import SwipeContainer from "../components/SwipeContainer.jsx";
import DashboardTrolley from "../components/DashboardTrolley.jsx";
import TodoistView from "../views/TodoistView.jsx";
import TodoistLabelModal from "../components/todoist/TodoistLabelModal.jsx";
import TodoistTaskEditModal from "../components/todoist/TodoistTaskEditModal.jsx";
import AppTray from "../components/AppTray.jsx";
import AppTrayModal from "../components/AppTrayModal.jsx";
import LightsView from "../views/LightsView.jsx";
import ModifyLightModal from "../components/lights/ModifyLightModal.jsx";

function Dashboard() {

    const {
        isDashboardVisible,
        friendlyName, isWeatherViewVisible,
        lockDashboard,
        isLightsViewVisible
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
                #dashboard-stack {
                  display: grid;
                  grid-template-columns: 1fr;
                  grid-template-rows: 1fr;
                
                  width: 100%;
                  height: 100%;
                
                  position: relative;
                }
                
                .dashboard-layer {
                  grid-column: 1 / 2;
                  grid-row: 1 / 2;
                
                  width: 100%;
                  height: 100%;
                
                  position: relative;
                }
            
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
                    display: none;
                }
            
                #dashboard-container.is-visible {
                    pointer-events: auto;
                    opacity: 1;
                    visibility: visible;
                    display: block;
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
                
                #todoist-parent {
                    position: relative;
                }
            `}</style>

            <div id={'dashboard-container'} style={{overflowY: lockDashboard ? 'hidden' : 'scroll'}} className={isDashboardVisible ? 'is-visible' : ''}>
                <TodoistLabelModal />
                <AppTrayModal />
                <ModifyLightModal />
                {/*<TodoistTaskEditModal />*/}

                <div id={'navbar-container'} className={`frosted-glass`}>
                    <h1>Hi, {friendlyName}!</h1>
                </div>

                {/*<DashboardTrolley />*/}

                <AppTray />

                <SwipeContainer>
                    <div className={'dashboard-viewport'}>
                        <div id={'dashboard-stack'}>
                            <div data-index={-1} id={'todoist-parent'} className={`parent-card`}>
                                <TodoistView />
                            </div>
                            <div data-index={0} id={'weather-parent'} className={`parent-card ${isWeatherViewVisible ? 'is-visible' : 'is-hidden'}`}>
                                <WeatherView
                                    isWeatherViewVisible={isWeatherViewVisible}
                                />
                            </div>
                            <div data-index={1} id={'lights-parent'} className={`parent-card ${isLightsViewVisible ? 'is-visible' : 'is-hidden'}`}>
                                <LightsView />
                            </div>
                        </div>
                    </div>
                </SwipeContainer>
            </div>
        </>
    )
}

export default Dashboard;