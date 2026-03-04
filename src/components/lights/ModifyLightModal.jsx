import AppTrayIcon from "../AppTrayIcon.jsx";
import {useUI} from "../../context/UIContext.jsx";
import {useLightsUI} from "./LightsUIContext.jsx";
import {determineFGLightness, isObjEmpty} from "../../utils/Utils.js";
import {useRef, useState} from "react";
import BrightnessSlider from "./BrightnessSlider.jsx";
import {BACKEND_HOST} from "../Constants.jsx";
import CircularColorPicker from "./ColorPicker.jsx";
import {hexToRgb, rgbToHex} from "../../utils/Utils.js";
import * as ColorWheel from "react-hsv-ring";
import LightToggle from "./LightToggle.jsx";
import {changeBrightness, changeColor} from "./LightUtils.js";


function ModifyLightModal() {
    const {
        isModifyLightOpen, setIsModifyLightOpen,
        setLockDashboard
    } = useUI();

    const {
        selectedLightBulb, setSelectedLightBulb,
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
                    'red': rgb.red,
                    'green': rgb.green,
                    'blue': rgb.blue
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
    const pendingColorRef = useRef("#ff0000");

    function handleColorRelease() {
        const newRgb = hexToRgb(pendingColorRef.current);
        const updated = {
            ...selectedLightBulb,
            color: newRgb
        }

        setSelectedLightBulb(updated);
        updateLightBulb(updated);

        console.log(newRgb);
        changeColor(updated.lightId, updated.brightness, newRgb);
    }

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
                    grid-template-rows: repeat(4, fit-content(100%));
                    grid-row-gap: 100px;
                }
                
                #modify-light-header {
                    grid-column: 1 / span 2;
                    width: 95%;
                    height: fit-content;
                    border-radius: 10px;
                    padding: 15px;
                    justify-self: center;
                    text-align: center;
                    background: rgb(${selectedLightBulb?.color.red}, ${selectedLightBulb?.color.green}, ${selectedLightBulb?.color.blue});
                }
                
                #modify-light-header > h1 {
                    font-size: 32pt;
                    font-weight: 400;
                    color: ${textColor};
                }
                
                .ml-text {
                    user-select: none;
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
                    background: rgb(${selectedLightBulb?.color.red}, ${selectedLightBulb?.color.green}, ${selectedLightBulb?.color.blue});
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
                    background: rgb(${selectedLightBulb?.color.red}, ${selectedLightBulb?.color.green}, ${selectedLightBulb?.color.blue});
                    transition: left 500ms ease-in-out;
                }
                
                #ml-light-toggle-circle.ml-light-toggle-on {
                    background: ${toggleFGColor};
                    left: 75%;
                }
            `}
        </style>

        <div className={`modal-bg ${isModifyLightOpen ? 'is-visible' : ''}`}></div>

        <div id={'modify-light-modal'}
             className={`${isModifyLightOpen ? 'is-visible' : 'is-hidden'}`}
             onContextMenu={(e) => e.preventDefault()}>
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
                        value={(selectedLightBulb?.brightness ?? 0) * 100}
                        onValueChange={onBrightnessChange}
                    />
                </div>

                {/* Color Picker */}
                <h2 className={'ml-text'}>Color</h2>
                <div id={'ml-color-picker'} className={'ml-value'}>
                    <div
                        onPointerUp={handleColorRelease}>
                        <ColorWheel.Root
                            value={rgbToHex(selectedLightBulb?.color)}
                            onValueChange={(val) => {
                                pendingColorRef.current = val;
                            }}
                        >
                            <ColorWheel.Wheel size={220} ringWidth={22}>
                                <ColorWheel.HueRing />
                                <ColorWheel.HueThumb />

                                <ColorWheel.Area />
                                <ColorWheel.AreaThumb />
                            </ColorWheel.Wheel>
                        </ColorWheel.Root>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ModifyLightModal;