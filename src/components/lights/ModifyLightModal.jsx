import AppTrayIcon from "../AppTrayIcon.jsx";
import {useUI} from "../../context/UIContext.jsx";
import {useLightsUI} from "./LightsUIContext.jsx";
import {determineFGLightness, isObjEmpty} from "../../utils/Utils.js";
import {useState} from "react";
import BrightnessSlider from "./BrightnessSlider.jsx";
import {BACKEND_HOST} from "../Constants.jsx";
import CircularColorPicker from "./ColorPicker.jsx";


function ModifyLightModal() {
    const {
        isModifyLightOpen, setIsModifyLightOpen,
        setLockDashboard
    } = useUI();

    const {
        selectedLightBulb,
        updateLightBulb,
        toggleLight
    } = useLightsUI();

    if (isModifyLightOpen) {
        setLockDashboard(true);
    }

    function onModalClose() {
        setIsModifyLightOpen(false);
        setLockDashboard(false);
    }

    function onToggleClick() {
        selectedLightBulb.lightStatus = !selectedLightBulb.lightStatus;
        toggleLight(selectedLightBulb.lightId, selectedLightBulb.lightStatus);
        updateLightBulb(selectedLightBulb);
    }

    async function changeBrightness(lightId, brightness) {
        await fetch(`${BACKEND_HOST}/lights/modifyLight`, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({
                'dimPercent': (brightness * 100),
                'lightId': lightId
            })
        })
    }

    async function changeColor(lightId, brightness, rgb) {
        await fetch(`${BACKEND_HOST}/lights/modifyLight`, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({
                'dimPercent': (brightness * 100),
                'lightId': lightId,
                'rgb': {
                    'red': rgb.r,
                    'green': rgb.g,
                    'blue': rgb.b
                }
            })
        })
    }

    function onBrightnessChange(newBrightness0to100) {
        // If your backend expects 0..1, convert here:
        const normalized = newBrightness0to100 / 100;

        selectedLightBulb.brightness = normalized;
        updateLightBulb(selectedLightBulb);

        changeBrightness(selectedLightBulb.lightId, selectedLightBulb.brightness);

        // optional: call backend endpoint if you have one
        // setBrightness(selectedLightBulb.lightId, normalized);
    }

    function onColorChange(rgb) {
        // Update UI immediately
        selectedLightBulb.color = {
            red: rgb.r,
            green: rgb.g,
            blue: rgb.b
        };

        updateLightBulb(selectedLightBulb);

        // Persist to backend (only called on release)
        changeColor(selectedLightBulb.lightId, selectedLightBulb.brightness, rgb);
    }

    const textColor = determineFGLightness(selectedLightBulb?.color.red, selectedLightBulb?.color.green, selectedLightBulb?.color.blue);
    const toggleFGColor = determineFGLightness(selectedLightBulb?.color.red, selectedLightBulb?.color.green, selectedLightBulb?.color.blue);

    return <>
        <style>
            {`
                .modal-bg {
                    top: 0;
                }
                
                #modify-light-modal {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    display: grid;
                    z-index: 100;
                }
                
                #modify-light-modal-close {
                    justify-self: right;
                    width: 50px;
                    margin: 25px 25px 0 0;
                }
                
                #modify-light-body {
                    width: 85vw;
                    height: 1000px;
                    justify-self: center;
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    grid-template-rows: repeat(4, auto);
                }
                
                #modify-light-header {
                    grid-column: 1 / span 2;
                    width: 95%;
                    height: fit-content;
                    border-radius: 10px;
                    padding: 15px;
                    justify-self: center;
                    text-align: center;
                    background: rgba(${selectedLightBulb?.color.red}, ${selectedLightBulb?.color.green}, ${selectedLightBulb?.color.blue}, ${selectedLightBulb?.brightness});
                }
                
                #modify-light-header > h1 {
                    font-size: 32pt;
                    font-weight: 400;
                    color: ${textColor};
                }
                
                .ml-text {
                    align-self: center;
                }
                
                .ml-value {
                    align-self: center;
                }
                
                #ml-light-toggle {
                    width: 80%;
                    height: 65px;
                    border-radius: 35px;
                    display: grid;
                }
                
                #ml-light-toggle-bg {
                    width: 100%;
                    height: 65px;
                    border-radius: 65px;
                    z-index: 100;
                    grid-column: 1;
                    grid-row: 1;
                }
                
                #ml-light-toggle-fg {
                    width: 100%;
                    height: 65px;
                    border-radius: 65px;
                    z-index: 150;
                    grid-column: 1;
                    grid-row: 1;
                    transition: background 300ms ease-in-out;
                    background: none;
                }
                
                #ml-light-toggle-fg.ml-light-toggle-on {
                    background: rgba(${selectedLightBulb?.color.red}, ${selectedLightBulb?.color.green}, ${selectedLightBulb?.color.blue}, ${selectedLightBulb?.brightness});
                }
                
                #ml-light-toggle-circle {
                    position: relative;
                    left: 5%;
                    grid-column: 1;
                    grid-row: 1;
                    z-index: 200;
                    width: 20%;
                    height: 75%;
                    align-self: center;
                    border-radius: 50px;
                    background: rgba(${selectedLightBulb?.color.red}, ${selectedLightBulb?.color.green}, ${selectedLightBulb?.color.blue}, ${selectedLightBulb?.brightness});
                    transition: left 500ms ease-in-out;
                }
                
                #ml-light-toggle-circle.ml-light-toggle-on {
                    background: ${toggleFGColor};
                    left: 75%;
                }
            `}
        </style>

        <div className={`modal-bg ${isModifyLightOpen ? 'is-visible' : ''}`}></div>

        <div id={'modify-light-modal'} className={`${isModifyLightOpen ? 'is-visible' : 'is-hidden'}`}>
            <img id={'modify-light-modal-close'} onClick={onModalClose}
                 src="/src/assets/images/common/close-icon-white.png" alt=""/>

            <div id={'modify-light-body'} className={'frosted-glass'}>
                <div id={'modify-light-header'}>
                    <h1>{selectedLightBulb?.lightName}</h1>
                </div>

                {/* Light Toggle */}
                <h2 className={'ml-text'}>On/Off</h2>
                <div id={'ml-light-toggle'} onClick={onToggleClick} className={'ml-value'}>
                    <div id={'ml-light-toggle-bg'} className={'frosted-glass'}></div>
                    <div id={'ml-light-toggle-fg'} className={selectedLightBulb?.lightStatus ? 'ml-light-toggle-on' : ''}></div>
                    <div id={'ml-light-toggle-circle'} className={selectedLightBulb?.lightStatus ? 'ml-light-toggle-on' : ''}></div>
                </div>

                {/* Brightness Slider */}
                <h2 className={'ml-text'}>Brightness</h2>
                <div id={'ml-brightness'} className={'ml-value'}>
                    <BrightnessSlider
                        value={Math.round((selectedLightBulb?.brightness ?? 0) * 100)}
                        onValueChange={onBrightnessChange}
                    />
                </div>

                {/* Color Picker */}
                <h2 className={'ml-text'}>Color</h2>
                <div id={'ml-color-picker'} className={'ml-value'}>
                    <CircularColorPicker
                        size={260}
                        value={{
                            red: selectedLightBulb?.color?.red ?? 255,
                            green: selectedLightBulb?.color?.green ?? 255,
                            blue: selectedLightBulb?.color?.blue ?? 255,
                        }}
                        onColorChange={onColorChange}
                        disabled={!selectedLightBulb?.lightStatus} // optional
                        label={"Color"}
                    />
                </div>
            </div>
        </div>
    </>
}

export default ModifyLightModal;