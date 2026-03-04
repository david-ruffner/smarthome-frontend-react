import {BACKEND_HOST} from "../components/Constants.jsx";
import {useEffect, useState} from "react";
import {isArrayEmpty, isObjEmpty} from "../utils/Utils.js";
import LightBulbTile from "../components/lights/LightBulbTile.jsx";
import HueRoom from "../components/lights/HueRoom.js"
import LightBulb from "../components/lights/LightBulb.js"
import {useLightsUI} from "../components/lights/LightsUIContext.jsx";

function LightsView() {

    const {
        hueRooms, setHueRooms,
        selectedRoom, setSelectedRoom,
        lightBulbs, setLightBulbs
    } = useLightsUI();

    async function fetchRoomNames() {

        const roomNamesResp = await fetch(`${BACKEND_HOST}/lights/getRooms`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return await roomNamesResp.json();
    }

    async function fetchRoomLights(roomId) {

        const roomNamesResp = await fetch(`${BACKEND_HOST}/lights/getRoom/${roomId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return await roomNamesResp.json();
    }

    function handleRoomChange(e) {
        const roomId = e.target.value;
        setSelectedRoom(hueRooms.find(r => r.roomId === roomId));
    }

    useEffect(() => {
        if (!isObjEmpty(selectedRoom)) {
            fetchRoomLights(selectedRoom.roomId)
                .then(data => {
                    const lightBulbs = Object.entries(data.lightBulbs).map(([id, obj]) =>
                        new LightBulb(obj.brightness, obj.color, obj.deviceId, obj.lightId, obj.lightStatus, obj.name));
                    setLightBulbs(lightBulbs)
                })
        }
    }, [ selectedRoom ])

    useEffect(() => {
        if (!isArrayEmpty(hueRooms)) {
            // fetchRoomLights(hueRooms[0].roomId) // TODO: Revert
            fetchRoomLights(hueRooms.find((r) => r.roomName === 'Office').roomId)
                .then(data => {
                    const lightBulbs = Object.entries(data.lightBulbs).map(([id, obj]) =>
                        new LightBulb(obj.brightness, obj.color, obj.deviceId, obj.lightId, obj.lightStatus, obj.name));
                    setLightBulbs(lightBulbs);
                })
        }
    }, [ hueRooms ]);

    // When lightBulbs is updated
    // useEffect(() => {
    //     // console.log(lightBulbs);
    // }, [lightBulbs]);

    useEffect(() => {
        fetchRoomNames()
            .then(data => {
                const rooms = Object.entries(data).map(([id, obj]) => new HueRoom(id, obj.name));
                setHueRooms(rooms);
            })
    }, []);

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
    </>
}

export default LightsView;