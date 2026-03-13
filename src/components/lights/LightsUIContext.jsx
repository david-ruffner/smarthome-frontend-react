import {createContext, useContext, useRef, useState} from "react";
import {useUI} from "../../context/UIContext.jsx";
import {BACKEND_HOST} from "../Constants.jsx";


const LightsUIContext = createContext(null);

export function LightsUIProvider({ children }) {

    const {
        setIsModifyLightOpen
    } = useUI();

    const [ hueRooms, setHueRooms ] = useState([]);
    const [ selectedRoom, setSelectedRoom ] = useState(null);
    const [ lightBulbs, setLightBulbs ] = useState([]);
    const [ selectedLightBulb, setSelectedLightBulb ] = useState(null);
    const pendingColorRef = useRef("#ff0000");

    function updateLightBulb(updatedBulb) {
        setLightBulbs(prev =>
            prev.map(bulb =>
                bulb.lightId === updatedBulb.lightId
                    ? { ...bulb, ...updatedBulb }
                    : bulb
            )
        );
    }

    async function toggleLight(lightId, lightStatus) {
        await fetch(`${BACKEND_HOST}/lights/toggleLight`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'lightId': lightId,
                'status': lightStatus
            })
        })
    }

    function getLightBulb(lightId) {
        return lightBulbs.find((b) => b.lightId === lightId);
    }

    function showModifyLightModal(lightBulb) {
        setSelectedLightBulb(lightBulb);
        setIsModifyLightOpen(true);
    }

    return (
        <LightsUIContext.Provider value={{
            hueRooms, setHueRooms,
            selectedRoom, setSelectedRoom,
            lightBulbs, setLightBulbs,
            updateLightBulb, getLightBulb,
            selectedLightBulb, setSelectedLightBulb,
            showModifyLightModal, toggleLight,
            pendingColorRef
        }}>
            {children}
        </LightsUIContext.Provider>
    )
}

export function useLightsUI() {
    const ctx = useContext(LightsUIContext);

    if (!ctx) {
        throw new Error("useLightsUI must be used inside LightsUIContext");
    }

    return ctx;
}