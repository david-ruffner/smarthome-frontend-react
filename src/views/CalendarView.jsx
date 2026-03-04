import {useState} from "react";
import TodayTimeEntry from "../components/calendar/TodayTimeEntry.jsx";


function CalendarView() {

    const [ isTodayCalendarPanelVisible, setIsTodayCalendarPanelVisible ] = useState(true);
    const [ isTomorrowCalendarPanelVisible, setIsTomorrowCalendarPanelVisible ] = useState(false);
    const [ is3DayCalendarPanelVisible, setIs3DayCalendarPanelVisible ] = useState(false);
    const [ is7DayCalendarPanelVisible, setIs7DayCalendarPanelVisible ] = useState(false);

    function hideAllPanels() {
        setIsTodayCalendarPanelVisible(false);
        setIsTomorrowCalendarPanelVisible(false);
        setIs3DayCalendarPanelVisible(false);
        setIs7DayCalendarPanelVisible(false);
    }

    return <>
        <style>
            {`
                #calendar-outer {
                    margin: 75px auto auto auto;
                }
                
                .panel{
                  width: 90vw;
                  height: 75vh;
                  margin: auto;
                  position: relative;
                  padding-top: 28px; /* room for tab bar */
                  overflow: visible;
                }
                
                /* NEW: the tab bar controls positioning + spacing */
                .folder-tabs{
                  position: absolute;
                  top: -38px;
                  left: 24px;
                
                  display: flex;
                  gap: 12px;          /* spacing between tabs */
                  align-items: flex-end;
                }
                
                /* Option A: clip-path folder tab */
                .folder-tab{
                  position: relative;
                
                  height: 36px;
                  padding: 0 18px;
                
                  display: inline-flex;
                  align-items: center;
                
                  border-radius: 12px 12px 0 0;
                
                  /* visually merge with panel */
                  border-bottom: none;
                
                  font-weight: 400;
                  font-size: 20pt;
                  letter-spacing: .03em;
                
                  clip-path: polygon(
                    0% 100%,
                    0% 35%,
                    10% 0%,
                    100% 0%,
                    100% 100%
                  );
                }
                
                .panel-body {
                    display: grid;
                }
                
                .inner-panel {
                    position: relative;
                    overflow: scroll;
                    grid-column: 1;
                    grid-row: 1;
                    height: 900px;
                    transition: opacity 500ms ease-in-out;
                }
                
                #today-inner-panel {
                    display: grid;
                    grid-template-columns: 20% 80%;
                }
                
                #today-inner-panel > h1 {
                    grid-column: 1 / span 2;
                    justify-self: center;
                    margin-bottom: 50px;
                }
                
                .today-time-panel {
                    height: 150px;
                }
                
                .today-time-entry {
                    position: absolute;
                    width: 80%;
                    container-type: size;
                    left: 130px;
                }
                
                .today-time-entry > h3 {
                    font-weight: 400;
                    font-size: clamp(1px, 50cqh, 24pt);
                    margin: 12cqh 0 0 0;
                }
            `}
        </style>

        <h1>Calendar</h1>

        <div id={'calendar-outer'}>
            <div className="panel frosted-glass">
                <div className="folder-tabs">
                    <div
                        className={`folder-tab ${isTodayCalendarPanelVisible ? 'frosted-glass-blue' : 'frosted-glass'}`}
                        onClick={() => {
                            hideAllPanels();
                            setIsTodayCalendarPanelVisible(true);
                        }}
                    >Today</div>

                    <div
                        className={`folder-tab ${isTomorrowCalendarPanelVisible ? 'frosted-glass-blue' : 'frosted-glass'}`}
                        onClick={() => {
                            hideAllPanels();
                            setIsTomorrowCalendarPanelVisible(true);
                        }}
                    >Tomorrow</div>

                    <div
                        className={`folder-tab ${is3DayCalendarPanelVisible ? 'frosted-glass-blue' : 'frosted-glass'}`}
                        onClick={() => {
                            hideAllPanels();
                            setIs3DayCalendarPanelVisible(true);
                        }}
                    >3 Days</div>

                    <div
                        className={`folder-tab ${is7DayCalendarPanelVisible ? 'frosted-glass-blue' : 'frosted-glass'}`}
                        onClick={() => {
                            hideAllPanels();
                            setIs7DayCalendarPanelVisible(true);
                        }}
                    >7 Days</div>
                </div>

                <div className="panel-body">
                    <div id={'today-inner-panel'} className={`inner-panel ${isTodayCalendarPanelVisible ? 'is-visible' : 'is-hidden'}`}>
                        <h1>Today</h1>

                        <TodayTimeEntry
                            startTime={'2026-03-04T01:00:00-05:00'}
                            endTime={'2026-03-04T02:35:00-05:00'}
                        />

                        <h2>12 AM</h2>
                        <div className={'today-time-panel frosted-glass'}></div>
                        <h2>1 AM</h2>
                        <div className={'today-time-panel frosted-glass'}></div>
                        <h2>2 AM</h2>
                        <div className={'today-time-panel frosted-glass'}></div>
                        <h2>3 AM</h2>
                        <div className={'today-time-panel frosted-glass'}></div>
                        <h2>4 AM</h2>
                        <div className={'today-time-panel frosted-glass'}></div>
                        <h2>5 AM</h2>
                        <div className={'today-time-panel frosted-glass'}></div>
                        <h2>6 AM</h2>
                        <div className={'today-time-panel frosted-glass'}></div>
                        <h2>7 AM</h2>
                        <div className={'today-time-panel frosted-glass'}></div>
                        <h2>8 AM</h2>
                        <div className={'today-time-panel frosted-glass'}></div>
                        <h2>9 AM</h2>
                        <div className={'today-time-panel frosted-glass'}></div>
                        <h2>10 AM</h2>
                        <div className={'today-time-panel frosted-glass'}></div>
                        <h2>11 AM</h2>
                        <div className={'today-time-panel frosted-glass'}></div>
                        <h2>12 AM</h2>
                        <div className={'today-time-panel frosted-glass'}></div>
                    </div>

                    <div className={`inner-panel ${isTomorrowCalendarPanelVisible ? 'is-visible' : 'is-hidden'}`}>
                        <h1>Tomorrow</h1>
                    </div>

                    <div className={`inner-panel ${is3DayCalendarPanelVisible ? 'is-visible' : 'is-hidden'}`}>
                        <h1>3 Days</h1>
                    </div>

                    <div className={`inner-panel ${is7DayCalendarPanelVisible ? 'is-visible' : 'is-hidden'}`}>
                        <h1>7 Days</h1>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default CalendarView;