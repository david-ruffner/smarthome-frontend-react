import {useRef} from "react";
import {determineFGLightness} from "../../utils/Utils.js";


function LightToggle({ isOn, isOnBGColor, isOnFGColor, onToggleClick, height }) {

    const toggleFGColor = determineFGLightness(isOnFGColor?.red, isOnFGColor?.green, isOnFGColor?.blue);

    return <>
        <style>
            {`
                .light-toggle {
                    width: 80%;
                    height: ${parseInt(height.split('px')[0]) + 15}px; // Add 15px of height to the outer container
                    border-radius: 35px;
                    display: grid;
                }
                
                .light-toggle-bg {
                    width: 100%;
                    height: ${height};
                    border-radius: 65px;
                    z-index: 100;
                    grid-column: 1;
                    grid-row: 1;
                }
                
                .light-toggle-fg {
                    width: 100%;
                    height: ${height};
                    border-radius: 65px;
                    z-index: 150;
                    grid-column: 1;
                    grid-row: 1;
                    transition: background 300ms ease-in-out;
                    background: none;
                }
                
                .light-toggle-fg.light-toggle-on {
                    background: rgb(${isOnBGColor?.red}, ${isOnBGColor?.green}, ${isOnBGColor?.blue});
                }
                
                .light-toggle-circle {
                    position: relative;
                    left: 5%;
                    grid-column: 1;
                    grid-row: 1;
                    z-index: 200;
                    width: 20%;
                    height: 75%;
                    align-self: center;
                    border-radius: 50px;
                    background: rgb(${isOnFGColor?.red}, ${isOnFGColor?.green}, ${isOnFGColor?.blue});
                    transition: left 500ms ease-in-out;
                }
                
                .light-toggle-circle.light-toggle-on {
                    background: ${toggleFGColor};
                    left: 75%;
                }
            `}
        </style>

        <div onClick={onToggleClick} className={'light-toggle'}>
            <div className={'frosted-glass light-toggle-bg'}></div>
            <div className={`light-toggle-fg ${isOn ? 'light-toggle-on' : ''}`}></div>
            <div className={`light-toggle-circle ${isOn ? 'light-toggle-on' : ''}`}></div>
        </div>
    </>
}

export default LightToggle;
