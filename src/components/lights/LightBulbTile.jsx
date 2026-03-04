import {useEffect, useRef, useState} from "react";
import {BACKEND_HOST} from "../Constants.jsx";
import {useLightsUI} from "./LightsUIContext.jsx";
import {useUI} from "../../context/UIContext.jsx";

/**
 *
 * @param lightBulb - LightBulbTile type (see LightsView.jsx)
 * @return {React.JSX.Element}
 * @constructor
 */
function LightBulbTile({ lightBulb }) {

    const {
        lightBulbs, updateLightBulb, getLightBulb,
        toggleLight,
        showModifyLightModal,
        selectedLightBulb, setSelectedLightBulb
    } = useLightsUI();

    const {
        isModifyLightOpen
    } = useUI();

    const textColor =
        (lightBulb.color.red > 170 || lightBulb.color.green > 170 || lightBulb.color.blue > 170)
            ? "black"
            : "white";

    const onStyle = {
        background: `rgb(${lightBulb.color.red}, ${lightBulb.color.green}, ${lightBulb.color.blue})`,
        color: textColor,
        opacity: (lightBulb.brightness > 1) ? lightBulb.brightness / 100 : lightBulb.brightness
    };

    const offStyle = {
        background: "none",
        color: `rgb(${lightBulb.color.red}, ${lightBulb.color.green}, ${lightBulb.color.blue})`,
        border: `2px solid rgb(${lightBulb.color.red}, ${lightBulb.color.green}, ${lightBulb.color.blue})`,
        opacity: (lightBulb.brightness > 1) ? lightBulb.brightness / 100 : lightBulb.brightness
    };

    const timerRef = useRef(null);
    const didLongPressRef = useRef(false);

    const LONG_PRESS_MS = 500;

    function handleShortPress(e) {
        const lightId = e.currentTarget.dataset.lightId;
        const lightBulb = getLightBulb(lightId);
        const lightStatus = !lightBulb.lightStatus;

        console.log(`Light ID: ${lightId}`);
        console.log(`New Light Status: ${lightStatus}`);
        toggleLight(lightId, lightStatus);

        lightBulb.lightStatus = lightStatus;
        updateLightBulb(lightBulb);
    }

    function handleLongPress(lightId) {
        const lightBulb = getLightBulb(lightId);
        setSelectedLightBulb({ ...lightBulb });
    }

    function handlePressStart(e) {
        if (isModifyLightOpen) return;

        didLongPressRef.current = false;

        const lightId = e.currentTarget.dataset.lightId;

        timerRef.current = setTimeout(() => {
            didLongPressRef.current = true;
            console.log("Long press");
            handleLongPress(lightId);
        }, LONG_PRESS_MS);
    }

    function handlePressEnd(e) {
        if (isModifyLightOpen) return;

        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (!didLongPressRef.current) {
            console.log("Short press");
            handleShortPress(e);
        }
    }

    useEffect(() => {
        showModifyLightModal(selectedLightBulb);
    }, [selectedLightBulb]);

    return <>
        <style>
            {`
                .light-bulb-tile {
                    font-size: 8pt;
                    font-weight: 400;
                    padding: 25px;
                    border-radius: 25px;
                    user-select: none;
                    transition: color 0.25s ease,
                                background 0.25s ease,
                                border 0.25s ease;
                }
            `}
        </style>

        <div className={`light-bulb-tile ${lightBulb.lightStatus ? 'is-on' : 'is-off'}`}
             style={lightBulb.lightStatus ? onStyle : offStyle}
             onPointerDown={handlePressStart}
             onPointerUp={handlePressEnd}
             onPointerLeave={() => clearTimeout(timerRef.current)}
             onContextMenu={(e) => e.preventDefault()}
             data-light-id={lightBulb.lightId}
        >
            <h1>{lightBulb.lightName}</h1>
        </div>
    </>
}

export default LightBulbTile;