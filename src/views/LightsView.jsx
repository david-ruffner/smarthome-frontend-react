import {BACKEND_HOST} from "../components/Constants.jsx";
import {useEffect, useRef, useState} from "react";
import {determineFGLightness, hexToRgb, isArrayEmpty, isObjEmpty, rgbToHex, stripRGBA} from "../utils/Utils.js";
import LightBulbTile from "../components/lights/LightBulbTile.jsx";
import HueRoom from "../components/lights/HueRoom.js"
import LightBulb from "../components/lights/LightBulb.js"
import {useLightsUI} from "../components/lights/LightsUIContext.jsx";
import LightToggle from "../components/lights/LightToggle.jsx";
import BrightnessSlider from "../components/lights/BrightnessSlider.jsx";
import {changeBrightness, changeColor} from "../components/lights/LightUtils.js";
import * as ColorWheel from "react-hsv-ring";
import FavoriteColor from "../components/lights/FavoriteColor.jsx";
import {useUI} from "../context/UIContext.jsx";
import {notify} from "../services/NotificationService.jsx";

function LightsView() {

    const {
        isLightsViewVisible
    } = useUI();

    const {
        hueRooms, setHueRooms,
        selectedRoom, setSelectedRoom,
        lightBulbs, setLightBulbs,
        selectedLightBulb,
        updateLightBulb,
        toggleLight,
        pendingColorRef, setPendingColorRef
    } = useLightsUI();

    const [ favoriteRoomColors, setFavoriteRoomColors ] = useState([]);
    const [ currentGroupId, setCurrentGroupId ] = useState(null);
    const [ currentRoomId, setCurrentRoomId ] = useState(null);
    const [ currentPickedColor, setCurrentPickedColor ] = useState(null);
    const [ currentBrightness, setCurrentBrightness ] = useState(null);

    async function fetchRoomNames() {
        if (!isLightsViewVisible) return null;

        const roomNamesResp = await fetch(`${BACKEND_HOST}/lights/getRooms`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return await roomNamesResp.json();
    }

    async function addFavoriteColor() {
        if (!isLightsViewVisible) return null;

        if (!currentPickedColor || !currentPickedColor.red) {
            notify("Please select a color first");
            return;
        }

        await fetch(`${BACKEND_HOST}/favorites/addFavorite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rgb: {
                    red: currentPickedColor.red,
                    green: currentPickedColor.green,
                    blue: currentPickedColor.blue,
                    alpha: currentBrightness
                },
                roomId: currentRoomId
            })
        });

        reloadFavoriteColors();
    }

    async function fetchRoomLights(roomId) {
        if (!isLightsViewVisible) return null;

        const roomNamesResp = await fetch(`${BACKEND_HOST}/lights/getRoom/${roomId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const jsonResp = await roomNamesResp.json();
        console.log(jsonResp);
        return jsonResp;
    }

    async function reloadFavoriteColors() {
        const response = await fetch(`${BACKEND_HOST}/favorites/getFavorites/${currentRoomId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const jsonResp = await response.json();

        setFavoriteRoomColors(jsonResp);
    }

    const toggleFGColor = determineFGLightness(selectedLightBulb?.color.red, selectedLightBulb?.color.green, selectedLightBulb?.color.blue);
    const avgBrightness = lightBulbs.reduce((sum, bulb) => sum + bulb.brightness, 0) / lightBulbs.length

    function handleRoomChange(e) {
        const roomId = e.target.value;
        setSelectedRoom(hueRooms.find(r => r.roomId === roomId));
    }

    useEffect(() => {
        if (!isObjEmpty(selectedRoom)) {
            setCurrentRoomId(selectedRoom.roomId);
            setCurrentGroupId(selectedRoom.groupId);

            fetchRoomLights(selectedRoom.roomId)
                .then(data => {
                    const lightBulbs = Object.entries(data.lightBulbs).map(([id, obj]) =>
                        new LightBulb(obj.brightness, obj.color, obj.deviceId, obj.lightId, obj.lightStatus, obj.name));
                    setLightBulbs(lightBulbs);
                    setFavoriteRoomColors(data.favoriteColors);
                })
        }
    }, [ selectedRoom ])

    useEffect(() => {
        if (!isArrayEmpty(hueRooms)) {
            setCurrentRoomId(hueRooms[0].roomId);
            setCurrentGroupId(hueRooms[0].groupId);

            fetchRoomLights(hueRooms[0].roomId) // TODO: Revert
                .then(data => {
                    const lightBulbs = Object.entries(data.lightBulbs).map(([id, obj]) =>
                        new LightBulb(obj.brightness, obj.color, obj.deviceId, obj.lightId, obj.lightStatus, obj.name));
                    setLightBulbs(lightBulbs);
                    setFavoriteRoomColors(data.favoriteColors);
                })
        }
    }, [ hueRooms ]);

    useEffect(() => {
        fetchRoomNames()
            .then(data => {
                if (data !== null) {
                    const rooms = Object.entries(data).map(([id, obj]) => new HueRoom(id, obj.name, obj.groupToggleId));
                    setHueRooms(rooms);
                }
            })
    }, [isLightsViewVisible]);

    function onToggleClick() {
        lightBulbs.forEach(lb => {
            lb.lightStatus = !lb.lightStatus;
            toggleLight(lb.lightId, lb.lightStatus);
            updateLightBulb(lb);
        })
    }

    function onBrightnessChange(newBrightness0to100) {
        // If your backend expects 0..1, convert here:
        const normalized = newBrightness0to100 / 100;

        setCurrentBrightness(normalized);

        lightBulbs.forEach(bulb => {
            bulb.brightness = newBrightness0to100;
            updateLightBulb(bulb);
            changeBrightness(bulb.lightId, normalized);
        })
    }

    function handleColorRelease() {
        const newRgb = hexToRgb(pendingColorRef.current);

        setCurrentPickedColor(newRgb);

        lightBulbs.forEach(bulb => {
            const updated = {
                ...bulb,
                color: newRgb
            }

            updateLightBulb(updated);
            changeColor(updated.lightId, updated.brightness, newRgb);
        })
    }

    return <>
        <style>
            {`
                #room-select {
                    font-family: Roboto, sans-serif;
                    font-size: 32pt;
                    font-weight: 400;
                    padding: 15px;
                    border-radius: 25px;
                    margin-top: 25px;
                }
                
                #light-bulb-tiles {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    grid-column-gap: 50px;
                    grid-row-gap: 50px;
                    padding: 50px;
                }
                
                hr {
                    width: 75%;
                    margin-bottom: 50px;
                }
                
                #room-controls {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    grid-row-gap: 100px;
                }
                
                .lv-text {
                    user-select: none;
                    align-self: center;
                }
                
                .lv-value {
                    align-self: center;
                }
                
                #lv-favorites-header {
                    grid-row: 4;
                    grid-column: 1;
                }
                
                #add-favorite-color-btn {
                    grid-row: 5;
                    grid-column: 1 / span 2;
                    margin-bottom: 100px;
                    font-size: 22pt;
                    font-weight: 500;
                    justify-self: center;
                    text-align: center;
                    background-color: var(--frosted-glass-blue-background);
                    display: block;
                }
                
                #lv-light-toggle {
                    width: 80%;
                    height: 65px;
                    border-radius: 35px;
                    display: grid;
                }
                
                #lv-light-toggle-bg {
                    width: 100%;
                    height: 65px;
                    border-radius: 65px;
                    z-index: 15;
                    grid-column: 1;
                    grid-row: 1;
                }
                
                #lv-light-toggle-fg {
                    width: 100%;
                    height: 65px;
                    border-radius: 65px;
                    z-index: 55;
                    grid-column: 1;
                    grid-row: 1;
                    transition: background 300ms ease-in-out;
                    background: none;
                }
                
                #lv-light-toggle-fg.lv-light-toggle-on {
                    background: rgb(${lightBulbs[0]?.color.red}, ${lightBulbs[0]?.color.green}, ${lightBulbs[0]?.color.blue});
                }
                
                #lv-light-toggle-circle {
                    position: relative;
                    left: 5%;
                    grid-column: 1;
                    grid-row: 1;
                    z-index: 85;
                    width: 20%;
                    height: 75%;
                    align-self: center;
                    border-radius: 50px;
                    background: rgb(${lightBulbs[0]?.color.red}, ${lightBulbs[0]?.color.green}, ${lightBulbs[0]?.color.blue});
                    transition: left 500ms ease-in-out;
                }
                
                #lv-light-toggle-circle.lv-light-toggle-on {
                    background: ${toggleFGColor};
                    left: 75%;
                }
                
                #lv-favorites-container {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-row-gap: 25px;
                }
            `}
        </style>

        <h1>Lights</h1>

        <select value={selectedRoom !== null ? selectedRoom.name : 'None'}
                onChange={handleRoomChange}
                id={'room-select'}>
            {hueRooms.map(room => (
                <option key={room.roomId} value={room.roomId}>
                    {room.roomName}
                </option>
            ))}
        </select>

        {/* Light Bulbs */}
        <div id={'light-bulb-tiles'}>
            {lightBulbs.map(lightBulb => (
                <LightBulbTile
                    lightBulb={lightBulb}
                />
            ))}
        </div>

        <hr/>

        {/* Room Controls */}
        <div id={'room-controls'}>
            <h2 className={'ml-text'}>On/Off</h2>
            <div id={'lv-light-toggle'} onClick={onToggleClick} className={'lv-value'}>
                <div id={'lv-light-toggle-bg'} className={'frosted-glass'}></div>
                <div id={'lv-light-toggle-fg'} className={lightBulbs[0]?.lightStatus ? 'lv-light-toggle-on' : ''}></div>
                <div id={'lv-light-toggle-circle'} className={lightBulbs[0]?.lightStatus ? 'lv-light-toggle-on' : ''}></div>
            </div>

            <h2 className={'lv-text'}>Brightness</h2>
            <div id={'lv-brightness'} className={'lv-value'}>
                <BrightnessSlider
                    value={avgBrightness}
                    onValueChange={onBrightnessChange}
                />
            </div>

            <h2 className={'lv-text'}>Color</h2>
            <div id={'lv-color-picker'} className={'lv-value'}>
                <div
                    onPointerUp={handleColorRelease}>
                    <ColorWheel.Root
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

            <h2 id={'lv-favorites-header'} className={'lv-text'}>Favorite Colors</h2>
            <button id={'add-favorite-color-btn'} onClick={addFavoriteColor}>Add Favorite</button>
            <div id={'lv-favorites-container'} className={'lv-value'}>
                {favoriteRoomColors.map(roomColor => (
                    <FavoriteColor
                        groupId={currentGroupId}
                        roomId={roomColor.roomId}
                        rgbaStr={roomColor.RGBAsString}
                        colorStr={stripRGBA(roomColor.RGBAsString)}
                        favoriteColorId={roomColor.favoriteColorId}
                    />
                ))}
            </div>
        </div>
    </>
}

export default LightsView;