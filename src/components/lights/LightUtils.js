import {determineFGLightness} from "../../utils/Utils.js";
import {BACKEND_HOST} from "../Constants.jsx";

export async function changeBrightness(lightId, brightness) {
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

export async function changeColor(lightId, brightness, rgb) {
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